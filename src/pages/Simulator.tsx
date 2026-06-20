import { useState } from 'react';
import { TrendLineChart } from '../components/charts';
import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { getDailyBreakdown } from '../lib/calc';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  days: number;
  co2PerDaySaved: number; // kg
  moneyPerDaySaved: number; // ₹
  detail: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'public-transit',
    title: 'Switch to Public Transit',
    description: 'Replace car commuting with bus/metro for 30 days',
    icon: 'Bus',
    days: 30,
    co2PerDaySaved: 3.6,
    moneyPerDaySaved: 120,
    detail: 'One car commute (~15 km) emits ~2.5 kg CO₂. A bus trip for the same distance emits ~1.3 kg and costs less in fuel + maintenance.',
  },
  {
    id: 'led-bulbs',
    title: 'Replace Bulbs with LEDs',
    description: 'Swap 5 incandescent bulbs for LEDs',
    icon: 'Lightbulb',
    days: 365,
    co2PerDaySaved: 0.45,
    moneyPerDaySaved: 8,
    detail: 'A 60W incandescent vs a 9W LED saves ~51W per hour. Over 5 bulbs × 4 hrs/day = ~1 kWh/day saved.',
  },
  {
    id: 'plant-meals',
    title: 'One Plant-Based Meal Daily',
    description: 'Swap one meat meal to plant-based',
    icon: 'Salad',
    days: 90,
    co2PerDaySaved: 1.8,
    moneyPerDaySaved: 50,
    detail: 'A beef meal emits ~3.6 kg CO₂ vs a lentil meal at ~0.4 kg. Daily swap saves ~3.2 kg, we conservative at 1.8.',
  },
  {
    id: 'shorter-shower',
    title: '5-Minute Showers',
    description: 'Cut shower time from 10 to 5 minutes',
    icon: 'Droplets',
    days: 90,
    co2PerDaySaved: 0.3,
    moneyPerDaySaved: 6,
    detail: 'Halves water heating energy. Saves ~30 liters/day + the gas/electricity to heat it.',
  },
  {
    id: 'solar-panels',
    title: 'Install Rooftop Solar',
    description: 'Generate 5 kWh/day with home solar',
    icon: 'Sun',
    days: 365,
    co2PerDaySaved: 1.9,
    moneyPerDaySaved: 40,
    detail: 'Each solar kWh displaces ~0.38 kg grid CO₂. 5 kWh/day = 1.9 kg saved + big bill reduction.',
  },
  {
    id: 'bike-commute',
    title: 'Bike to Work 3×/Week',
    description: 'Replace car trips with cycling',
    icon: 'Bike',
    days: 90,
    co2PerDaySaved: 1.5,
    moneyPerDaySaved: 90,
    detail: 'Three 10-km car trips replaced weekly = ~30 kg CO₂/month saved + cardio bonus.',
  },
];

export default function Simulator() {
  const { state } = useEco();
  const [selected, setSelected] = useState<Scenario>(SCENARIOS[0]);
  const [days, setDays] = useState(selected.days);

  const totalCo2 = selected.co2PerDaySaved * days;
  const totalMoney = selected.moneyPerDaySaved * days;
  const trees = totalCo2 / 21; // annual tree absorption equivalent
  const phonesCharged = Math.round(totalCo2 / 0.005);

  // Baseline future projection vs scenario
  const baselineData = Array.from({ length: Math.min(days, 30) }, (_, i) => ({
    label: `D${i + 1}`,
    current: +(19 - i * 0.05).toFixed(2),
    scenario: +(19 - selected.co2PerDaySaved - i * 0.05).toFixed(2),
  }));

  const userAvg = getDailyBreakdown(state.activities, 7).reduce((s, d) => s + d.co2, 0) / 7;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="What-If Simulator" subtitle="Project your future environmental impact before you commit" icon="FlaskConical" />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Scenario picker */}
        <div className="lg:col-span-1 space-y-2">
          <p className="px-1 text-xs font-bold uppercase tracking-wider text-slate-400">Choose a scenario</p>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelected(s);
                setDays(s.days);
              }}
              className={`glass flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-all ${
                selected.id === s.id ? 'ring-2 ring-eco-500 shadow-glow' : 'hover:scale-[1.01]'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{s.title}</p>
                <p className="text-xs text-slate-400 truncate">{s.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Projection */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-6" strong>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white shadow-glow">
                  <Icon name={selected.icon} className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">{selected.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selected.detail}</p>
                </div>
              </div>
              <Pill tone="info"><Icon name="Calendar" className="h-3 w-3" /> {days} days</Pill>
            </div>

            {/* Days slider */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>1 day</span>
                <span>Duration: {days} days</span>
                <span>365 days</span>
              </div>
              <input
                type="range"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-2 w-full accent-eco-500"
              />
            </div>

            {/* Results */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-gradient-to-br from-eco-500/10 to-eco-500/5 p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-eco-500/15 text-eco-600 dark:text-eco-400">
                  <Icon name="Leaf" className="h-5 w-5" />
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-eco-600 dark:text-eco-400">
                  <AnimatedNumber value={totalCo2} decimals={1} suffix=" kg" />
                </p>
                <p className="text-xs text-slate-500">CO₂ avoided</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Icon name="Wallet" className="h-5 w-5" />
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
                  ₹<AnimatedNumber value={totalMoney} />
                </p>
                <p className="text-xs text-slate-500">Money saved</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-ocean-500/10 to-ocean-500/5 p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-500/15 text-ocean-600 dark:text-ocean-400">
                  <Icon name="TreePine" className="h-5 w-5" />
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-ocean-600 dark:text-ocean-400">
                  <AnimatedNumber value={Math.max(0.1, trees)} decimals={1} />
                </p>
                <p className="text-xs text-slate-500">Trees worth of absorption</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Emissions Projection</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your current avg: {userAvg.toFixed(1)} kg/day vs scenario</p>
              </div>
              <Pill tone="success"><Icon name="TrendingDown" className="h-3 w-3" /> {-selected.co2PerDaySaved.toFixed(1)} kg/day</Pill>
            </div>
            <div className="mt-4">
              <TrendLineChart
                data={baselineData}
                xKey="label"
                dataKeys={[
                  { key: 'current', color: '#94a3b8', name: 'Current projection' },
                  { key: 'scenario', color: '#10b981', name: 'With scenario' },
                ]}
                height={220}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="mb-2 text-sm font-semibold">Equivalent Impact</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: 'TreePine', value: trees.toFixed(1), label: 'Trees planted' },
                { icon: 'Smartphone', value: phonesCharged.toLocaleString(), label: 'Phones charged' },
                { icon: 'Car', value: (totalCo2 / 0.171).toFixed(0), label: 'km not driven' },
                { icon: 'Factory', value: (totalCo2 / 0.385).toFixed(0), label: 'kWh saved' },
              ].map((e) => (
                <div key={e.label} className="rounded-2xl bg-slate-100/40 p-3 text-center dark:bg-white/5">
                  <Icon name={e.icon} className="mx-auto mb-1 h-4 w-4 text-slate-400" />
                  <p className="text-sm font-bold tabular-nums">{e.value}</p>
                  <p className="text-[10px] text-slate-400">{e.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
