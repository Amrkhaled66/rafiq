const ARABIC_AND_PERSIAN_DIGITS = "٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹";

export function normalizePhoneDigits(value: string) {
  return value
    .replace(/[٠-٩۰-۹]/g, (digit) =>
      String(ARABIC_AND_PERSIAN_DIGITS.indexOf(digit) % 10),
    )
    .replace(/\D/g, "");
}

export function isEgyptianMobilePhone(value: string) {
  return /^01[0125]\d{8}$/.test(value);
}
