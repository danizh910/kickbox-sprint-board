export const STATUSES = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
] as const;
export type Status = (typeof STATUSES)[number]["id"];

export type Epic = { id: string; title: string; tp: string; color: string };
export type Story = {
  id: number;
  epic_id: string;
  text: string;
  priority: "Must" | "Should" | "Could";
  points: number;
  sprint1: boolean;
};
export type Task = { id: number; story_id: number; title: string; status: Status };
