import { useState } from 'react';
import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill, ProgressRing } from '../components/ui';
import { useEco } from '../context/EcoContext';

function Confetti() {
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#06b6d4'];
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 h-2 w-2 rounded-sm animate-confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random()}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Missions() {
  const { state, dispatch } = useEco();
  const [celebrate, setCelebrate] = useState<string | null>(null);

  const completed = state.missions.filter((m) => m.completed).length;
  const totalXp = state.missions.filter((m) => m.completed).reduce((s, m) => s + m.xp, 0);
  const progress = (completed / state.missions.length) * 100;

  const handleToggle = (id: string, completed: boolean) => {
    dispatch({ type: 'TOGGLE_MISSION', id });
    if (!completed) {
      setCelebrate(id);
      setTimeout(() => setCelebrate(null), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {celebrate && <Confetti />}
      <PageHeader title="Daily Missions" subtitle="Complete eco challenges and earn XP to grow your garden" icon="Target" />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 flex flex-col items-center text-center" strong>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Today's Progress</p>
          <div className="my-3">
            <ProgressRing value={progress} size={140} stroke={12} color="#10b981">
              <div>
                <AnimatedNumber value={completed} className="text-3xl font-extrabold" />
                <span className="text-lg text-slate-400">/{state.missions.length}</span>
                <p className="text-[10px] text-slate-400">done</p>
              </div>
            </ProgressRing>
          </div>
          <Pill tone="success"><Icon name="Zap" className="h-3 w-3" />{totalXp} XP earned</Pill>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Mission Board</p>
            <Pill tone="info"><Icon name="Flame" className="h-3 w-3" />{state.streak}-day streak</Pill>
          </div>
          <div className="mt-3 space-y-3">
            {state.missions.map((m) => (
              <div
                key={m.id}
                className={`flex items-center gap-4 rounded-2xl p-4 transition-all ${
                  m.completed
                    ? 'bg-gradient-to-r from-eco-500/10 to-eco-500/5 ring-1 ring-eco-500/30'
                    : 'bg-slate-100/40 dark:bg-white/5'
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  m.completed ? 'bg-eco-500 text-white' : 'bg-slate-200/60 text-slate-500 dark:bg-white/10 dark:text-slate-300'
                }`}>
                  <Icon name={m.completed ? 'Check' : m.icon} className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold ${m.completed ? 'line-through opacity-60' : ''}`}>{m.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone="warning">+{m.xp} XP</Pill>
                  <button
                    onClick={() => handleToggle(m.id, m.completed)}
                    className={`h-10 w-10 rounded-full transition-all ${
                      m.completed
                        ? 'bg-eco-500 text-white shadow-glow'
                        : 'border-2 border-slate-300 text-slate-300 hover:border-eco-500 hover:text-eco-500 dark:border-slate-600 dark:text-slate-600'
                    }`}
                  >
                    <Icon name={m.completed ? 'Check' : 'Plus'} className="mx-auto h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white">
            <Icon name="Gift" className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Weekly Goal</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Complete all 5 missions for 3 consecutive days</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400">{d}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                i < 3 ? 'bg-gradient-to-br from-eco-500 to-ocean-500 text-white' : 'bg-slate-100/50 text-slate-300 dark:bg-white/5 dark:text-slate-600'
              }`}>
                <Icon name={i < 3 ? 'Check' : 'Circle'} className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
