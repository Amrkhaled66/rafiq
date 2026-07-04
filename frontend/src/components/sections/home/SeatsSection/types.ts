export type BatchSeatsData = {
  total: number;
  reserved: number;
};

export type BatchStat = {
  label: string;
  value: number;
  icon: string;
  tone?: "red" | "green";
};