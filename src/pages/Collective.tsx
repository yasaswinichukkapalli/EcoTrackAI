import { AreaTrendChart, CategoryPieChart, MiniBarChart } from '../components/charts';
import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill, ProgressRing } from '../components/ui';
import { useEco } from '../context/EcoContext';

const communityTrend = Array.from({ length: 30 }, (_, i) => ({
  label: `D${i + 1}`,
  co2: Math.round(8200 + Math.sin(i / 3) * 800 + i * 120),
  trees: Math.round(120 + i * 8),
}));

const regionBreakdown = [
  { name: 'Bengaluru', value: 18420, color: '#10b981' },
  { name: 'Mumbai', value: 16750, color: '#3b82f6' },
  { name: 'Delhi', value: 15200, color: '#f59e0b' },
  { name: 'Pune', value: 13100, color: '#06b6d4' },
  { name: 'Others', value: 28400, color: '#94a3b8' },
];

export default function Collective() {
  const { state } = useEco();

  const totalCo2 = 1_842_000;
  const totalWater = 4_680_000;
  const totalTrees = 282_400;
  const users = 48_290;
  const yourShare = (state.totalCarbonSaved / totalCo2) * 100;

  const metrics = [
    {
      label: 'CO₂ Saved Together',
      value: totalCo2,
      suffix: ' kg',
      icon: 'Leaf',
      color: 'from-eco-400 to-eco-600',
      desc: 'Across all EcoTrack users',
    },
    {
      label: 'Water Conserved',
      value: totalWater,
      suffix: ' L',
      icon: 'Droplets',
      color: 'from-cyan-400 to-blue-500',
      desc: 'Collective water saved',
    },
    {
      label: 'Trees Protected',
      value: totalTrees,
      icon: 'TreePine',
      color: 'from-amber-400 to-orange-500',
      desc: 'Through reforestation',
    },
    {
      label: 'Active Citizens',
      value: users,
      icon: 'Users',
      color: 'from-violet-400 to-fuchsia-500',
      desc: 'Tracking every day',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Collective Impact"
        subtitle="The combined force of every EcoTrack citizen"
        icon="Globe2"
        action={<Pill tone="success"><Icon name="Users" className="h-3 w-3" />You're one of {users.toLocaleString()}</Pill>}
      />

      {/* Hero metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <GlassCard key={m.label} className="p-6 relative overflow-hidden" strong hover>
            <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${m.color} opacity-10 blur-2xl`} />
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-soft`}>
              <Icon name={m.icon} className="h-6 w-6" />
            </div>
            <p className="mt-4 text-3xl font-extrabold tabular-nums">
              <AnimatedNumber value={m.value} suffix={m.suffix} />
            </p>
            <p className="text-sm font-semibold">{m.label}</p>
            <p className="text-xs text-slate-400">{m.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Trend + breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Community CO₂ Trend</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last 30 days, all users</p>
            </div>
            <Pill tone="success"><Icon name="TrendingUp" className="h-3 w-3" />+18% MoM</Pill>
          </div>
          <div className="mt-4">
            <AreaTrendChart
              data={communityTrend}
              xKey="label"
              dataKeys={[{ key: 'co2', color: '#10b981', name: 'CO₂ saved (kg)' }]}
              height={220}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="font-semibold">Impact by Region</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Top contributing cities</p>
          <div className="mt-2">
            <CategoryPieChart data={regionBreakdown} height={220} />
          </div>
        </GlassCard>
      </div>

      {/* Your contribution */}
      <GlassCard className="p-6" strong>
        <div className="grid items-center gap-6 lg:grid-cols-3">
          <div className="text-center">
            <ProgressRing value={Math.min(100, yourShare * 1000)} max={100} size={150} stroke={12} color="#10b981">
              <div>
                <p className="text-xl font-extrabold">{yourShare.toFixed(4)}%</p>
                <p className="text-[10px] text-slate-400">of total</p>
              </div>
            </ProgressRing>
            <p className="mt-2 text-sm font-semibold">Your contribution</p>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Your CO₂ saved</span>
                <span className="font-bold tabular-nums">{state.totalCarbonSaved.toFixed(1)} kg</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200/50 dark:bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-eco-400 to-ocean-500" style={{ width: `${Math.min(100, yourShare * 1000)}%` }} />
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You've personally saved the equivalent of <span className="font-bold text-eco-600 dark:text-eco-400">{(state.totalCarbonSaved / 21).toFixed(1)} trees</span> worth of CO₂ absorption per year. Every action compounds — together we move the needle.
            </p>
            <div className="flex flex-wrap gap-2">
              <Pill tone="success"><Icon name="TreePine" className="h-3 w-3" />{state.profile.treesPlanted} trees planted</Pill>
              <Pill tone="info"><Icon name="Star" className="h-3 w-3" />Trust score {state.profile.trustScore}</Pill>
              <Pill tone="warning"><Icon name="Flame" className="h-3 w-3" />{state.streak}-day streak</Pill>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Mini stat */}
      <GlassCard className="p-6">
        <p className="font-semibold">Daily trees protected</p>
        <div className="mt-3">
          <MiniBarChart
            data={communityTrend.slice(-7).map((d) => ({ name: d.label, trees: d.trees }))}
            xKey="name"
            yKey="trees"
            color="#10b981"
            height={140}
          />
        </div>
      </GlassCard>
    </div>
  );
}
