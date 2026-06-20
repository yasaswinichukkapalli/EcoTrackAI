import { useState } from 'react';
import { AnimatedNumber, Badge, GlassCard, Icon, PageHeader, Pill, ProgressRing } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { calcEcoScore } from '../lib/calc';

const TIERS = [
  { name: 'Bronze', min: 0, color: 'from-amber-600 to-amber-800' },
  { name: 'Silver', min: 60, color: 'from-slate-300 to-slate-500' },
  { name: 'Gold', min: 75, color: 'from-yellow-300 to-amber-500' },
  { name: 'Platinum', min: 90, color: 'from-cyan-300 to-blue-500' },
];

export default function Profile() {
  const { state, dispatch } = useEco();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: state.profile.name,
    city: state.profile.city,
    state: state.profile.state,
    area: state.profile.area,
    college: state.profile.college,
  });

  const score = calcEcoScore(state.activities);
  const tier = [...TIERS].reverse().find((t) => score >= t.min) ?? TIERS[0];
  const nextTier = TIERS.find((t) => t.min > score);
  const tierProgress = nextTier ? ((score - tier.min) / (nextTier.min - tier.min)) * 100 : 100;

  const earnedBadges = state.badges.filter((b) => b.earned);

  const stats = [
    { label: 'Trust Score', value: state.profile.trustScore, suffix: '/100', icon: 'ShieldCheck', color: 'from-eco-400 to-ocean-500' },
    { label: 'Trees Planted', value: state.profile.treesPlanted, icon: 'TreePine', color: 'from-amber-400 to-orange-500' },
    { label: 'Carbon Saved', value: state.totalCarbonSaved, suffix: ' kg', icon: 'Leaf', color: 'from-eco-400 to-eco-600' },
    { label: 'Badges Earned', value: earnedBadges.length, suffix: `/${state.badges.length}`, icon: 'Medal', color: 'from-violet-400 to-fuchsia-500' },
  ];

  const handleSave = () => {
    dispatch({ type: 'SET_PROFILE', profile: form });
    setEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Your Profile"
        subtitle="Track your journey, trust score and achievements"
        icon="User"
        action={
          <button
            onClick={() => setEditing(!editing)}
            className="rounded-full bg-gradient-to-r from-eco-500 to-ocean-500 px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:scale-105"
          >
            <Icon name={editing ? 'X' : 'Pencil'} className="mr-1.5 inline h-4 w-4" />{editing ? 'Cancel' : 'Edit'}
          </button>
        }
      />

      {/* Profile hero */}
      <GlassCard className="overflow-hidden p-0" strong>
        <div className={`relative bg-gradient-to-br ${state.profile.avatarColor} p-8 text-white`}>
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur text-3xl font-extrabold shadow-glow ring-4 ring-white/30">
              {state.profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold sm:text-3xl">{state.profile.name}</h2>
                <Icon name="BadgeCheck" className="h-5 w-5 text-white/80" />
              </div>
              <p className="mt-0.5 text-sm text-white/90">
                {state.profile.area}, {state.profile.city} · {state.profile.state}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Icon name="GraduationCap" className="mr-1 inline h-3 w-3" />{state.profile.college}
                </span>
                <span className={`rounded-full bg-gradient-to-r ${tier.color} px-3 py-1 text-xs font-bold text-white`}>
                  {tier.name} tier
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Icon name="Calendar" className="mr-1 inline h-3 w-3" />Joined {new Date(state.profile.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Tier progress strip */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{tier.name} tier</span>
            <span>{nextTier ? `${nextTier.name} at ${nextTier.min} score` : 'Max tier!'}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200/50 dark:bg-white/5">
            <div className={`h-full rounded-full bg-gradient-to-r ${tier.color} transition-all duration-1000`} style={{ width: `${tierProgress}%` }} />
          </div>
        </div>
      </GlassCard>

      {/* Edit form */}
      {editing && (
        <GlassCard className="p-6 animate-fade-in-scale">
          <p className="mb-4 font-bold">Edit profile</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              ['name', 'Full name'],
              ['area', 'Area'],
              ['city', 'City'],
              ['state', 'State'],
              ['college', 'College / Org'],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-eco-500 focus:ring-4 focus:ring-eco-500/10 dark:border-white/10 dark:bg-white/5"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="mt-4 rounded-2xl bg-gradient-to-r from-eco-500 to-ocean-500 px-6 py-2.5 text-sm font-bold text-white shadow-glow transition hover:scale-105"
          >
            <Icon name="Check" className="mr-1.5 inline h-4 w-4" />Save changes
          </button>
        </GlassCard>
      )}

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-5" hover>
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white`}>
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              {s.label === 'Trust Score' && (
                <ProgressRing value={s.value} size={36} stroke={3} color="#10b981">
                  <span className="text-[8px] font-bold">{Math.round((s.value / 100) * 100)}%</span>
                </ProgressRing>
              )}
            </div>
            <p className="mt-3 text-2xl font-extrabold">
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Badges showcase */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <p className="font-bold">Badge Showcase</p>
          <Pill tone="success">{earnedBadges.length} earned</Pill>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {state.badges.map((b) => (
            <div key={b.id} className={`flex flex-col items-center rounded-2xl p-3 text-center transition ${
              b.earned ? 'bg-gradient-to-br from-eco-500/10 to-ocean-500/5' : 'bg-slate-100/30 opacity-50 dark:bg-white/5'
            }`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                b.earned
                  ? `bg-gradient-to-br ${b.tier === 'gold' ? 'from-yellow-300 to-amber-500' : b.tier === 'platinum' ? 'from-cyan-300 to-blue-500' : b.tier === 'silver' ? 'from-slate-300 to-slate-500' : 'from-amber-600 to-amber-800'} text-white`
                  : 'bg-slate-200/60 text-slate-400 dark:bg-white/5'
              }`}>
                <Icon name={b.earned ? b.icon : 'Lock'} className="h-5 w-5" />
              </div>
              <p className="mt-1.5 text-[10px] font-semibold leading-tight">{b.name}</p>
              {b.earned && <Badge tier={b.tier} />}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Eco score breakdown */}
      <GlassCard className="p-6">
        <div className="grid items-center gap-6 lg:grid-cols-3">
          <div className="text-center">
            <ProgressRing value={score} size={140} stroke={12} color={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}>
              <div>
                <AnimatedNumber value={score} className="text-3xl font-extrabold" />
                <p className="text-[10px] text-slate-400">/ 100</p>
              </div>
            </ProgressRing>
            <p className="mt-2 font-semibold">Eco Score</p>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <p className="font-semibold">Score Breakdown</p>
            {[
              { label: 'Transport habits', value: Math.min(100, 78 - score / 4), icon: 'Car', color: '#3b82f6' },
              { label: 'Energy efficiency', value: Math.min(100, 72 + score / 6), icon: 'Zap', color: '#f59e0b' },
              { label: 'Diet footprint', value: Math.min(100, 80 - score / 5), icon: 'Salad', color: '#ef4444' },
              { label: 'Water usage', value: Math.min(100, 85 + score / 8), icon: 'Droplets', color: '#06b6d4' },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Icon name={r.icon} className="h-3.5 w-3.5" style={{ color: r.color }} />
                    {r.label}
                  </span>
                  <span className="font-bold tabular-nums">{Math.round(r.value)}/100</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200/50 dark:bg-white/5">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${r.value}%`, backgroundColor: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
