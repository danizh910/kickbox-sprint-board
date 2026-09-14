import { getEpics, getStories, getTasks, SPRINT_1 } from "@/lib/db";
import { Board } from "./board";
import { ResetButton } from "./reset-button";

export const dynamic = "force-dynamic";

export default async function SprintPage() {
  const [epics, stories, tasks] = await Promise.all([getEpics(), getStories(), getTasks()]);
  const sprintStories = stories.filter((s) => s.sprint1);
  const colors = Object.fromEntries(epics.map((e) => [e.id, e.color]));
  const points = sprintStories.reduce((s, x) => s + x.points, 0);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-navy/70 uppercase">Sprint 1 · {SPRINT_1.period}</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-navy">Sprint-Board</h1>
        </div>
        <ResetButton />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="self-start rounded-sm border-l-4 border-navy bg-[#fbf8f1] px-5 py-4">
          <h2 className="text-sm font-bold tracking-wide text-navy uppercase">Sprint-Ziel</h2>
          <p className="mt-1 font-serif text-lg leading-relaxed text-navy">{SPRINT_1.goal}</p>
        </section>
        <section className="text-[15px]">
          <h2 className="text-sm font-bold tracking-wide text-navy uppercase">
            Stories im Sprint · {points} SP
          </h2>
          <ol className="mt-2 space-y-1.5">
            {sprintStories.map((s, i) => (
              <li key={s.id} className="flex gap-2 leading-snug">
                <span className="shrink-0 rounded-sm px-1.5 font-bold text-navy" style={{ backgroundColor: colors[s.epic_id] }}>
                  S{i + 1}
                </span>
                <span className="text-ink/85">
                  {s.text.split(",")[0]} <span className="whitespace-nowrap text-muted-foreground">({s.points} SP)</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <Board
        tasks={tasks}
        stories={sprintStories.map((s, i) => ({ id: s.id, label: `S${i + 1}`, text: s.text, color: colors[s.epic_id] }))}
      />
    </>
  );
}
