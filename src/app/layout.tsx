import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kickbox · Sprint-Board",
  description: "Agile Planung des Projekts Kickbox (2026-17, Modul 339): Vision, Epics, Product Backlog und Sprint-1-Board.",
};

const NAV = [
  { href: "/", label: "Übersicht" },
  { href: "/backlog", label: "Product Backlog" },
  { href: "/sprint-1", label: "Sprint 1" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className="antialiased">
        <header className="border-b-2 border-navy/80">
          <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="font-serif text-2xl font-semibold text-navy">Kickbox</span>
              <span className="text-sm text-muted-foreground">Projekt 2026-17 · Modul 339</span>
            </Link>
            <nav className="flex gap-5 text-[15px] font-semibold text-navy">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="underline-offset-6 hover:underline">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
