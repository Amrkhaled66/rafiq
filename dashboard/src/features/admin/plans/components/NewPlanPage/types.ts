export type PlanTask = {
  id: string;
  title: string;
  subject: string;
};

export type PlanDay = {
  date: string; // YYYY-MM-DD
  tasks: PlanTask[];
};

