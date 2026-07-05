import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TELEGRAM_API = "https://api.telegram.org/bot";

const getValue = (formData: FormData, key: string) => {
  return String(formData.get(key) ?? "").trim();
};

const escapeHtml = (value: string) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

const normalizeWhatsappNumber = (value: string) => {
  let digits = value.replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = `20${digits.slice(1)}`;
  }

  if (digits.startsWith("1") && digits.length === 10) {
    digits = `20${digits}`;
  }

  return digits;
};

const createOrderId = () => {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().slice(0, 6).toUpperCase();

  return `RAFIQ-${date}-${random}`;
};

const getCairoDateTime = () => {
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
};

export async function POST(request: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageThreadId = process.env.TELEGRAM_MESSAGE_THREAD_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          message:
            "خدمة تأكيد الاشتراك غير متاحة الآن. حاول مرة أخرى بعد قليل.",
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();

    const phoneRaw = getValue(formData, "phone");
    const parentPhoneRaw = getValue(formData, "parentPhone");

    const phone = escapeHtml(phoneRaw);
    const parentPhone = escapeHtml(parentPhoneRaw);
    const grade = escapeHtml(getValue(formData, "grade"));
    const durationLabel = escapeHtml(getValue(formData, "durationLabel"));
    const price = escapeHtml(getValue(formData, "price"));
    const paymentMethod = escapeHtml(getValue(formData, "paymentMethod"));
    const proofImage = formData.get("proofImage");

    const orderId = createOrderId();
    const createdAt = getCairoDateTime();

    const studentWhatsapp = normalizeWhatsappNumber(phoneRaw);
    const parentWhatsapp = normalizeWhatsappNumber(parentPhoneRaw);

    const caption = `
🟡 <b>طلب اشتراك جديد - محتاج مراجعة</b>

🕒 <b>وقت الإرسال:</b> ${escapeHtml(createdAt)}

<b>بيانات الطالب</b>
📱 <b>رقم الطالب:</b> <code>${phone || "-"}</code>
👨‍👩‍👦 <b>رقم ولي الأمر:</b> <code>${parentPhone || "-"}</code>
🎓 <b>الصف:</b> ${grade || "-"}

<b>تفاصيل الاشتراك</b>
⏳ <b>المدة:</b> ${durationLabel || "-"}
💰 <b>السعر:</b> ${price || "-"} جنيه
💳 <b>طريقة الدفع:</b> ${paymentMethod || "-"}
`.trim();

    const inlineKeyboard = [
      [
        ...(studentWhatsapp
          ? [
              {
                text: "واتساب الطالب",
                url: `https://wa.me/${studentWhatsapp}`,
              },
            ]
          : [])
      ].filter(Boolean),
    ].filter((row) => row.length > 0);

    const replyMarkup =
      inlineKeyboard.length > 0
        ? {
            inline_keyboard: inlineKeyboard,
          }
        : undefined;

    const hasImage = proofImage instanceof File && proofImage.size > 0;

    let telegramResponse: Response;

    if (hasImage) {
      const telegramFormData = new FormData();

      telegramFormData.append("chat_id", chatId);
      telegramFormData.append("photo", proofImage);
      telegramFormData.append("caption", caption);
      telegramFormData.append("parse_mode", "HTML");

      if (messageThreadId) {
        telegramFormData.append("message_thread_id", messageThreadId);
      }

      if (replyMarkup) {
        telegramFormData.append("reply_markup", JSON.stringify(replyMarkup));
      }

      telegramResponse = await fetch(`${TELEGRAM_API}${botToken}/sendPhoto`, {
        method: "POST",
        body: telegramFormData,
      });
    } else {
      telegramResponse = await fetch(`${TELEGRAM_API}${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: caption,
          parse_mode: "HTML",
          ...(messageThreadId
            ? { message_thread_id: Number(messageThreadId) }
            : {}),
          ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
        }),
      });
    }

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      throw new Error(`Telegram request failed: ${errorText}`);
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (error) {
    console.error("Checkout submission failed:", error);

    return NextResponse.json(
      {
        message:
          "لم نتمكن من إرسال بيانات الاشتراك الآن. حاول مرة أخرى بعد قليل.",
      },
      { status: 500 },
    );
  }
}