import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEco } from '../context/EcoContext';

const tooltipsStyle = {
  borderRadius: 12,
  border: '1px solid rgba(148,163,184,0.2)',
  fontSize: 12,
  padding: '8px 12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
};

export function AreaTrendChart({
  data,
  xKey,
  dataKeys,
  height = 200,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  dataKeys: { key: string; color: string; name?: string }[];
  height?: number;
}) {
  const { state } = useEco();
  const grid = state.theme === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.2)';
  const axis = state.theme === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <defs>
          {dataKeys.map((k) => (
            <linearGradient key={k.key} id={`area-${k.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={k.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={k.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: axis, fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: axis, fontSize: 11 }} width={36} />
        <Tooltip contentStyle={tooltipsStyle} cursor={{ stroke: grid, strokeWidth: 1 }} />
        {dataKeys.map((k) => (
          <Area
            key={k.key}
            type="monotone"
            dataKey={k.key}
            name={k.name ?? k.key}
            stroke={k.color}
            strokeWidth={2.5}
            fill={`url(#area-${k.key})`}
            animationDuration={900}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({
  data,
  xKey,
  dataKeys,
  height = 200,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  dataKeys: { key: string; color: string; name?: string }[];
  height?: number;
}) {
  const { state } = useEco();
  const grid = state.theme === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.2)';
  const axis = state.theme === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: axis, fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: axis, fontSize: 11 }} width={36} />
        <Tooltip contentStyle={tooltipsStyle} cursor={{ stroke: grid, strokeWidth: 1 }} />
        {dataKeys.map((k) => (
          <Line
            key={k.key}
            type="monotone"
            dataKey={k.key}
            name={k.name ?? k.key}
            stroke={k.color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: k.color }}
            activeDot={{ r: 5 }}
            animationDuration={900}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({
  data,
  height = 220,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          animationDuration={900}
          strokeWidth={0}
        >
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipsStyle} formatter={(v: number) => `${v} kg CO₂`} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MiniBarChart({
  data,
  xKey,
  yKey,
  color = '#10b981',
  height = 160,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
}) {
  const { state } = useEco();
  const axis = state.theme === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: axis, fontSize: 10 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: axis, fontSize: 10 }} width={28} />
        <Tooltip contentStyle={tooltipsStyle} cursor={{ fill: 'rgba(148,163,184,0.1)' }} formatter={(v: number) => `${v} kg`} />
        <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]} animationDuration={900} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RadialScore({ value, height = 220 }: { value: number; height?: number }) {
  const data = [{ name: 'score', value, fill: '#10b981' }];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart cx="50%" cy="55%" innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={90 - 360}>
        <defs>
          <linearGradient id="radial-score" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <RadialBar dataKey="value" cornerRadius={20} fill="url(#radial-score)" background={{ fill: 'rgba(148,163,184,0.15)' }} animationDuration={1200} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
