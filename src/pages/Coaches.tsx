import { GlassCard, Icon, PageHeader, Pill, ProgressRing } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { coaches } from '../lib/mockData';

export default function Coaches() {
  const { state } = useEco();
  const mainCoach = coaches[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Your Eco Coaches"
        subtitle="Meet your motivational guides on the green journey"
        icon="Compass"
      />

      {/* Main coach spotlight */}
      <GlassCard className="overflow-hidden p-0" strong>
        <div className={`relative bg-gradient-to-br ${mainCoach.avatarColor} p-8 text-white`}>
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-wrap items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur text-5xl shadow-glow animate-float">
              🌿
            </div>
            <div className="flex-1 min-w-[200px]">
              <Pill tone="neutral" className="bg-white/20 text-white">{mainCoach.title}</Pill>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{mainCoach.name}</h2>
              <p className="mt-1 text-sm text-white/90">{mainCoach.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Icon name="Target" className="mr-1 inline h-3 w-3" />{mainCoach.specialty}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Icon name="Activity" className="mr-1 inline h-3 w-3" />{state.streak}-day streak tracked
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Weekly goal + motivation */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white">
              <Icon name="Flag" className="h-5 w-5" />
            </div>
            <p className="font-bold">Your Weekly Goal</p>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{mainCoach.weeklyGoal}</p>
          <div className="mt-4 flex items-center gap-3">
            <ProgressRing value={62} size={90} stroke={9} color="#10b981">
              <span className="text-lg font-extrabold">62%</span>
            </ProgressRing>
            <div>
              <p className="text-sm font-bold">On track</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">3 of 5 completed</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white">
              <Icon name="Heart" className="h-5 w-5" />
            </div>
            <p className="font-bold">Today's Motivation</p>
          </div>
          <p className="mt-4 text-sm italic text-slate-600 dark:text-slate-300">"{mainCoach.motivation}"</p>
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-eco-500/10 to-ocean-500/10 p-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quick win</p>
            <p className="text-sm font-medium">Take the stairs instead of the elevator today</p>
          </div>
        </GlassCard>
      </div>

      {/* Specialty coaches */}
      <div>
        <p className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">Your Coaching Team</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((c) => (
            <GlassCard key={c.id} className="p-5" hover>
              <div className="flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.avatarColor} text-2xl text-white shadow-soft`}>
                  {c.id === 'c1' ? '🌿' : c.id === 'c2' ? '⚡' : '🥗'}
                </div>
                <Pill tone="success">Active</Pill>
              </div>
              <p className="mt-3 font-bold">{c.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{c.title}</p>
              <div className="mt-2">
                <span className="rounded-full bg-slate-100/60 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  {c.specialty}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{c.message}</p>
              <button className="mt-4 w-full rounded-2xl bg-slate-100/60 py-2 text-xs font-bold text-slate-600 transition hover:bg-eco-500/15 hover:text-eco-600 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-eco-500/15 dark:hover:text-eco-400">
                <Icon name="MessageCircle" className="mr-1 inline h-3 w-3" />Message
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
