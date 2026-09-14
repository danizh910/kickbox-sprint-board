"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { moveTask } from "@/app/actions";
import { STATUSES, type Status, type Task } from "@/lib/model";

type StoryRef = { id: number; label: string; text: string; color: string };

const TILT = [-2.2, 1.4, -0.8, 2, -1.6, 0.9, 2.4, -1.2, 1.1, -2.6];
const COLUMN_TONE: Record<Status, string> = {
  todo: "bg-[#efe7d6]",
  in_progress: "bg-[#ece3cf]",
  review: "bg-[#e9dfc9]",
  done: "bg-[#e5dbc3]",
};

export function Board({ tasks: serverTasks, stories }: { tasks: Task[]; stories: StoryRef[] }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(serverTasks);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const storyById = Object.fromEntries(stories.map((s) => [s.id, s]));

  useEffect(() => setTasks(serverTasks), [serverTasks]);

  // Pick up moves made by other viewers (e.g. the teacher's screen during the demo).
  useEffect(() => {
    const t = setInterval(() => document.visibilityState === "visible" && router.refresh(), 10_000);
    return () => clearInterval(t);
  }, [router]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  async function onDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    const task = tasks.find((t) => t.id === active.id);
    const status = over?.id as Status | undefined;
    if (!task || !status || task.status === status) return;

    const previous = tasks;
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status } : t)));
    setError(null);
    try {
      await moveTask(task.id, status);
    } catch {
      setTasks(previous);
      setError("Speichern fehlgeschlagen – bitte nochmals versuchen.");
    }
  }

  const active = tasks.find((t) => t.id === activeId);

  return (
    <DndContext
      id="sprint-board"
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id as number)}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
      accessibility={{
        announcements: {
          onDragStart: () => "Aufgabe aufgenommen.",
          onDragOver: ({ over }) => (over ? `Über Spalte ${label(over.id)}.` : "Ausserhalb der Spalten."),
          onDragEnd: ({ over }) => (over ? `Aufgabe nach ${label(over.id)} verschoben.` : "Nicht verschoben."),
          onDragCancel: () => "Verschieben abgebrochen.",
        },
        screenReaderInstructions: {
          draggable: "Leertaste zum Aufnehmen, Pfeiltasten zum Bewegen, Leertaste zum Ablegen, Escape zum Abbrechen.",
        },
      }}
    >
      {error && (
        <p role="alert" className="mt-6 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-2 text-destructive">
          {error}
        </p>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATUSES.map((col) => {
          const items = tasks.filter((t) => t.status === col.id);
          return (
            <Column key={col.id} id={col.id} label={col.label} count={items.length}>
              {items.map((t) => (
                <Note key={t.id} task={t} story={storyById[t.story_id]} hidden={t.id === activeId} />
              ))}
            </Column>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Karten per Drag &amp; Drop verschieben (Touch: kurz gedrückt halten). Änderungen werden sofort gespeichert und sind für alle sichtbar.
      </p>
      <DragOverlay dropAnimation={null}>
        {active && <NoteBody task={active} story={storyById[active.story_id]} lifted />}
      </DragOverlay>
    </DndContext>
  );
}

const label = (id: string | number) => STATUSES.find((s) => s.id === id)?.label ?? String(id);

function Column({ id, label, count, children }: { id: Status; label: string; count: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section
      ref={setNodeRef}
      aria-label={label}
      className={`flex min-h-[18rem] flex-col rounded-sm border border-rule p-3 transition-colors ${COLUMN_TONE[id]} ${
        isOver ? "outline-3 outline-offset-2 outline-navy/50 outline-dashed" : ""
      }`}
    >
      <h2 className="mb-4 flex items-baseline justify-between border-b-2 border-navy/70 pb-2 font-serif text-lg font-semibold text-navy">
        {label}
        <span className="font-sans text-sm font-bold text-navy/60">{count}</span>
      </h2>
      <div className="flex flex-1 flex-col gap-4 px-1 pb-2">{children}</div>
    </section>
  );
}

function Note({ task, story, hidden }: { task: Task; story: StoryRef; hidden: boolean }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: task.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      aria-roledescription="verschiebbare Aufgabe"
      className={`cursor-grab touch-manipulation rounded-[2px] focus-visible:outline-3 focus-visible:outline-navy ${hidden ? "opacity-30" : ""}`}
    >
      <NoteBody task={task} story={story} />
    </div>
  );
}

function NoteBody({ task, story, lifted }: { task: Task; story: StoryRef; lifted?: boolean }) {
  const tilt = lifted ? 3 : TILT[task.id % TILT.length];
  return (
    <div
      className={`sticky-note relative rounded-[2px] px-4 pt-5 pb-3 ${lifted ? "cursor-grabbing shadow-2xl" : ""}`}
      style={{ backgroundColor: story.color, transform: `rotate(${tilt}deg)` }}
    >
      {/* strip of tape */}
      <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-[-3deg] bg-white/55 shadow-sm" />
      <p className="text-[17px] leading-snug font-semibold text-ink">{task.title}</p>
      <p className="mt-3 text-xs font-bold tracking-wide text-navy/75 uppercase" title={story.text}>
        {story.label} · {story.text.split(" möchte ich ")[0]}
      </p>
    </div>
  );
}
