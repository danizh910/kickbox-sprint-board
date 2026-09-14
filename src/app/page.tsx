import Link from "next/link";
import { Priority } from "@/components/priority";
import { getEpics, getStories, PRODUCT_VISION } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [epics, stories] = await Promise.all([getEpics(), getStories()]);
  const totalPoints = stories.reduce((s, x) => s + x.points, 0);

  return (
    <>
      <section className="grid gap-6 md:grid-cols-[10rem_1fr]">
        <p className="font-serif text-sm font-semibold tracking-[0.2em] text-navy uppercase md:pt-3">Produktvision</p>
        <blockquote className="border-l-4 border-navy pl-5 font-serif text-xl leading-relaxed text-navy sm:text-2xl sm:leading-relaxed">
          {PRODUCT_VISION}
        </blockquote>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-3">
          <h1 className="font-serif text-3xl font-semibold text-navy">Epics</h1>
          <p className="text-muted-foreground">
            {epics.length} Epics · {stories.length} User Stories · {totalPoints} Story Points ·{" "}
            <Link href="/backlog" className="font-semibold text-navy underline underline-offset-4">
              ganzer Backlog
            </Link>
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {epics.map((epic) => {
            const own = stories.filter((s) => s.epic_id === epic.id);
            const points = own.reduce((s, x) => s + x.points, 0);
            return (
              <details
                key={epic.id}
                className="group rounded-sm border border-black/10 shadow-[0_2px_0_rgba(0,0,0,0.06)] open:col-span-full"
                style={{ backgroundColor: epic.color }}
              >
                <summary className="flex cursor-pointer list-none flex-col gap-3 p-5 [&::-webkit-details-marker]:hidden">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-serif text-4xl font-bold text-navy/85">{epic.id}</span>
                    <span className="rounded-sm bg-white/60 px-2 py-0.5 text-sm font-semibold text-navy">
                      Teilprojekt {epic.tp}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl leading-snug font-semibold text-navy">{epic.title}</h2>
                  <div className="flex items-center justify-between text-[15px] text-ink/80">
                    <span>
                      {own.length} Stories · <strong>{points} SP</strong>
                    </span>
                    <span className="text-sm font-semibold text-navy group-open:hidden">Stories zeigen ▾</span>
                    <span className="hidden text-sm font-semibold text-navy group-open:inline">schliessen ▴</span>
                  </div>
                </summary>
                <ul className="mx-2 mb-2 divide-y divide-rule rounded-sm bg-[#fbf8f1]">
                  {own.map((s) => (
                    <li key={s.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-6">
                      <p className="flex-1 leading-relaxed">{s.text}</p>
                      <div className="flex shrink-0 items-center gap-3">
                        {s.sprint1 && (
                          <Link href="/sprint-1" className="text-xs font-bold text-navy underline underline-offset-2">
                            Sprint 1
                          </Link>
                        )}
                        <Priority value={s.priority} />
                        <span className="w-12 text-right font-serif text-lg font-semibold text-navy">{s.points} SP</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </section>
    </>
  );
}
