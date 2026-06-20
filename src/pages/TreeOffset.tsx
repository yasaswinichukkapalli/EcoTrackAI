import { useState } from 'react';
import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { KG_CO2_PER_TREE_YEAR } from '../lib/types';
import { todayIso, sumCo2 } from '../lib/calc';

const PRESETS = [
  { label: 'Daily car commute (15 km)', value: 2.6, icon: 'Car' },
  { label: 'Round-trip flight (500 km)', value: 128, icon: 'Plane' },
  { label: 'Beef burger meal', value: 6.6, icon: 'Beef' },
  { label: '1 month of electricity (300 kWh)', value: 116, icon: 'Zap' },
  { label: 'Year of showers (~180 L/day)', value: 19.7, icon: 'Droplets' },
  { label: 'Your today', value: 0, icon: 'Calendar' },
];

export default function TreeOffset() {
  const { state } = useEco();
  const [amount, setAmount] = useState('100');
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('year');

  const todayCo2 = sumCo2(state.activities.filter((a) => a.date === todayIso()));
  const value = parseFloat(amount) || 0;

  // trees needed for the period
  const treesPerDay = value / (KG_CO2_PER_TREE_YEAR / 365);
  const treesDisplay = period === 'day' ? treesPerDay : period === 'month' ? treesPerDay * 30 : treesPerDay * 365;

  const equivalent = [
    { icon: 'TreePine', label: 'Mature trees (1 yr)', value: (value / KG_CO2_PER_TREE_YEAR).toFixed(1) },
    { icon: 'Car', label: 'km not driven', value: Math.round(value / 0.171).toLocaleString() },
    { icon: 'Smartphone', label: 'phones charged', value: Math.round(value / 0.005).toLocaleString() },
    { icon: 'Lightbulb', label: 'LED hrs', value: Math.round(value / 0.009).toLocaleString() },
    { icon: 'Smartphone', label: 'google searches', value: Math.round(value / 0.0002).toLocaleString() },
    { icon: 'Plane', label: 'flight minutes', value: Math.round(value / 0.255 * 60 / 1).toLocaleString() },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Tree Offset Calculator"
        subtitle="See how many trees it takes to offset your emissions"
        icon="TreePine"
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Calculator input */}
        <GlassCard className="lg:col-span-2 p-6" strong>
          <p className="font-semibold">Enter CO₂ amount</p>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/50 px-4 dark:border-white/10 dark:bg-white/5">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent py-3 text-2xl font-extrabold outline-none"
              min={0}
            />
            <span className="text-sm font-semibold text-slate-400">kg CO₂</span>
          </div>

          <div className="mt-4 flex gap-2">
            {(['day', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 rounded-2xl py-2 text-xs font-bold capitalize transition ${
                  period === p
                    ? 'bg-gradient-to-r from-eco-500 to-ocean-500 text-white shadow-glow'
                    : 'bg-slate-100/50 text-slate-500 dark:bg-white/5 dark:text-slate-300'
                }`}
              >
                per {p}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Quick presets</p>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setAmount(String(p.value || Math.round(todayCo2 * 10) / 10))}
                  className="flex w-full items-center gap-3 rounded-2xl bg-slate-100/40 p-3 text-left transition hover:bg-eco-500/10 dark:bg-white/5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-eco-400 to-ocean-500 text-white">
                    <Icon name={p.icon} className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-xs font-medium">{p.label}</span>
                  <span className="text-xs font-bold tabular-nums text-slate-400">{p.value || todayCo2.toFixed(1)} kg</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Result */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard className="p-8 text-center" strong>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Trees needed to offset</p>
            <div className="my-4 flex items-center justify-center gap-3">
              <span className="text-6xl">🌳</span>
              <div className="text-left">
                <AnimatedNumber value={Math.max(0.1, treesDisplay)} decimals={treesDisplay < 10 ? 1 : 0} className="text-5xl font-extrabold gradient-text" />
                <p className="text-sm text-slate-400">trees for {period === 'day' ? 'a day' : period === 'month' ? 'a month' : 'a year'}</p>
              </div>
            </div>
            <Pill tone="success">
              <Icon name="Info" className="h-3 w-3" />
              1 tree ≈ {KG_CO2_PER_TREE_YEAR} kg CO₂/yr
            </Pill>
            {/* Visual tree row */}
            <div className="mt-5 flex flex-wrap justify-center gap-1">
              {Array.from({ length: Math.min(20, Math.ceil(treesDisplay)) }).map((_, i) => (
                <span
                  key={i}
                  className="text-2xl animate-grow-up"
                  style={{ animationDelay: `${i * 0.05}s`, opacity: i < Math.floor(treesDisplay) ? 1 : treesDisplay % 1 }}
                >
                  🌳
                </span>
              ))}
              {treesDisplay > 20 && <span className="self-center text-sm font-bold text-slate-400">+{Math.floor(treesDisplay - 20)}</span>}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="font-semibold">Equivalent impact</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {equivalent.map((e) => (
                <div key={e.label} className="rounded-2xl bg-slate-100/40 p-4 dark:bg-white/5">
                  <Icon name={e.icon} className="mb-1 h-5 w-5 text-slate-400" />
                  <p className="text-lg font-extrabold tabular-nums">{e.value}</p>
                  <p className="text-[10px] text-slate-400">{e.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Your offset */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-eco-600 text-white">
            <Icon name="User" className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Your real-world offset</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Based on your activity data</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-eco-500/10 to-eco-500/5 p-4 text-center">
            <p className="text-2xl font-extrabold text-eco-600 dark:text-eco-400">
              <AnimatedNumber value={state.profile.treesPlanted} />
            </p>
            <p className="text-xs text-slate-500">Trees you've planted</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-ocean-500/10 to-ocean-500/5 p-4 text-center">
            <p className="text-2xl font-extrabold text-ocean-600 dark:text-ocean-400">
              <AnimatedNumber value={state.totalCarbonSaved} decimals={1} suffix=" kg" />
            </p>
            <p className="text-xs text-slate-500">CO₂ saved all-time</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-4 text-center">
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              <AnimatedNumber value={state.profile.treesPlanted * KG_CO2_PER_TREE_YEAR} suffix=" kg" />
            </p>
            <p className="text-xs text-slate-500">Offset by your trees / yr</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
