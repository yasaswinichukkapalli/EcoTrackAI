import { AnimatedNumber, GlassCard, Icon, PageHeader, Pill, ProgressRing } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { GARDEN_STAGES } from '../lib/mockData';

export default function Garden() {
  const { state, dispatch } = useEco();
  const xp = state.gardenXp;
  const saved = state.totalCarbonSaved;

  const currentStage = [...GARDEN_STAGES].reverse().find((s) => saved >= s.minCarbonSaved) ?? GARDEN_STAGES[0];
  const nextStage = GARDEN_STAGES.find((s) => s.level > currentStage.level);
  const stageProgress = nextStage
    ? ((saved - currentStage.minCarbonSaved) / (nextStage.minCarbonSaved - currentStage.minCarbonSaved)) * 100
    : 100;

  const plants = Math.min(12, Math.floor(saved / 8) + 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Virtual Green Garden"
        subtitle="Watch your garden flourish as your carbon savings grow"
        icon="Trees"
        action={<Pill tone="success"><Icon name="Sparkles" className="h-3 w-3" />{xp} XP</Pill>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Garden visualization */}
        <GlassCard className="lg:col-span-2 overflow-hidden" strong>
          <div className="relative h-80 sm:h-96 bg-gradient-to-b from-sky-200/40 via-sky-100/20 to-eco-200/30 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-eco-900/30">
            {/* Sun */}
            <div className="absolute right-8 top-6 h-16 w-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.6)] animate-pulse-glow" />
            {/* Clouds */}
            <div className="absolute left-6 top-10 flex gap-1 opacity-60 animate-float">
              <div className="h-3 w-12 rounded-full bg-white/80 dark:bg-white/20" />
            </div>
            <div className="absolute left-1/3 top-5 flex gap-1 opacity-40 animate-float" style={{ animationDelay: '1s' }}>
              <div className="h-2.5 w-16 rounded-full bg-white/70 dark:bg-white/15" />
            </div>

            {/* Garden bed */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-eco-600/30 to-eco-800/40 dark:from-eco-900/60 dark:to-eco-950/60" />

            {/* Plants */}
            <div className="absolute inset-x-0 bottom-16 flex justify-around items-end px-4">
              {Array.from({ length: plants }).map((_, i) => {
                const stage = i < 2 ? 'tree' : i < 5 ? 'bush' : 'flower';
                const sway = i % 2 === 0;
                return (
                  <div key={i} className={`relative origin-bottom ${sway ? 'animate-sway' : ''}`} style={{ animationDelay: `${i * 0.3}s` }}>
                    {stage === 'tree' && (
                      <div className="flex flex-col items-center">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-eco-400 to-eco-600 shadow-glow" />
                        <div className="h-8 w-2.5 rounded-b bg-amber-700/70" />
                      </div>
                    )}
                    {stage === 'bush' && (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-0.5">
                          <div className="h-8 w-7 rounded-full bg-gradient-to-br from-eco-400 to-eco-500" />
                          <div className="h-7 w-6 rounded-full bg-gradient-to-br from-eco-500 to-eco-600" />
                        </div>
                        <div className="h-4 w-1.5 bg-amber-700/70" />
                      </div>
                    )}
                    {stage === 'flower' && (
                      <div className="flex flex-col items-center">
                        <div className="relative h-6 w-6">
                          <div className="absolute inset-0 rounded-t-full bg-rose-400" style={{ clipPath: 'ellipse(50% 50% at 50% 100%)' }} />
                          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400" />
                        </div>
                        <div className="h-6 w-1 bg-eco-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stage badge */}
            <div className="absolute left-4 top-4 glass-strong rounded-2xl px-4 py-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Current Stage</p>
              <p className="font-bold">{currentStage.emoji} {currentStage.name}</p>
            </div>
          </div>

          {/* Stage progression */}
          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{currentStage.name}</span>
              <span>{nextStage ? `${nextStage.name} at ${nextStage.minCarbonSaved} kg` : 'Master gardener!'}</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200/50 dark:bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-eco-400 to-ocean-500 transition-all duration-1000"
                style={{ width: `${stageProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {nextStage ? `${(nextStage.minCarbonSaved - saved).toFixed(1)} kg more to reach ${nextStage.name}` : 'You\'ve reached the final stage — incredible!'}
            </p>
          </div>
        </GlassCard>

        {/* Stage tree + plant action */}
        <div className="space-y-4">
          <GlassCard className="p-6 text-center" strong>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Garden Level</p>
            <div className="my-3">
              <ProgressRing value={stageProgress} size={130} stroke={11} color="#10b981">
                <div>
                  <p className="text-3xl">{currentStage.emoji}</p>
                  <p className="mt-1 text-xs font-bold">Level {currentStage.level}</p>
                </div>
              </ProgressRing>
            </div>
            <p className="font-bold">{currentStage.name}</p>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-eco-600 text-white">
                <Icon name="Leaf" className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold"><AnimatedNumber value={saved} decimals={1} suffix=" kg" /></p>
                <p className="text-xs text-slate-500 dark:text-slate-400">CO₂ saved total</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                <Icon name="TreePine" className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xl font-extrabold"><AnimatedNumber value={state.profile.treesPlanted} /></p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trees planted</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'PLANT_TREE' })}
                className="rounded-full bg-gradient-to-br from-eco-500 to-ocean-500 px-4 py-2 text-xs font-bold text-white shadow-glow transition hover:scale-105"
              >
                <Icon name="Plus" className="mr-1 inline h-3 w-3" />Plant
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* All stages */}
      <GlassCard className="p-6">
        <p className="mb-3 font-semibold">Growth Journey</p>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
          {GARDEN_STAGES.map((s) => (
            <div key={s.level} className={`rounded-2xl p-3 text-center transition ${
              s.level === currentStage.level
                ? 'bg-gradient-to-br from-eco-500/15 to-ocean-500/15 ring-2 ring-eco-500/40'
                : s.level < currentStage.level
                ? 'bg-eco-500/5'
                : 'bg-slate-100/40 opacity-50 dark:bg-white/5'
            }`}>
              <p className="text-2xl">{s.emoji}</p>
              <p className="mt-1 text-[10px] font-bold">{s.name}</p>
              <p className="text-[9px] text-slate-400">{s.minCarbonSaved}kg</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
