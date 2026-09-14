"use server";

import { revalidatePath } from "next/cache";
import { sql, STATUSES, type Status } from "@/lib/db";

export async function moveTask(id: number, status: Status) {
  if (!Number.isInteger(id) || !STATUSES.some((s) => s.id === status)) throw new Error("invalid input");
  await sql`UPDATE tasks SET status = ${status} WHERE id = ${id}`;
  revalidatePath("/sprint-1");
}

export async function resetBoard() {
  await sql`UPDATE tasks SET status = initial_status`;
  revalidatePath("/sprint-1");
}
