import { useState } from 'react';
import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { areaLeaderboard, cityLeaderboard, stateLeaderboard, monthlyChampions } from '../lib/mockData';
import type { LeaderboardEntry } from '../lib/types';

const TABS = [
  { id: 'area', label: 'Area', icon: 'MapPin', data: areaLeaderboard, suffix: ' kg' },
  { id: 'city', label: 'City', icon: 'Building2', data: cityLeaderboard, suffix: ' kg' },
  { id: 'state', label: 'State', icon: 'Landmark', data: stateLeaderboard, suffix: ' kg' },
  { id: 'champions', label: 'Monthly Champions', icon: 'Trophy', data: monthlyChampions, suffix: ' kg' },
] as const;

export default function Leaderboards() {
  const { state } = useEco();
  const [tab, setTab] = useState<typeof TABS[number]['id']>('area');
  const active = TABS.find((t) => t.id === tab)!;

  const podium = active.data.slice(0, 3);
  const rest = active.data.slice(3);
  const yourRank = active.data.find((e) => e.isYou)?.rank;

  const podiumHeights = ['h-20', 'h-28', 'h-16'];
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Leaderboards"
        subtitle="Compete with your community in the green race"
        icon="Medal"
        action={yourRank ? <Pill tone="success"><Icon name="Trophy" className="h-3 w-3" />You: #{yourRank}</Pill> : undefined}
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-gradient-to-r from-eco-500 to-ocean-500 text-white shadow-glow'
                : 'glass text-slate-600 dark:text-slate-300'
            }`}
          >
            <Icon name={t.icon} className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Podium */}
      <GlassCard className="p-6" strong>
        <div className="grid grid-cols-3 items-end gap-3 sm:gap-6 px-2 sm:px-8">
          {podiumOrder.map((idx) => {
            const entry = podium[idx];
            if (!entry) return null;
            const rank = entry.rank;
            const colors = rank === 1 ? 'from-yellow-300 to-amber-500' : rank === 2 ? 'from-slate-300 to-slate-500' : 'from-orange-300 to-amber-700';
            return (
              <div key={entry.rank} className="flex flex-col items-center">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${state.profile.avatarColor} text-white text-sm font-bold ring-4 ring-white/60 dark:ring-white/10`}>
                  {entry.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <p className="mt-2 max-w-[90px] truncate text-center text-xs font-bold sm:text-sm">{entry.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{entry.area || entry.city}</p>
                <div className={`mt-2 ${podiumHeights[idx]} flex w-full flex-col items-center justify-center rounded-t-2xl bg-gradient-to-b ${colors} text-white shadow-soft`}>
                  <p className="text-2xl font-extrabold">#{rank}</p>
                  <p className="text-[10px] font-semibold">
                    <AnimatedNumber value={entry.co2Saved} suffix={active.suffix} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* List */}
      <GlassCard className="p-4">
        <div className="space-y-1">
          {rest.map((entry: LeaderboardEntry) => (
            <div
              key={`${entry.rank}-${entry.name}`}
              className={`flex items-center gap-4 rounded-2xl p-3 transition ${
                entry.isYou ? 'bg-gradient-to-r from-eco-500/15 to-ocean-500/10 ring-1 ring-eco-500/30' : 'hover:bg-slate-100/40 dark:hover:bg-white/5'
              }`}
            >
              <span className="w-8 text-center text-lg font-extrabold text-slate-400">{entry.rank}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${entry.isYou ? state.profile.avatarColor : 'from-slate-300 to-slate-400'} text-white text-xs font-bold`}>
                {entry.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold">{entry.name}{entry.isYou && <span className="ml-2 text-xs text-eco-600 dark:text-eco-400">(You)</span>}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{entry.area ? `${entry.area} · ` : ''}{entry.city || entry.area}</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold tabular-nums"><AnimatedNumber value={entry.co2Saved} decimals={0} suffix={active.suffix} /></p>
                <p className="text-[10px] text-slate-400">{entry.trees} trees</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
