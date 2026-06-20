import { useState } from 'react';
import { Badge, GlassCard, Icon, PageHeader, Pill } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { rewardsHub } from '../lib/mockData';

const TIER_ICON_COLOR: Record<string, string> = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-300 to-slate-500',
  gold: 'from-yellow-300 to-amber-500',
  platinum: 'from-cyan-300 to-blue-500',
};

export default function RewardsHub() {
  const { state } = useEco();
  const [claimed, setClaimed] = useState<Set<string>>(new Set(['r2', 'r4']));

  const earnedBadges = state.badges.filter((b) => b.earned).length;
  const claimable = rewardsHub.filter((r) => claimed.has(r.id)).length;

  const handleClaim = (id: string) => {
    setClaimed((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Green Rewards Hub"
        subtitle="Sustainability rewards for top performers"
        icon="Gift"
        action={<Pill tone="success"><Icon name="Check" className="h-3 w-3" />{claimable} claimed</Pill>}
      />

      {/* Hero banner */}
      <GlassCard className="overflow-hidden p-0" strong>
        <div className="relative bg-gradient-to-br from-eco-500 via-emerald-500 to-ocean-600 p-8 text-white">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-0 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-eco-100">Your Reward Status</p>
              <p className="mt-1 text-2xl font-extrabold sm:text-3xl">6 rewards available</p>
              <p className="mt-1 text-sm text-eco-100">{earnedBadges} badges earned · {state.profile.treesPlanted} trees planted</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
              <Icon name="Gift" className="h-8 w-8" />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Rewards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rewardsHub.map((r) => {
          const isClaimed = claimed.has(r.id);
          return (
            <GlassCard key={r.id} className="overflow-hidden p-0" hover>
              <div className={`h-2 bg-gradient-to-r ${TIER_ICON_COLOR[r.tier]}`} />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${TIER_ICON_COLOR[r.tier]} text-white shadow-soft`}>
                    <Icon name={r.icon} className="h-7 w-7" />
                  </div>
                  <Badge tier={r.tier} />
                </div>
                <p className="mt-3 font-bold text-lg">{r.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{r.description}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <Icon name="Target" className="h-3 w-3" />
                  {r.requirement}
                </div>
                {isClaimed ? (
                  <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-eco-500/15 py-2.5 text-sm font-bold text-eco-600 dark:text-eco-400">
                    <Icon name="CheckCircle" className="h-4 w-4" />Claimed
                  </div>
                ) : (
                  <button
                    onClick={() => handleClaim(r.id)}
                    className="mt-4 w-full rounded-2xl bg-gradient-to-r from-eco-500 to-ocean-500 py-2.5 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02]"
                  >
                    Claim reward
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* How it works */}
      <GlassCard className="p-6">
        <p className="font-bold">How rewards work</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { icon: 'Activity', title: 'Track & save', desc: 'Log daily activities. Every kg of CO₂ saved counts toward your rank.' },
            { icon: 'Trophy', title: 'Climb the ranks', desc: 'Earn badges, complete missions, top the leaderboards.' },
            { icon: 'Gift', title: 'Claim rewards', desc: 'Top performers get tangible sustainability rewards delivered.' },
          ].map((s, i) => (
            <div key={s.title} className="relative rounded-2xl bg-slate-100/40 p-4 dark:bg-white/5">
              <span className="absolute right-3 top-2 text-3xl font-extrabold text-slate-200 dark:text-white/5">{i + 1}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <p className="mt-3 font-bold">{s.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
