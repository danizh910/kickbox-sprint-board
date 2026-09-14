// Creates schema and loads the Kickbox seed content. Idempotent: drops and recreates.
// Run: node --env-file=.env.local scripts/seed.mjs
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const epics = [
  ["E1", "Anforderungen & Konzept", "TP2", "#FFE066"],
  ["E2", "Digitale Services", "TP3", "#8FD694"],
  ["E3", "Mehrwegbox & Regal", "TP4", "#7FC7E8"],
  ["E4", "Integration & Verifikation", "TP5", "#D7A6E0"],
  ["E5", "Pilotierung letzte Meile", "TP6", "#F4A997"],
  ["E6", "Analyse & Bewertung", "TP7", "#B9B29A"],
  ["E7", "Verwertung & Abschluss", "TP8", "#C9CFE0"],
];

// [epic, text, priority, points, tasks (only for Sprint-1 stories)]
const stories = [
  ["E1", "Als Product Owner möchte ich mit allen Konsortialpartnern die funktionalen Anforderungen an Sensorik und Blockchain erheben, damit das Entwicklungsteam eine gemeinsame, verbindliche Grundlage hat.", "Must", 5,
    [["Workshop mit Partnern vorbereiten", "done"], ["Workshop durchführen & protokollieren", "review"], ["Anforderungen konsolidieren", "in_progress"]]],
  ["E1", "Als Entwicklerin möchte ich ein Architektur-Grobkonzept für IoT-Sensorik und Blockchain-Anbindung erstellen, damit Digitale-Services- und Hardware-Team unabhängig voneinander entwickeln können.", "Must", 8,
    [["IoT-Sensorik-Optionen evaluieren", "review"], ["Blockchain-Anbindung skizzieren", "in_progress"], ["Architekturdokument erstellen", "todo"]]],
  ["E1", "Als Compliance-Verantwortlicher möchte ich die datenschutzrechtlichen Eckpunkte für die Verarbeitung von Standortdaten klären, damit die Sensorik DSG-konform entworfen wird.", "Must", 5,
    [["Rechtliche Anforderungen prüfen", "in_progress"], ["Datenschutzkonzept-Entwurf", "todo"]]],
  ["E1", "Als Product Owner möchte ich ein Pflichtenheft-Grundgerüst erstellen, damit spätere Anforderungen einheitlich dokumentiert werden.", "Should", 3,
    [["Gliederung Pflichtenheft erstellen", "done"], ["Vorlage mit Team abstimmen", "todo"]]],
  ["E2", "Als Logistikpartner möchte ich, dass jede Box automatisch Temperatur und Standort meldet, damit ich den Zustand der Ware jederzeit nachvollziehen kann.", "Must", 8],
  ["E2", "Als Auftraggeberin möchte ich, dass Boxbewegungen fälschungssicher in einer Blockchain protokolliert werden, damit die Nachverfolgung auch gegenüber Dritten belastbar ist.", "Must", 13],
  ["E2", "Als Data Scientist möchte ich eine Datenplattform mit Auswertungslogik, damit ich Muster im Boxeneinsatz erkennen kann.", "Should", 8],
  ["E2", "Als Entwicklerin möchte ich die digitalen Services automatisiert testen, damit Fehler vor der Integration erkannt werden.", "Must", 5],
  ["E3", "Als Labortechnikerin möchte ich ein CAD-Design der Box, damit die Sensorik passgenau verbaut werden kann.", "Must", 8],
  ["E3", "Als Logistikpartner möchte ich ein Regal mit automatischer Verriegelung, damit Boxen sicher gelagert werden ohne manuellen Aufwand.", "Should", 8],
  ["E3", "Als Umwelt-Verantwortliche möchte ich einen Nachweis, dass mind. 90% der Materialien recycelbar sind, damit das Formalziel des Projekts erfüllt wird.", "Must", 5],
  ["E3", "Als Entwicklerin möchte ich einen 3D-gedruckten Prototypen, damit wir die Sensorik früh real testen können.", "Should", 5],
  ["E4", "Als Entwicklerin möchte ich Software und Hardware zu einem Gesamtsystem integrieren, damit Box und Plattform als ein System funktionieren.", "Must", 8],
  ["E4", "Als Forschungsleiter möchte ich Laborversuche unter kontrollierten Bedingungen durchführen, damit ich die Systemfunktion vor dem Feldeinsatz verifizieren kann.", "Must", 5],
  ["E4", "Als Auftraggeberin möchte ich eine formale Abnahme des Prototyps, damit ich sicher weiss, dass er pilotierungsreif ist.", "Must", 3],
  ["E5", "Als Logistikpartner möchte ich ein Pilotdesign mit klaren Testrouten, damit der Feldtest unter realistischen Bedingungen läuft.", "Must", 5],
  ["E5", "Als Forschungsteam möchte ich den Praxistest auf der letzten Meile durchführen, damit wir reale Nutzungsdaten erhalten.", "Must", 8],
  ["E5", "Als Data Scientist möchte ich während der Pilotierung kontinuierlich Daten erheben und überwachen, damit Auffälligkeiten sofort erkannt werden.", "Must", 5],
  ["E6", "Als Auftraggeberin möchte ich eine Wirtschaftlichkeitsanalyse der Pilotdaten, damit ich über die Weiterführung entscheiden kann.", "Must", 8],
  ["E6", "Als Umwelt-Verantwortliche möchte ich eine Ökobilanz nach ISO 14040/44, damit die Umweltwirkung methodisch anerkannt nachgewiesen ist.", "Must", 8],
  ["E6", "Als Fördergeberin möchte ich eine Technologiefolgenabschätzung, damit gesellschaftliche Auswirkungen sichtbar werden.", "Should", 5],
  ["E7", "Als Projektleitung möchte ich prüfen, welche Projektergebnisse patentfähig sind, damit geistiges Eigentum gesichert wird.", "Should", 3],
  ["E7", "Als Forschungsteam möchte ich die Ergebnisse publizieren, damit die Erkenntnisse der Fachwelt zugänglich sind.", "Could", 3],
  ["E7", "Als Auftraggeberin möchte ich einen Abschlussbericht mit Schlussabrechnung, damit das Projekt formal abgeschlossen werden kann.", "Must", 5],
  ["E7", "Als Scrum-Team möchte ich eine gemeinsame Lessons-Learned-Sitzung, damit Erkenntnisse für Folgeprojekte gesichert werden.", "Should", 2],
];

await sql`DROP TABLE IF EXISTS tasks, stories, epics`;
await sql`CREATE TABLE epics (
  id text PRIMARY KEY, title text NOT NULL, tp text NOT NULL, color text NOT NULL, sort int NOT NULL)`;
await sql`CREATE TABLE stories (
  id serial PRIMARY KEY, epic_id text NOT NULL REFERENCES epics(id), text text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('Must','Should','Could')),
  points int NOT NULL, sprint1 boolean NOT NULL DEFAULT false, sort int NOT NULL)`;
await sql`CREATE TABLE tasks (
  id serial PRIMARY KEY, story_id int NOT NULL REFERENCES stories(id), title text NOT NULL,
  status text NOT NULL CHECK (status IN ('todo','in_progress','review','done')),
  initial_status text NOT NULL CHECK (initial_status IN ('todo','in_progress','review','done')),
  sort int NOT NULL)`;

for (const [i, [id, title, tp, color]] of epics.entries())
  await sql`INSERT INTO epics VALUES (${id}, ${title}, ${tp}, ${color}, ${i})`;

let taskSort = 0;
for (const [i, [epic, text, priority, points, tasks]] of stories.entries()) {
  const [{ id }] = await sql`INSERT INTO stories (epic_id, text, priority, points, sprint1, sort)
    VALUES (${epic}, ${text}, ${priority}, ${points}, ${!!tasks}, ${i}) RETURNING id`;
  for (const [title, status] of tasks ?? [])
    await sql`INSERT INTO tasks (story_id, title, status, initial_status, sort)
      VALUES (${id}, ${title}, ${status}, ${status}, ${taskSort++})`;
}

const [c] = await sql`SELECT (SELECT count(*) FROM epics) e, (SELECT count(*) FROM stories) s, (SELECT count(*) FROM tasks) t`;
console.log(c);
if (+c.e !== 7 || +c.s !== 25 || +c.t !== 10) throw new Error("seed count mismatch");
