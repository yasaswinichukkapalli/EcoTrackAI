import { useState } from 'react';
import { GlassCard, Icon, PageHeader, Pill } from '../components/ui';
import { ecoSessions, topPerformers } from '../lib/mockData';

const TOPIC_COLORS: Record<string, string> = {
  Waste: 'from-amber-400 to-orange-500',
  Energy: 'from-yellow-400 to-amber-500',
  Food: 'from-rose-400 to-pink-500',
  Transport: 'from-blue-400 to-cyan-500',
};

export default function Sessions() {
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [applauded, setApplauded] = useState<Set<string>>(new Set());

  const toggleReg = (id: string) => {
    setRegistered((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const applaud = (name: string) => {
    setApplauded((prev) => new Set(prev).add(name));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Live Eco Sessions"
        subtitle="Attend expert workshops and celebrate top performers"
        icon="Video"
        action={<Pill tone="info"><Icon name="Calendar" className="h-3 w-3" />{registered.size} registered</Pill>}
      />

      {/* Top performers applause cards */}
      <div>
        <p className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">🏆 Top Performers</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topPerformers.map((p) => {
            const isApplauded = applauded.has(p.name);
            return (
              <GlassCard key={p.name} className="p-5 text-center relative overflow-hidden" hover>
                {isApplauded && (
                  <div className="pointer-events-none absolute inset-0">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute top-2 text-lg animate-confetti-fall"
                        style={{ left: `${20 + i * 12}%`, animationDelay: `${i * 0.1}s` }}
                      >
                        👏
                      </span>
                    ))}
                  </div>
                )}
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${p.avatarColor} text-white text-lg font-bold ring-4 ring-white/60 dark:ring-white/10`}>
                  {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <p className="mt-3 font-bold text-sm">{p.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.achievement}</p>
                <button
                  onClick={() => applaud(p.name)}
                  className={`mt-3 w-full rounded-2xl py-2 text-xs font-bold transition ${
                    isApplauded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gradient-to-r from-amber-400 to-rose-500 text-white hover:scale-[1.02]'
                  }`}
                >
                  {isApplauded ? '👏 Applauded' : 'Applaud'}
                </button>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Upcoming sessions */}
      <div>
        <p className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">📅 Upcoming Sessions</p>
        <div className="space-y-3">
          {ecoSessions.map((s) => {
            const isReg = registered.has(s.id);
            return (
              <GlassCard key={s.id} className="p-5" hover>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${TOPIC_COLORS[s.topic] ?? 'from-eco-400 to-ocean-500'} text-white`}>
                    <span className="text-[10px] font-bold uppercase">{s.date.split(' ')[0]}</span>
                    <span className="text-xl font-extrabold leading-none">{s.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Pill tone="info">{s.topic}</Pill>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{s.duration}</span>
                    </div>
                    <p className="mt-1 font-bold">{s.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <Icon name="User" className="mr-1 inline h-3 w-3" />{s.speaker} · {s.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Icon name="Users" className="h-3 w-3" />
                      {s.attendees.toLocaleString()}
                    </div>
                    <button
                      onClick={() => toggleReg(s.id)}
                      className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                        isReg
                          ? 'bg-eco-500/15 text-eco-600 dark:text-eco-400 ring-1 ring-eco-500/30'
                          : 'bg-gradient-to-r from-eco-500 to-ocean-500 text-white shadow-glow hover:scale-105'
                      }`}
                    >
                      {isReg ? 'Registered' : 'Register'}
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Live now banner */}
      <GlassCard className="p-6" strong>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white">
              <Icon name="Radio" className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="h-3 w-3 rounded-full bg-rose-500" />
              </span>
            </div>
            <div>
              <p className="font-bold">Live Now: Q&A with a Climate Scientist</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dr. Pooja Bhat · 842 viewers watching</p>
            </div>
          </div>
          <button className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] transition hover:scale-105">
            Join live
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
