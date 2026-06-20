import type { ActivityCategory, ActivityEntry } from './types';
import { DAILY_BASELINE, FACTORS, KG_CO2_PER_TREE_DAY } from './types';

export interface CategoryBreakdown {
  category: ActivityCategory;
  label: string;
  co2: number;
  color: string;
  delta: number; // vs previous period
}

const CATEGORY_META: Record<ActivityCategory, { label: string; color: string }> = {
  transport: { label: 'Transportation', color: '#3b82f6' },
  electricity: { label: 'Electricity', color: '#f59e0b' },
  food: { label: 'Food', color: '#ef4444' },
  water: { label: 'Water', color: '#06b6d4' },
};

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getActivitiesForDate(activities: ActivityEntry[], date: string): ActivityEntry[] {
  return activities.filter((a) => a.date === date);
}

export function getActivitiesForRange(activities: ActivityEntry[], days: number): ActivityEntry[] {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const cut = cutoff.toISOString().slice(0, 10);
  return activities.filter((a) => a.date >= cut);
}

export function sumCo2(entries: ActivityEntry[]): number {
  return entries.reduce((s, a) => s + a.co2, 0);
}

export function calcTransportCo2(subtype: string, km: number): number {
  const f = (FACTORS.transport as Record<string, number>)[subtype] ?? 0;
  return +(km * f).toFixed(2);
}

export function calcElectricityCo2(subtype: string, kwh: number): number {
  const f = (FACTORS.electricity as Record<string, number>)[subtype] ?? 0.385;
  return +(kwh * f).toFixed(2);
}

export function calcFoodCo2(subtype: string, kcal: number): number {
  const f = (FACTORS.food as Record<string, number>)[subtype] ?? 0.0017;
  return +(kcal * f).toFixed(2);
}

export function calcWaterCo2(liters: number): number {
  return +(liters * FACTORS.water).toFixed(2);
}

export function getCategoryBreakdown(activities: ActivityEntry[]): CategoryBreakdown[] {
  const cats: ActivityCategory[] = ['transport', 'electricity', 'food', 'water'];
  return cats.map((c) => {
    const co2 = sumCo2(activities.filter((a) => a.category === c));
    return {
      category: c,
      label: CATEGORY_META[c].label,
      co2: +co2.toFixed(2),
      color: CATEGORY_META[c].color,
      delta: 0,
    };
  });
}

export function getDailyBreakdown(activities: ActivityEntry[], days: number) {
  const result: { date: string; label: string; co2: number; saved: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const dayEntries = activities.filter((a) => a.date === iso);
    const co2 = sumCo2(dayEntries);
    result.push({
      date: iso,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      co2: +co2.toFixed(2),
      saved: +Math.max(0, DAILY_BASELINE.total - co2).toFixed(2),
    });
  }
  return result;
}

export function calcEcoScore(activities: ActivityEntry[]): number {
  // score out of 100 vs baseline
  const today = getActivitiesForDate(activities, todayIso());
  const emitted = sumCo2(today);
  if (emitted === 0) return 100;
  const ratio = emitted / DAILY_BASELINE.total;
  const score = Math.max(0, Math.min(100, Math.round(100 - ratio * 55)));
  return score;
}

export function calcTreesNeeded(co2Kg: number): number {
  return +(co2Kg / KG_CO2_PER_TREE_DAY).toFixed(1);
}

export interface Trend {
  value: number;
  direction: 'up' | 'down' | 'flat';
  label: string;
}

export function calcTrend(activities: ActivityEntry[], days: number): Trend {
  const recent = getActivitiesForRange(activities, days);
  const prev = getActivitiesForRange(activities, days * 2).filter(
    (a) => !recent.includes(a)
  );
  const r = sumCo2(recent) / days;
  const p = sumCo2(prev) / days || r;
  if (p === 0) return { value: 0, direction: 'flat', label: 'no change' };
  const pct = ((r - p) / p) * 100;
  return {
    value: Math.abs(Math.round(pct)),
    direction: pct < 0 ? 'down' : pct > 0 ? 'up' : 'flat',
    label: `${Math.abs(Math.round(pct))}% vs prev`,
  };
}
