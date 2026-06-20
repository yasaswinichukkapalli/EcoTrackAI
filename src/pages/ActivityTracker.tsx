import { useState } from 'react';
import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill, EmptyState } from '../components/ui';
import { MiniBarChart } from '../components/charts';
import { useEco } from '../context/EcoContext';
import { calcTransportCo2, calcElectricityCo2, calcFoodCo2, calcWaterCo2, getDailyBreakdown, todayIso } from '../lib/calc';
import type { ActivityCategory, ActivityEntry } from '../lib/types';

const CATEGORIES: { key: ActivityCategory; label: string; icon: string; color: string; unit: string }[] = [
  { key: 'transport', label: 'Transportation', icon: 'Car', color: '#3b82f6', unit: 'km' },
  { key: 'electricity', label: 'Electricity', icon: 'Zap', color: '#f59e0b', unit: 'kWh' },
  { key: 'food', label: 'Food', icon: 'Salad', color: '#ef4444', unit: 'kcal' },
  { key: 'water', label: 'Water', icon: 'Droplets', color: '#06b6d4', unit: 'liters' },
];

const SUBTYPES: Record<ActivityCategory, { value: string; label: string }[]> = {
  transport: [
    { value: 'car_petrol', label: 'Car (petrol)' },
    { value: 'car_diesel', label: 'Car (diesel)' },
    { value: 'car_electric', label: 'Electric car' },
    { value: 'bus', label: 'Bus' },
    { value: 'train', label: 'Train/Metro' },
    { value: 'bike', label: 'Motorcycle' },
    { value: 'walk', label: 'Walking' },
  ],
  electricity: [
    { value: 'grid', label: 'Grid power' },
    { value: 'solar', label: 'Solar' },
  ],
  food: [
    { value: 'beef', label: 'Beef meal' },
    { value: 'pork', label: 'Pork meal' },
    { value: 'chicken', label: 'Chicken meal' },
    { value: 'fish', label: 'Fish meal' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
  ],
  water: [{ value: 'tap', label: 'Household water' }],
};

export default function ActivityTracker() {
  const { state, dispatch } = useEco();
  const [category, setCategory] = useState<ActivityCategory>('transport');
  const [subtype, setSubtype] = useState('car_petrol');
  const [amount, setAmount] = useState('');
  const [toast, setToast] = useState(false);

  const meta = CATEGORIES.find((c) => c.key === category)!;
  const todayEntries = state.activities.filter((a) => a.date === todayIso());
  const todayCo2 = todayEntries.reduce((s, a) => s + a.co2, 0);
  const weekData = getDailyBreakdown(state.activities, 7);

  const handleCategoryChange = (c: ActivityCategory) => {
    setCategory(c);
    setSubtype(SUBTYPES[c][0].value);
  };

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    let co2 = 0;
    let label = '';
    if (category === 'transport') {
      co2 = calcTransportCo2(subtype, amt);
      label = SUBTYPES.transport.find((s) => s.value === subtype)?.label ?? subtype;
    } else if (category === 'electricity') {
      co2 = calcElectricityCo2(subtype, amt);
      label = SUBTYPES.electricity.find((s) => s.value === subtype)?.label ?? subtype;
    } else if (category === 'food') {
      co2 = calcFoodCo2(subtype, amt);
      label = SUBTYPES.food.find((s) => s.value === subtype)?.label ?? subtype;
    } else {
      co2 = calcWaterCo2(amt);
      label = 'Household water';
    }
    const entry: ActivityEntry = {
      id: `a-${Date.now()}`,
      date: todayIso(),
      category,
      subtype,
      amount: amt,
      co2,
      label,
    };
    dispatch({ type: 'ADD_ACTIVITY', entry });
    setAmount('');
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const liveCo2 = (() => {
    const amt = parseFloat(amount);
    if (!amt) return 0;
    if (category === 'transport') return calcTransportCo2(subtype, amt);
    if (category === 'electricity') return calcElectricityCo2(subtype, amt);
    if (category === 'food') return calcFoodCo2(subtype, amt);
    return calcWaterCo2(amt);
  })();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Activity Tracker" subtitle="Log your daily activities to measure your carbon footprint" icon="Activity" />

      {toast && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 animate-pop-in">
          <div className="glass-strong flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-glow">
            <Icon name="CheckCircle" className="h-5 w-5 text-eco-500" />
            <span className="text-sm font-semibold">Activity logged!</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Entry form */}
        <GlassCard className="lg:col-span-3 p-6" strong>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => handleCategoryChange(c.key)}
                className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                  category === c.key
                    ? 'bg-gradient-to-br from-eco-400/15 to-ocean-500/15 ring-2 ring-eco-500/40'
                    : 'bg-slate-100/50 hover:bg-slate-200/50 dark:bg-white/5 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${c.color}25`, color: c.color }}>
                  <Icon name={c.icon} className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Type</label>
              <div className="flex flex-wrap gap-2">
                {SUBTYPES[category].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSubtype(s.value)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      subtype === s.value
                        ? 'bg-eco-500 text-white shadow-glow'
                        : 'bg-slate-100/60 text-slate-600 hover:bg-slate-200/60 dark:bg-white/5 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Amount ({meta.unit})
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter ${meta.unit}`}
                  className="flex-1 rounded-2xl border border-slate-200/60 bg-white/50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-eco-500 focus:ring-4 focus:ring-eco-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!amount}
                  className="rounded-2xl bg-gradient-to-r from-eco-500 to-ocean-500 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
                >
                  Log
                </button>
              </div>
            </div>

            {parseFloat(amount) > 0 && (
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-eco-500/10 to-ocean-500/10 p-4 animate-fade-in-scale">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Estimated CO₂</span>
                <div className="flex items-center gap-1.5">
                  <Icon name="Cloud" className="h-4 w-4 text-ocean-500" />
                  <AnimatedNumber value={liveCo2} decimals={2} suffix=" kg" className="text-xl font-extrabold" />
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Today summary */}
        <GlassCard className="lg:col-span-2 p-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Today's Footprint</p>
          <div className="mt-2 flex items-baseline gap-2">
            <AnimatedNumber value={todayCo2} decimals={2} suffix=" kg" className="text-4xl font-extrabold" />
            <Pill tone={todayCo2 < 15 ? 'success' : 'warning'}>CO₂</Pill>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => {
              const v = todayEntries.filter((e) => e.category === c.key).reduce((s, e) => s + e.co2, 0);
              return (
                <div key={c.key} className="rounded-2xl bg-slate-100/50 p-2 dark:bg-white/5">
                  <div className="flex items-center justify-center h-7 w-7 rounded-lg mx-auto mb-1" style={{ backgroundColor: `${c.color}25`, color: c.color }}>
                    <Icon name={c.icon} className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-center text-xs font-bold tabular-nums">{v.toFixed(1)}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <MiniBarChart data={weekData.map((d) => ({ name: d.label, co2: d.co2 }))} xKey="name" yKey="co2" height={140} />
          </div>
        </GlassCard>
      </div>

      {/* Today's log */}
      <GlassCard className="p-6">
        <p className="mb-3 font-semibold">Today's Activity Log</p>
        {todayEntries.length === 0 ? (
          <EmptyState icon="Activity" title="No activities logged yet" description="Add your first activity above to start tracking your footprint." />
        ) : (
          <div className="space-y-2">
            {todayEntries.slice(0, 8).map((a) => {
              const meta = CATEGORIES.find((c) => c.key === a.category)!;
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-slate-100/40 p-3 dark:bg-white/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${meta.color}25`, color: meta.color }}>
                    <Icon name={meta.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{a.label}</p>
                    <p className="text-xs text-slate-400">{a.amount} {meta.unit}</p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{a.co2.toFixed(2)} kg</span>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_ACTIVITY', id: a.id })}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-500/15"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
