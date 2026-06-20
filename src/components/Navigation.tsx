import { useState } from 'react';
import { useEco } from '../context/EcoContext';
import { NAV_ITEMS } from '../lib/nav';
import { Icon } from './ui';

export type PageId = string;

export function Sidebar({ page, setPage }: { page: PageId; setPage: (p: PageId) => void }) {
  const { state } = useEco();
  const groups: { key: string; label: string }[] = [
    { key: 'main', label: 'Personal' },
    { key: 'learn', label: 'Community' },
    { key: 'impact', label: 'Impact' },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-72 flex-col p-4">
      <div className="glass-strong flex h-full flex-col rounded-4xl p-5">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white shadow-glow">
            <Icon name="Leaf" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight gradient-text">EcoTrack AI</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Sustain. Together.</p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-5 overflow-y-auto no-scrollbar pr-1">
          {groups.map((g) => (
            <div key={g.key}>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{g.label}</p>
              <div className="space-y-1">
                {NAV_ITEMS.filter((n) => n.group === g.key).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPage(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      page === item.id
                        ? 'nav-pill-active shadow-soft'
                        : 'text-slate-500 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-eco-500/10 to-ocean-500/10 p-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${state.profile.avatarColor} text-sm font-bold text-white`}>
            {state.profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{state.profile.name}</p>
            <p className="truncate text-xs text-slate-400">{state.profile.area} · {state.profile.city}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav({ page, setPage }: { page: PageId; setPage: (p: PageId) => void }) {
  const [open, setOpen] = useState(false);
  const main = NAV_ITEMS.filter((n) => n.group === 'main');

  const handleSet = (p: PageId) => {
    setPage(p);
    setOpen(false);
  };

  return (
    <>
      {/* Bottom bar with primary actions */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-2">
        <div className="glass-strong flex items-center justify-around rounded-4xl px-2 py-2 shadow-glass-dark">
          {main.slice(0, 3).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSet(item.id)}
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition-all ${
                page === item.id ? 'nav-pill-active' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              <span className="text-[9px] font-semibold">{item.label.split(' ')[0]}</span>
            </button>
          ))}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-slate-500 dark:text-slate-400"
          >
            <div className="flex h-5 w-5 items-center justify-center">
              <Icon name="LayoutGrid" className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-semibold">More</span>
          </button>
          <button
            onClick={() => handleSet('profile')}
            className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition-all ${
              page === 'profile' ? 'nav-pill-active' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Icon name="User" className="h-5 w-5" />
            <span className="text-[9px] font-semibold">Profile</span>
          </button>
        </div>
      </nav>

      {/* Full-screen menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in flex-col bg-white/70 backdrop-blur-xl dark:bg-slate-950/80">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white">
                <Icon name="Leaf" className="h-5 w-5" />
              </div>
              <p className="text-lg font-extrabold gradient-text">EcoTrack AI</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-500">
              <Icon name="X" className="h-6 w-6" />
            </button>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-5 pb-10 sm:grid-cols-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSet(item.id)}
                className={`glass flex flex-col items-start gap-2 rounded-3xl p-4 text-left transition-all hover:scale-[1.02] ${
                  page === item.id ? 'ring-2 ring-eco-500' : ''
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400/20 to-ocean-500/20 text-eco-600 dark:text-eco-400">
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function TopBar({ page, setPage }: { page: PageId; setPage: (p: PageId) => void }) {
  const { state, dispatch } = useEco();
  const current = NAV_ITEMS.find((n) => n.id === page);
  return (
    <header className="sticky top-0 z-20 px-3 pt-3 lg:pl-2">
      <div className="glass-strong flex items-center justify-between rounded-4xl px-4 py-2.5 lg:px-5">
        <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white">
            <Icon name="Leaf" className="h-4 w-4" />
          </div>
        </button>
        <div className="hidden lg:block">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {current?.group === 'impact' ? 'Global Impact' : current?.group === 'learn' ? 'Community' : 'Personal'}
          </p>
          <p className="text-sm font-bold">{current?.label ?? 'Dashboard'}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full bg-eco-500/10 px-3 py-1.5 text-xs font-bold text-eco-600 dark:text-eco-400 sm:flex">
            <Icon name="Flame" className="h-3.5 w-3.5" />
            {state.streak} day streak
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/60 text-slate-600 transition-all hover:scale-105 dark:bg-white/5 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            <Icon name={state.theme === 'dark' ? 'Sun' : 'Moon'} className="h-5 w-5" />
          </button>
          <button
            onClick={() => setPage('profile')}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${state.profile.avatarColor} text-sm font-bold text-white shadow-soft`}
          >
            {state.profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </button>
        </div>
      </div>
    </header>
  );
}
