import { useEffect, useRef, useState } from 'react';
import { GlassCard, Icon, PageHeader, Pill } from '../components/ui';
import { useEco } from '../context/EcoContext';
import { getCoachResponse } from '../lib/ecoCoach';
import { calcEcoScore } from '../lib/calc';
import type { ChatMessage } from '../lib/types';

const SUGGESTIONS = [
  'How can I reduce my transport emissions?',
  "What's my eco score?",
  'Give me a daily tip',
  'How much have I saved?',
  'Weekly goals?',
];

export default function EcoCoach() {
  const { state, dispatch } = useEco();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = state.chatHistory;

  useEffect(() => {
    if (messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'welcome',
        role: 'coach',
        text: `Hi ${state.profile.name.split(' ')[0]}! I'm Gaia, your AI Eco Coach. I analyze your activity data and give personalized sustainability advice. Ask me anything about your footprint, or try a suggestion below.`,
        ts: Date.now(),
      };
      dispatch({ type: 'ADD_CHAT', message: welcome });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, ts: Date.now() };
    dispatch({ type: 'ADD_CHAT', message: userMsg });
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const res = getCoachResponse(text, state);
      const coachMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        role: 'coach',
        text: res.text,
        ts: Date.now(),
      };
      dispatch({ type: 'ADD_CHAT', message: coachMsg });
      if (res.tips) {
        setTimeout(() => {
          const tipsMsg: ChatMessage = {
            id: `t-${Date.now()}`,
            role: 'coach',
            text: '💡 ' + res.tips!.join('\n\n💡 '),
            ts: Date.now(),
          };
          dispatch({ type: 'ADD_CHAT', message: tipsMsg });
          setTyping(false);
        }, 700);
      } else {
        setTyping(false);
      }
    }, 900);
  };

  const score = calcEcoScore(state.activities);
  const goal = state.missions.filter((m) => m.completed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Eco Coach"
        subtitle="Personalized sustainability guidance, powered by your activity data"
        icon="Sparkles"
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Coach profile + suggestions sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-5 text-center" strong>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-eco-400 to-teal-600 text-3xl shadow-glow animate-float">
              🌿
            </div>
            <p className="mt-3 font-bold text-lg">Gaia</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your Eco Coach</p>
            <div className="mt-3 flex justify-center gap-2">
              <Pill tone="success">Score {score}</Pill>
              <Pill tone="info">{goal} missions</Pill>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Try asking</p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="flex w-full items-center justify-between rounded-2xl bg-slate-100/50 px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-eco-500/10 hover:text-eco-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-eco-500/15"
                >
                  <span>{s}</span>
                  <Icon name="ArrowRight" className="h-3 w-3 opacity-50" />
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat window */}
        <GlassCard className="lg:col-span-3 flex h-[600px] flex-col p-0 overflow-hidden" strong>
          <div className="flex items-center justify-between border-b border-slate-200/40 px-5 py-3 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-eco-400 to-teal-600 text-sm">🌿</div>
              <div>
                <p className="text-sm font-bold">Gaia · Online</p>
                <p className="text-[10px] text-eco-500">Analyzing your data in real time</p>
              </div>
            </div>
            {messages.length > 1 && (
              <button
                onClick={() => dispatch({ type: 'CLEAR_CHAT' })}
                className="text-xs text-slate-400 hover:text-rose-500"
              >
                Clear
              </button>
            )}
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-scale`}>
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-eco-500 to-ocean-500 text-white rounded-br-md'
                      : 'bg-slate-100/70 dark:bg-white/5 rounded-bl-md whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-1 rounded-3xl bg-slate-100/70 px-4 py-3 dark:bg-white/5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200/40 p-3 dark:border-white/5">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Ask Gaia anything..."
                className="flex-1 rounded-full border border-slate-200/50 bg-white/50 px-4 py-2.5 text-sm outline-none transition focus:border-eco-500 focus:ring-4 focus:ring-eco-500/10 dark:border-white/10 dark:bg-white/5"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-eco-500 to-ocean-500 text-white shadow-glow transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <Icon name="Send" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
