import type { EcoState } from './types';
import { getCategoryBreakdown, getDailyBreakdown, todayIso, sumCo2, calcEcoScore } from './calc';
import { DAILY_BASELINE } from './types';

interface Intent {
  keywords: string[];
  respond: (state: EcoState) => { text: string; tips?: string[] };
}

const KB: Intent[] = [
  {
    keywords: ['transport', 'car', 'commute', 'drive', 'bus', 'train', 'bike', 'cycle', 'fuel'],
    respond: (state) => {
      const today = state.activities.filter((a) => a.date === todayIso() && a.category === 'transport');
      const todayCo2 = sumCo2(today);
      const baseline = DAILY_BASELINE.transport;
      return {
        text: `Transport is usually the biggest slice of a carbon footprint. Today you emitted ${todayCo2.toFixed(1)} kg CO₂ from transport — the average person emits ~${baseline} kg/day.`,
        tips: [
          `Switching your longest car trip to the metro could save ~${(todayCo2 * 0.6).toFixed(1)} kg today.`,
          'One car-free day a week cuts your annual transport emissions by ~14%.',
          'Carpooling with 2 people cuts per-person emissions by two thirds.',
        ],
      };
    },
  },
  {
    keywords: ['electricity', 'power', 'energy', 'bulb', 'led', 'appliance', 'ac', 'fan'],
    respond: (state) => {
      const today = sumCo2(state.activities.filter((a) => a.date === todayIso() && a.category === 'electricity'));
      return {
        text: `Electricity makes up about 24% of daily emissions. You're at ${today.toFixed(1)} kg CO₂ today from grid power.`,
        tips: [
          'Swapping 5 incandescent bulbs for LEDs saves ~0.4 kg CO₂/day.',
          'Running your AC at 24°C instead of 20°C cuts its energy use by ~36%.',
          'Unplugging idle devices ("vampire load") can save up to 10% on your bill.',
        ],
      };
    },
  },
  {
    keywords: ['food', 'eat', 'meal', 'meat', 'beef', 'veg', 'vegetarian', 'vegan', 'dinner', 'lunch'],
    respond: (state) => {
      const week = getDailyBreakdown(state.activities, 7);
      const foodAvg = (week.reduce((s, d) => s + d.co2, 0) / 7 / 3).toFixed(1);
      return {
        text: `What you eat matters more than you'd think. Beef alone emits ~60 kg CO₂ per kg — 30x more than lentils. Your meals average around ${foodAvg} kg per meal this week.`,
        tips: [
          'One plant-based meal a week saves ~7 kg CO₂/month.',
          'Food waste accounts for 8% of global emissions — plan portions to shrink it.',
          'Local, seasonal produce has a smaller transport footprint.',
        ],
      };
    },
  },
  {
    keywords: ['water', 'shower', 'tap', 'bath'],
    respond: (state) => {
      const liters = state.activities
        .filter((a) => a.date === todayIso() && a.category === 'water')
        .reduce((s, a) => s + a.amount, 0);
      return {
        text: `You used an estimated ${liters} liters of water today. Heating water accounts for most of its carbon cost.`,
        tips: [
          'Cutting your shower from 10 to 5 minutes saves ~30 liters and the energy to heat it.',
          'Aerators on taps cut flow by 30% with no noticeable pressure loss.',
          'Cold-water laundry saves ~0.3 kg CO₂ per load.',
        ],
      };
    },
  },
  {
    keywords: ['reduce', 'tip', 'advice', 'suggest', 'help', 'improve', 'how'],
    respond: (state) => {
      const breakdown = getCategoryBreakdown(state.activities);
      const worst = breakdown.sort((a, b) => b.co2 - a.co2)[0];
      const score = calcEcoScore(state.activities);
      return {
        text: `Your Eco Score is ${score}/100. Your biggest emitter right now is ${worst.label.toLowerCase()} (${worst.co2.toFixed(1)} kg CO₂). Tackle that first for the biggest improvement.`,
        tips: [
          `Aim to lower ${worst.label} by 15% this week — that alone could bump your score by ~8 points.`,
          'Set a daily mission and complete it — each one adds XP to your garden.',
          'Log activities consistently; data makes patterns visible.',
        ],
      };
    },
  },
  {
    keywords: ['score', 'eco score', 'how am i', 'progress'],
    respond: (state) => {
      const score = calcEcoScore(state.activities);
      const grade = score >= 85 ? 'excellent' : score >= 65 ? 'on track' : 'room to grow';
      return {
        text: `Your Eco Score is ${score}/100 — ${grade}. It compares today's emissions against the daily average baseline. Lower emissions = higher score.`,
      };
    },
  },
  {
    keywords: ['goal', 'weekly', 'mission', 'challenge'],
    respond: (state) => {
      const done = state.missions.filter((m) => m.completed).length;
      const xp = state.gardenXp;
      return {
        text: `You've completed ${done}/${state.missions.length} missions and earned ${xp} garden XP. Your weekly goal: cut total emissions by 10% vs last week.`,
        tips: [
          'Each completed mission grows your garden and may unlock a new badge.',
          'Aim for a 7-day mission streak to earn the Flamer badge.',
        ],
      };
    },
  },
  {
    keywords: ['tree', 'plant', 'offset', 'forest'],
    respond: (state) => ({
      text: `A mature tree absorbs ~21 kg of CO₂ per year — about 0.06 kg/day. You've planted ${state.profile.treesPlanted} trees, offsetting ~${(state.profile.treesPlanted * 21).toFixed(0)} kg CO₂ annually.`,
      tips: [
        'Native species sequester carbon and support local biodiversity.',
        'Even a balcony sapling counts — every gram matters.',
      ],
    }),
  },
  {
    keywords: ['money', 'save', 'cost', 'bill', 'rupee', 'savings'],
    respond: () => ({
      text: 'Sustainability often pays for itself. Here\'s the money angle:',
      tips: [
        'LEDs pay back in ~6 months and save ₹400-800/year per bulb.',
        'A 24°C AC setting saves ~₹2,000/month in summer bills.',
        'Public transit can save ₹4,000-8,000/month vs petrol commuting.',
      ],
    }),
  },
];

const fallback: Intent = {
  keywords: [],
  respond: (state) => ({
    text: `Hi ${state.profile.name.split(' ')[0]}! I'm Gaia, your AI Eco Coach. Ask me about transport, electricity, food, water, your eco score, missions, or how to reduce your footprint. I tailor every answer to your activity data.`,
    tips: [
      'Try: "How can I lower my transport emissions?"',
      'Try: "What\'s my eco score?"',
      'Try: "Give me a daily tip"',
    ],
  }),
};

const DAILY_TIPS = [
  'Carry a refillable bottle today — skip 2 single-use plastics.',
  'Set your AC to 24°C — the sweet spot for comfort and savings.',
  'Take a 5-minute shower challenge today.',
  'Swap one car trip for walking, cycling, or transit.',
  'Eat one fully plant-based meal today.',
  'Unplug devices you aren\'t actively using.',
  'Run your washing machine only on full loads, cold cycle.',
  'Choose local, seasonal produce for one meal today.',
  'Air-dry your laundry instead of using the dryer.',
  'Brew coffee at home — skip the takeaway cup.',
];

export function getCoachResponse(input: string, state: EcoState): { text: string; tips?: string[] } {
  const lower = input.toLowerCase();
  if (lower.includes('daily tip') || lower.includes('tip of the day') || lower === 'tip') {
    const tip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];
    return {
      text: `Here's your daily eco tip, ${state.profile.name.split(' ')[0]}:`,
      tips: [tip + ' Small steps compound — you\'ve already saved ' + Math.round(state.totalCarbonSaved) + ' kg CO₂ overall.'],
    };
  }
  for (const intent of KB) {
    if (intent.keywords.some((k) => lower.includes(k))) return intent.respond(state);
  }
  return fallback.respond(state);
}
