import { EVENT } from "@/lib/config";

const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");

export function GET() {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//eventcard//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${fmt(EVENT.start)}-wedding@eventcard`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(EVENT.start)}`,
    `DTEND:${fmt(EVENT.end)}`,
    `SUMMARY:${EVENT.calendarTitle}`,
    `LOCATION:${EVENT.calendarLocation.replace(/,/g, "\\,")}`,
    `URL:${EVENT.mapUrl}`,
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${EVENT.calendarTitle}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return new Response(ics, {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'inline; filename="wedding.ics"' },
  });
}
