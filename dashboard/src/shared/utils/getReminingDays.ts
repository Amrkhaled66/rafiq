const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const getRemainingDays = (row: {
  startsAt: string | Date;
  endsAt: string | Date;
}) => {
  const now = new Date();
  const startDate = new Date(row.startsAt);
  const endDate = new Date(row.endsAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0;
  }

  // لو الاشتراك منتهي
  if (now > endDate) {
    return 0;
  }

  // لو الاشتراك لسه مبدأش، اعرض مدة الاشتراك كاملة
  if (now < startDate) {
    return Math.max(
      0,
      Math.ceil((endDate.getTime() - startDate.getTime()) / DAY_IN_MS)
    );
  }

  // لو الاشتراك شغال، اعرض المتبقي من الآن حتى تاريخ الانتهاء
  return Math.max(
    0,
    Math.ceil((endDate.getTime() - now.getTime()) / DAY_IN_MS)
  );
};