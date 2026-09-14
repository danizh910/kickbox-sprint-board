import type { Story } from "@/lib/model";

const STYLE: Record<Story["priority"], string> = {
  Must: "bg-navy text-primary-foreground border-navy",
  Should: "bg-transparent text-navy border-navy",
  Could: "bg-transparent text-muted-foreground border-dashed border-muted-foreground",
};

export function Priority({ value }: { value: Story["priority"] }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-px text-xs font-bold tracking-wide uppercase ${STYLE[value]}`}>
      {value}
    </span>
  );
}
