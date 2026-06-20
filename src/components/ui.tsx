import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import * as Lucide from 'lucide-react';

export function Icon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const C = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[name] ?? Lucide.Circle;
  return <C className={className} style={style} />;
}
export function GlassCard({
  children,
  className = '',
  strong = false,
  hover = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`${strong ? 'glass-strong' : 'glass'} rounded-3xl ${
        hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glow' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-400 to-ocean-500 text-white shadow-glow">
            <Icon name={icon} className="h-6 w-6" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const from = display;
    const to = value;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  stroke = 10,
  color = '#10b981',
  children,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
}) {
  const [animated, setAnimated] = useState(0);
  const rafRef = useRef<number>(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, value / max);

  useEffect(() => {
    const start = performance.now();
    const from = animated;
    const to = pct;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1000);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, max]);

  const offset = circumference * (1 - animated);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200/60 dark:text-slate-700/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-${color})`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

export function Badge({ tier }: { tier: 'bronze' | 'silver' | 'gold' | 'platinum' }) {
  const styles = {
    bronze: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    silver: 'bg-slate-100 text-slate-600 dark:bg-slate-400/15 dark:text-slate-300',
    gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400',
    platinum: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[tier]}`}>
      {tier}
    </span>
  );
}

export function Pill({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300',
    success: 'bg-eco-100 text-eco-700 dark:bg-eco-500/15 dark:text-eco-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    error: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function GradientOrbs() {
  return (
    <>
      <div className="pointer-events-none fixed -left-32 top-20 h-72 w-72 rounded-full bg-eco-400/20 blur-3xl dark:bg-eco-500/10" />
      <div className="pointer-events-none fixed -right-32 top-1/3 h-80 w-80 rounded-full bg-ocean-400/20 blur-3xl dark:bg-ocean-500/10" />
      <div className="pointer-events-none fixed bottom-0 left-1/3 h-64 w-64 rounded-full bg-eco-300/15 blur-3xl dark:bg-eco-400/5" />
    </>
  );
}

export function EmptyState({ icon = 'Leaf', title, description }: { icon?: string; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 dark:from-slate-800 dark:to-slate-700">
        <Icon name={icon} className="h-8 w-8" />
      </div>
      <p className="mt-4 font-semibold">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xs">{description}</p>}
    </div>
  );
}

export function Sparkline({ data, color = '#10b981' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-full">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
