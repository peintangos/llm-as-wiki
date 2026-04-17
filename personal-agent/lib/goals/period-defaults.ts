import type { Horizon } from "@/lib/data/schema";

export interface DateRange {
  period_start: string;
  period_end: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function lastDayOfMonth(year: number, monthOneIndexed: number): number {
  return new Date(year, monthOneIndexed, 0).getDate();
}

/**
 * 日本の年度（4 月開始）を前提に、選択中 horizon に応じた
 * period_start / period_end のデフォルトを返す。
 */
export function periodDefaults(
  horizon: Horizon,
  today: Date = new Date(),
): DateRange {
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const fyStartYear = month >= 4 ? year : year - 1;

  switch (horizon) {
    case "3yr":
      return {
        period_start: isoDate(fyStartYear, 4, 1),
        period_end: isoDate(fyStartYear + 3, 3, 31),
      };
    case "1yr":
      return {
        period_start: isoDate(fyStartYear, 4, 1),
        period_end: isoDate(fyStartYear + 1, 3, 31),
      };
    case "half": {
      const inH1 = month >= 4 && month <= 9;
      if (inH1) {
        return {
          period_start: isoDate(fyStartYear, 4, 1),
          period_end: isoDate(fyStartYear, 9, 30),
        };
      }
      return {
        period_start: isoDate(fyStartYear, 10, 1),
        period_end: isoDate(fyStartYear + 1, 3, 31),
      };
    }
    case "month":
      return {
        period_start: isoDate(year, month, 1),
        period_end: isoDate(year, month, lastDayOfMonth(year, month)),
      };
  }
}
