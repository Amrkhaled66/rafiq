export type PlanTask = {
  id: string;
  title: string;
  note?: string;
  subject: string;
};

export type PlanDay = {
  date: string; // YYYY-MM-DD
  tasks: PlanTask[];
};

