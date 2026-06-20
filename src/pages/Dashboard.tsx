import { AreaTrendChart, CategoryPieChart, MiniBarChart } from '../components/charts';
import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill, ProgressRing } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { calcEcoScore, calcTrend, getCategoryBreakdown, getDailyBreakdown, getActivitiesForDate, sumCo2, todayIso, calcTreesNeeded } from '../lib/calc';
import { DAILY_BASELINE } from '../lib/types';

export default function Dashboard({ setPage }: { setPage: (p: string) => void }) {
  const { state } = useEco();
  const score = calcEcoScore(state.activities);
  const todayEntries = getActivitiesForDate(state.activities, todayIso());
  const todayCo2 = sumCo2(todayEntries);
  const weekData = getDailyBreakdown(state.activities, 7);
  const monthData = getDailyBreakdown(state.activities, 30);
  const breakdown = getCategoryBreakdown(getDailyBreakdown(state.activities, 7).length ? state.activities : state.activities);
  const trend = calcTrend(state.activities, 7);

  const todaySaved = Math.max(0, DAILY_BASELINE.total - todayCo2);
  const treesToday = calcTreesNeeded(todaySaved);

  const stats = [
    { label: "Today's CO₂", value: todayCo2, suffix: ' kg', icon: 'Cloud', tone: 'info' as const, delta: trend },
    { label: 'CO₂ Saved Today', value: todaySaved, suffix: ' kg', icon: 'Leaf', tone: 'success' as const },
    { label: 'Total Saved', value: state.totalCarbonSaved, suffix: ' kg', icon: 'TrendingDown', tone: 'success' as const },
    { label: 'Trees Offset', value: treesToday, decimals: 1, icon: 'TreePine', tone: 'success' as const },
  ];

  const scoreGrade = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs work';
  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Hello, ${state.profile.name.split(' ')[0]}`}
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        icon="LayoutDashboard"
        action={<Pill tone="success"><Icon name="Flame" className="h-3 w-3" />{state.streak}-day streak</Pill>}
      />

      {/* Hero: Eco Score + today summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1 p-6 flex flex-col items-center text-center" strong>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Your Eco Score</p>
          <div className="my-3">
            <ProgressRing value={score} max={100} size={160} stroke={12} color={scoreColor}>
              <div className="text-center">
                <AnimatedNumber value={score} className="text-4xl font-extrabold" />
                <p className="text-xs font-semibold text-slate-400">out of 100</p>
              </div>
            </ProgressRing>
          </div>
          <Pill tone={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'}>{scoreGrade}</Pill>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {state.totalCarbonSaved.toFixed(0)} kg saved all-time · beats {Math.round(state.totalCarbonSaved / 19)} average days
          </p>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-6" strong>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Weekly Carbon Footprint</p>
              <p className="mt-1 flex items-baseline gap-2">
                <AnimatedNumber value={weekData.reduce((s, d) => s + d.co2, 0)} suffix=" kg" className="text-3xl font-extrabold" />
                <span className={`text-xs font-bold ${trend.direction === 'down' ? 'text-eco-600' : 'text-rose-500'}`}>
                  <Icon name={trend.direction === 'down' ? 'ArrowDownRight' : trend.direction === 'up' ? 'ArrowUpRight' : 'Minus'} className="mr-0.5 inline h-3 w-3" />
                  {trend.label}
                </span>
              </p>
            </div>
            <button onClick={() => setPage('simulator')} className="rounded-full bg-eco-500/10 px-3 py-1.5 text-xs font-semibold text-eco-600 dark:text-eco-400 hover:bg-eco-500/20 transition">
              Simulate →
            </button>
          </div>
          <div className="mt-4">
            <AreaTrendChart
              data={weekData}
              xKey="label"
              dataKeys={[
                { key: 'co2', color: '#3b82f6', name: 'Emitted' },
                { key: 'saved', color: '#10b981', name: 'Saved' },
              ]}
              height={220}
            />
          </div>
        </GlassCard>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-5" hover>
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              {'delta' in s && s.delta && (
                <Pill tone={s.delta.direction === 'down' ? 'success' : 'error'}>
                  {s.delta.direction === 'down' ? '↓' : '↑'} {s.delta.value}%
                </Pill>
              )}
            </div>
            <p className="mt-3 text-2xl font-extrabold tabular-nums">
              <AnimatedNumber value={s.value} decimals={('decimals' in s && s.decimals) || 0} suffix={s.suffix} />
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Breakdown pie + monthly bars */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Carbon Breakdown</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">By category this week</p>
            </div>
            <button onClick={() => setPage('tracker')} className="text-xs font-semibold text-eco-600 dark:text-eco-400">Log activity →</button>
          </div>
          <div className="mt-2">
            <CategoryPieChart
              data={breakdown.map((b) => ({ name: b.label, value: Math.max(0.01, b.co2), color: b.color }))}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="font-semibold">Monthly Analytics</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Daily CO₂ over the last 30 days</p>
          <div className="mt-4">
            <MiniBarChart
              data={monthData.map((d) => ({ name: d.label, co2: d.co2 }))}
              xKey="name"
              yKey="co2"
              color="#10b981"
              height={220}
            />
          </div>
        </GlassCard>
      </div>

      {/* Quick actions row */}
      <GlassCard className="p-5">
        <p className="mb-3 text-sm font-semibold">Quick actions</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { id: 'tracker', label: 'Log Activity', icon: 'Plus' },
            { id: 'missions', label: 'Daily Missions', icon: 'Target' },
            { id: 'coach', label: 'Ask Coach', icon: 'Sparkles' },
            { id: 'garden', label: 'View Garden', icon: 'Trees' },
          ].map((a) => (
            <button key={a.id} onClick={() => setPage(a.id)} className="glass flex items-center gap-3 rounded-2xl p-3 text-left transition hover:scale-[1.03]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white">
                <Icon name={a.icon} className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold">{a.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
