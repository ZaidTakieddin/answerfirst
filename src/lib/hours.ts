import type { BusinessHours } from "./types";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const DAY_NAMES: Record<string, string> = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

export function defaultHours(): BusinessHours {
  return {
    mon: ["08:00", "18:00"],
    tue: ["08:00", "18:00"],
    wed: ["08:00", "18:00"],
    thu: ["08:00", "18:00"],
    fri: ["08:00", "17:00"],
    sat: ["09:00", "13:00"],
    sun: null,
  };
}

function clockNow(): string {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(
    n.getMinutes()
  ).padStart(2, "0")}`;
}

export function isOpenNow(hours: BusinessHours): boolean {
  const range = hours[DAY_KEYS[new Date().getDay()]];
  if (!range) return false;
  const cur = clockNow();
  return cur >= range[0] && cur <= range[1];
}

export function nextOpenings(hours: BusinessHours, count = 3): string[] {
  const out: string[] = [];
  const today = new Date().getDay();
  const cur = clockNow();
  for (let offset = 0; offset < 7 && out.length < count; offset++) {
    const key = DAY_KEYS[(today + offset) % 7];
    const range = hours[key];
    if (!range) continue;
    if (offset === 0 && cur >= range[1]) continue;
    const label = offset === 0 ? "today" : offset === 1 ? "tomorrow" : DAY_NAMES[key];
    out.push(`${label} at ${range[0]}`);
  }
  return out.slice(0, count);
}

export function parseArgs(raw: unknown): Record<string, unknown> {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (raw && typeof raw === "object") return raw as Record<string, unknown>;
  return {};
}
