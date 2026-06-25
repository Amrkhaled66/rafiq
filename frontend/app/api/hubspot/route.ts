import { NextResponse } from "next/server";
import {
    buildHubSpotSubmissionBody,
    type LeadFormData,
} from "../../../src/lib/hubspot";

const getHubSpotConfig = () => {
    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formGuid = process.env.HUBSPOT_FORM_GUID;
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

    if (!portalId || !formGuid || !accessToken) {
        throw new Error("HubSpot env variables are missing.");
    }

    return { portalId, formGuid, accessToken };
};

const buildSubmitUrl = ({ portalId, formGuid }: { portalId: string; formGuid: string }) => {
    return `https://api.hsforms.com/submissions/v3/integration/secure/submit/${portalId}/${formGuid}`;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Partial<LeadFormData>;

        if (!body.name?.trim() || !body.phone?.trim()) {
            return NextResponse.json(
                { error: "بيانات النموذج غير مكتملة." },
                { status: 400 },
            );
        }

        const config = getHubSpotConfig();
        const response = await fetch(buildSubmitUrl(config), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${config.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                buildHubSpotSubmissionBody({
                    name: body.name.trim(),
                    phone: body.phone.trim(),
                }),
            ),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "");

            return NextResponse.json(
                {
                    error: "تعذر إرسال البيانات إلى HubSpot.",
                    details: errorText || undefined,
                },
                { status: response.status },
            );
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json(
            { error: "حصل خطأ أثناء إرسال البيانات." },
            { status: 500 },
        );
    }
}