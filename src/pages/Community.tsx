import { useState } from 'react';
import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { communityChallenges } from '../lib/mockData';

export default function Community() {
  const { state } = useEco();
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const toggleJoin = (id: string) => {
    setJoined((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Community Challenges"
        subtitle="Compete as a team for collective climate impact"
        icon="Users"
        action={<Pill tone="info"><Icon name="Users" className="h-3 w-3" />{joined.size} joined</Pill>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {communityChallenges.map((ch) => {
          const aPct = (ch.teamA.value / ch.teamA.goal) * 100;
          const bPct = (ch.teamB.value / ch.teamB.goal) * 100;
          const leading = ch.teamA.value > ch.teamB.value ? ch.teamA : ch.teamB;
          const isJoined = joined.has(ch.id);

          return (
            <GlassCard key={ch.id} className="p-6" strong hover>
              <div className="flex items-start justify-between">
                <div>
                  <Pill tone={ch.type === 'college' ? 'info' : 'success'}>{ch.subtitle}</Pill>
                  <p className="mt-2 font-bold text-lg">{ch.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <Icon name="Clock" className="mr-1 inline h-3 w-3" />Ends in {ch.endsIn}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white">
                  <Icon name={ch.type === 'college' ? 'GraduationCap' : 'MapPin'} className="h-6 w-6" />
                </div>
              </div>

              {/* VS visualization */}
              <div className="mt-5 space-y-4">
                {[ch.teamA, ch.teamB].map((team, idx) => {
                  const pct = (team.value / team.goal) * 100;
                  const isLeading = team === leading && (ch.teamA.value !== ch.teamB.value);
                  return (
                    <div key={idx}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-bold flex items-center gap-1.5">
                          {isLeading && <Icon name="Crown" className="h-3 w-3 text-amber-500" />}
                          {team.name}
                        </span>
                        <span className="tabular-nums text-slate-500 dark:text-slate-400">{team.value}/{team.goal} {ch.metric.split(' ')[1]}</span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/50 dark:bg-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            idx === 0 ? 'bg-gradient-to-r from-eco-400 to-eco-500' : 'bg-gradient-to-r from-ocean-400 to-ocean-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-100/40 p-3 text-center dark:bg-white/5">
                  <p className="text-xs text-slate-400">Leading</p>
                  <p className="text-sm font-bold">{leading.name}</p>
                </div>
                <div className="rounded-2xl bg-slate-100/40 p-3 text-center dark:bg-white/5">
                  <p className="text-xs text-slate-400">Trees</p>
                  <p className="text-sm font-bold">{ch.teamA.trees + ch.teamB.trees} total</p>
                </div>
                <div className="rounded-2xl bg-slate-100/40 p-3 text-center dark:bg-white/5">
                  <p className="text-xs text-slate-400">Combined</p>
                  <p className="text-sm font-bold">{Math.round(((aPct + bPct) / 2))}%</p>
                </div>
              </div>

              <button
                onClick={() => toggleJoin(ch.id)}
                className={`mt-4 w-full rounded-2xl py-2.5 text-sm font-bold transition-all ${
                  isJoined
                    ? 'bg-eco-500/15 text-eco-600 dark:text-eco-400 ring-1 ring-eco-500/30'
                    : 'bg-gradient-to-r from-eco-500 to-ocean-500 text-white shadow-glow hover:scale-[1.02]'
                }`}
              >
                {isJoined ? (
                  <span className="flex items-center justify-center gap-1.5"><Icon name="Check" className="h-4 w-4" />Joined · Team {ch.teamA.name === state.profile.area ? ch.teamA.name : 'others'}</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5"><Icon name="Plus" className="h-4 w-4" />Join challenge</span>
                )}
              </button>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white">
            <Icon name="Megaphone" className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Start your own challenge</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rally your area or college to a green cause</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Plant 50 trees', value: 38, goal: 50, icon: 'TreePine' },
            { label: 'Save 500 kg CO₂', value: 320, goal: 500, icon: 'Leaf' },
            { label: 'Log 1000 activities', value: 740, goal: 1000, icon: 'Activity' },
          ].map((c) => {
            const pct = (c.value / c.goal) * 100;
            return (
              <div key={c.label} className="rounded-2xl bg-slate-100/40 p-4 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <Icon name={c.icon} className="h-4 w-4 text-eco-500" />
                  <p className="text-xs font-semibold">{c.label}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/60 dark:bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-eco-400 to-ocean-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-[10px] text-slate-400"><AnimatedNumber value={c.value} />/<AnimatedNumber value={c.goal} /></p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
