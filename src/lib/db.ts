import { neon } from "@neondatabase/serverless";
import type { Epic, Story, Task } from "./model";

export * from "./model";

export const sql = neon(process.env.DATABASE_URL!);

export const getEpics = async () => (await sql`SELECT id, title, tp, color FROM epics ORDER BY sort`) as Epic[];

export const getStories = async () =>
  (await sql`SELECT id, epic_id, text, priority, points, sprint1 FROM stories ORDER BY sort`) as Story[];

export const getTasks = async () => (await sql`SELECT id, story_id, title, status FROM tasks ORDER BY sort`) as Task[];

export const PRODUCT_VISION =
  "Für Logistikunternehmen, die auf der letzten Meile nachhaltige und nachvollziehbare Mehrwegverpackungen brauchen, ist Kickbox ein IoT- und Blockchain-gestütztes Mehrwegboxensystem, das Position und Zustand jeder Box in Echtzeit sichtbar macht und dabei mindestens 90% recycelbare, mit erneuerbarer Energie hergestellte Materialien nutzt. Im Gegensatz zu Einweg-Kartonverpackungen liefert Kickbox am Ende belastbare Wirtschaftlichkeits- und Umweltdaten für den Systementscheid nach Projektende.";

export const SPRINT_1 = {
  period: "04.01.2027 – 15.01.2027",
  goal: "Ein gemeinsames Verständnis von Anforderungen und Systemarchitektur (IoT + Blockchain) ist geschaffen, sodass Digitale-Services- und Hardware-Team ab Sprint 2 parallel entwickeln können.",
};
