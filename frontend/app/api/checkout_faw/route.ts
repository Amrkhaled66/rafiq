import { NextResponse } from "next/server";

import plans from "@/src/data/plans";

export const runtime = "nodejs";

interface User {
  name?: string;
  phone?: string;
}

interface CheckoutRequest {
  planId?: number;
  user?: User;
  name?: string;
  phone?: string;
}

interface OAuthTokenResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

let cachedAccessToken: { value: string; expiresAt: number } | null = null;

const createInvoiceNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `RAFIQ-${date}-${random}`;
};

const prepareInvoiceData = (
  user: Required<User>,
  planId: number,
  appUrl: string,
) => {
  const plan = plans.find((item) => item.id === planId);

  if (!plan) {
    return null;
  }

  const [firstName, ...lastNameParts] = user.name.trim().split(/\s+/);

  return {
    cartItems: [
      {
        name: plan.name,
        price: plan.price,
        quantity: 1,
      },
    ],
    cartTotal: plan.price,
    customer: {
      first_name: firstName,
      last_name: lastNameParts.join(" ") || firstName,
      phone: user.phone,
      customer_unique_id: user.phone,
    },
    currency: "EGP",
    invoice_number: createInvoiceNumber(),
    payLoad: {
      planId,
    },
    redirectionUrls: {
      successUrl: `${appUrl}/checkout/success`,
      failUrl: `${appUrl}/checkout_faw`,
      pendingUrl: `${appUrl}/checkout_faw`,
      backUrl: `${appUrl}/checkout_faw`,
    },
  };
};

const readResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const getAccessToken = async ({
  apiUrl,
  clientId,
  clientSecret,
}: {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
}) => {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.value;
  }

  const tokenUrl =
    process.env.FAWATERK_TOKEN_URL ??
    new URL("/oauth/token", apiUrl).toString();
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
    redirect: "manual",
  });
  const result = await readResponseBody(response);

  if (!response.ok) {
    console.error("Fawaterak OAuth request failed:", response.status, result);
    throw new Error(`Fawaterak OAuth request failed with ${response.status}.`);
  }

  const token = result as OAuthTokenResponse;

  if (!token.access_token) {
    console.error("Fawaterak OAuth response has no access_token:", result);
    throw new Error("Fawaterak OAuth response has no access token.");
  }

  const expiresInSeconds = Number(token.expires_in) || 3600;
  const safeLifetimeSeconds = Math.max(expiresInSeconds - 60, 1);

  cachedAccessToken = {
    value: token.access_token,
    expiresAt: Date.now() + safeLifetimeSeconds * 1000,
  };

  return token.access_token;
};

export async function POST(request: Request) {
  try {
    const apiUrl = process.env.FAWATERK_URL;
    const clientId = process.env.FAWATERK_CLIENT_ID;
    const clientSecret = process.env.FAWATERK_CLIENT_SECRET;

    const missingConfig = [
      !apiUrl ? "FAWATERK_URL" : null,
      !clientId ? "FAWATERK_CLIENT_ID" : null,
      !clientSecret ? "FAWATERK_CLIENT_SECRET" : null,
    ].filter((name): name is string => Boolean(name));

    if (!apiUrl || !clientId || !clientSecret) {
      console.error(
        `Missing Fawaterak configuration: ${missingConfig.join(", ")}.`,
      );
      return NextResponse.json(
        {
          error: "Payment service is not configured.",
          missing: missingConfig,
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as CheckoutRequest;
    const planId = Number(body.planId);
    const name = (body.user?.name ?? body.name ?? "").trim();
    const phone = (body.user?.phone ?? body.phone ?? "").trim();

    if (!name || !phone || !Number.isInteger(planId)) {
      return NextResponse.json(
        { error: "name, phone, and a valid planId are required." },
        { status: 400 },
      );
    }

    const configuredAppUrl = (
      process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL
    )?.replace(/\/$/, "");
    const appUrl = configuredAppUrl || new URL(request.url).origin;
    const invoiceData = prepareInvoiceData({ name, phone }, planId, appUrl);

    if (!invoiceData) {
      return NextResponse.json({ error: "Invalid planId." }, { status: 400 });
    }

    const accessToken = await getAccessToken({
      apiUrl,
      clientId,
      clientSecret,
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(invoiceData),
      cache: "no-store",
      // Do not turn an authentication redirect into a misleading 200 HTML response.
      redirect: "manual",
    });
    const result = await readResponseBody(response);

    if (response.status >= 300 && response.status < 400) {
      const redirectLocation = response.headers.get("location");

      console.error(
        "Fawaterak redirected the API request:",
        response.status,
        redirectLocation,
      );

      return NextResponse.json(
        {
          error:
            "Fawaterak rejected the OAuth access token. Check that the OAuth client belongs to the same environment as FAWATERK_URL.",
        },
        { status: 502 },
      );
    }

    if (!response.ok) {
      if (response.status === 401) {
        cachedAccessToken = null;
      }

      console.error("Fawaterak request failed:", response.status, result);
      return NextResponse.json(
        { error: "Failed to create invoice.", details: result },
        { status: response.status },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("application/json")) {
      console.error(
        "Fawaterak returned a non-JSON response:",
        response.status,
        contentType,
      );

      return NextResponse.json(
        {
          error:
            "Fawaterak returned an unexpected response. Verify the API URL and secret token.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Fawaterak API error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice." },
      { status: 500 },
    );
  }
}
