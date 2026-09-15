export type PlanTask = {
  id: string;
  persistedId?: number;
  title: string;
  note?: string;
  subject: string;
};

export type PlanDay = {
  date: string; // YYYY-MM-DD
  tasks: PlanTask[];
};

