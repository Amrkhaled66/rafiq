export const normalizePhone = (value: string) => {
  const arabicNumbers: Record<string, string> = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return value
    .replace(/[٠-٩]/g, (digit) => arabicNumbers[digit])
    .replace(/\s+/g, "")
    .replace(/[^\d+]/g, "");
};

export const isValidEgyptianPhone = (phone: string) => {
  return /^01[0125][0-9]{8}$/.test(normalizePhone(phone));
};