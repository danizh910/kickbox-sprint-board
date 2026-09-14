import { getEpics, getStories } from "@/lib/db";
import { BacklogTable } from "./backlog-table";

export const dynamic = "force-dynamic";

export default async function BacklogPage() {
  const [epics, stories] = await Promise.all([getEpics(), getStories()]);
  return (
    <>
      <h1 className="font-serif text-3xl font-semibold text-navy">Product Backlog</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Alle User Stories aus den sieben Epics, priorisiert nach MoSCoW und geschätzt in Story Points.
      </p>
      <BacklogTable epics={epics} stories={stories} />
    </>
  );
}
