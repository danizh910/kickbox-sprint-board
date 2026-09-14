"use client";

import { useState } from "react";
import { Priority } from "@/components/priority";
import type { Epic, Story } from "@/lib/model";

const PRIORITIES = ["Must", "Should", "Could"] as const;
type Sort = "none" | "desc" | "asc";

const selectCls =
  "rounded-sm border border-rule bg-[#fbf8f1] px-3 py-2 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-navy";

export function BacklogTable({ epics, stories }: { epics: Epic[]; stories: Story[] }) {
  const [epic, setEpic] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState<Sort>("none");

  const byId = Object.fromEntries(epics.map((e) => [e.id, e]));
  const rows = stories
    .filter((s) => (epic === "all" || s.epic_id === epic) && (priority === "all" || s.priority === priority))
    .sort((a, b) => (sort === "none" ? 0 : sort === "desc" ? b.points - a.points : a.points - b.points));
  const points = rows.reduce((s, x) => s + x.points, 0);
  const nextSort: Record<Sort, Sort> = { none: "desc", desc: "asc", asc: "none" };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm font-semibold text-navy">
          Epic
          <select className={selectCls} value={epic} onChange={(e) => setEpic(e.target.value)}>
            <option value="all">Alle Epics</option>
            {epics.map((e) => (
              <option key={e.id} value={e.id}>
                {e.id} {e.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-navy">
          Priorität
          <select className={selectCls} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">Alle Prioritäten</option>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <p className="ml-auto pb-2 text-muted-foreground" aria-live="polite">
          {rows.length} Stories · <strong className="text-navy">{points} SP</strong>
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-sm border border-rule bg-[#fbf8f1]">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-navy text-sm tracking-wide text-navy uppercase">
              <th className="px-4 py-3 font-bold">Epic</th>
              <th className="px-4 py-3 font-bold">User Story</th>
              <th className="px-4 py-3 font-bold">Priorität</th>
              <th className="px-4 py-3 text-right font-bold" aria-sort={sort === "none" ? "none" : sort === "desc" ? "descending" : "ascending"}>
                <button onClick={() => setSort(nextSort[sort])} className="whitespace-nowrap uppercase hover:underline" title="Nach Story Points sortieren">
                  SP {sort === "desc" ? "↓" : sort === "asc" ? "↑" : "↕"}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const e = byId[s.epic_id];
              return (
                <tr key={s.id} className="border-b border-rule last:border-0">
                  <td className="border-l-8 px-4 py-3 align-top" style={{ borderLeftColor: e.color }}>
                    <span
                      className="inline-block rounded-sm px-2 py-0.5 text-sm font-bold whitespace-nowrap text-navy"
                      style={{ backgroundColor: e.color }}
                      title={`${e.title} (${e.tp})`}
                    >
                      {e.id} · {e.tp}
                    </span>
                    <div className="mt-1 max-w-[11rem] text-sm text-muted-foreground">{e.title}</div>
                  </td>
                  <td className="px-4 py-3 align-top leading-relaxed">{s.text}</td>
                  <td className="px-4 py-3 align-top">
                    <Priority value={s.priority} />
                  </td>
                  <td className="px-4 py-3 text-right align-top font-serif text-lg font-semibold text-navy">{s.points}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Keine Stories für diese Filterkombination.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
