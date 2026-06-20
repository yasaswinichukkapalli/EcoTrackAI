import { AnimatedNumber, Badge, GlassCard, Icon, PageHeader, Pill } from '../components/ui';
import { useEco } from '../context/EcoContext';

const TIER_COLORS: Record<string, string> = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-300 to-slate-500',
  gold: 'from-yellow-300 to-amber-500',
  platinum: 'from-cyan-300 to-blue-500',
};

const TIER_GLOW: Record<string, string> = {
  bronze: 'shadow-[0_0_30px_rgba(217,119,6,0.4)]',
  silver: 'shadow-[0_0_30px_rgba(148,163,184,0.4)]',
  gold: 'shadow-[0_0_40px_rgba(245,158,11,0.5)]',
  platinum: 'shadow-[0_0_40px_rgba(6,182,212,0.5)]',
};

export default function Rewards() {
  const { state } = useEco();
  const earned = state.badges.filter((b) => b.earned);
  const locked = state.badges.filter((b) => !b.earned);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Rewards & Badges"
        subtitle="Celebrate milestones on your sustainability journey"
        icon="Trophy"
        action={<Pill tone="success"><Icon name="Award" className="h-3 w-3" />{earned.length} earned</Pill>}
      />

      {/* Stats banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Badges Earned', value: earned.length, total: state.badges.length, icon: 'Medal', color: 'from-amber-400 to-rose-500' },
          { label: 'Garden XP', value: state.gardenXp, icon: 'Sparkles', color: 'from-eco-400 to-ocean-500' },
          { label: 'Day Streak', value: state.streak, icon: 'Flame', color: 'from-orange-400 to-rose-500' },
        ].map((s) => (
          <GlassCard key={s.label} className="p-5" hover>
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-soft`}>
                <Icon name={s.icon} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">
                  <AnimatedNumber value={s.value} />
                  {s.total && <span className="text-base text-slate-400">/{s.total}</span>}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Earned badges */}
      <div>
        <p className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">Earned</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {earned.map((b) => (
            <GlassCard key={b.id} className="p-5 animate-pop-in" hover>
              <div className="flex items-start justify-between">
                <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${TIER_COLORS[b.tier]} text-white ${TIER_GLOW[b.tier]}`}>
                  <Icon name={b.icon} className="h-8 w-8" />
                </div>
                <Badge tier={b.tier} />
              </div>
              <p className="mt-3 font-bold text-lg">{b.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{b.description}</p>
              {b.date && <p className="mt-2 text-xs text-slate-400">Earned {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <p className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">Locked</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((b) => (
              <GlassCard key={b.id} className="p-5 opacity-70">
                <div className="flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-200/60 text-slate-400 dark:bg-white/5 dark:text-slate-500">
                    <Icon name="Lock" className="h-7 w-7" />
                  </div>
                  <Badge tier={b.tier} />
                </div>
                <p className="mt-3 font-bold">{b.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{b.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
