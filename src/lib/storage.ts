import type { ActivityEntry, EcoState, UserProfile, Mission, Badge } from './types';

const STORAGE_KEY = 'ecotrack-ai-state-v1';

const defaultProfile: UserProfile = {
  name: 'Aria Chen',
  email: 'aria@ecotrack.ai',
  city: 'Bengaluru',
  state: 'Karnataka',
  area: 'Indiranagar',
  college: 'IISc',
  avatarColor: 'from-emerald-400 to-blue-500',
  treesPlanted: 14,
  joinedDate: '2024-08-12',
  trustScore: 92,
};

const today = new Date();
const isoDaysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Generate 30 days of historical activity for analytics
function generateSeedHistory(): ActivityEntry[] {
  const rand = seededRandom(42);
  const entries: ActivityEntry[] = [];
  const transportSubs = ['car_petrol', 'bus', 'train', 'bike'];
  const foodSubs = ['chicken', 'vegetarian', 'fish', 'vegan'];

  for (let i = 0; i < 30; i++) {
    const date = isoDaysAgo(i);
    // transport
    const tk = transportSubs[Math.floor(rand() * transportSubs.length)];
    const tDist = Math.round((rand() * 35 + 5));
    const tFactor =
      tk === 'car_petrol' ? 0.171 : tk === 'bus' ? 0.089 : tk === 'train' ? 0.041 : 0;
    entries.push({
      id: `a-t-${i}`,
      date,
      category: 'transport',
      subtype: tk,
      amount: tDist,
      co2: +(tDist * tFactor).toFixed(2),
      label: txLabel(tk),
    });
    // electricity
    const kwh = Math.round(rand() * 8 + 4);
    entries.push({
      id: `a-e-${i}`,
      date,
      category: 'electricity',
      subtype: 'grid',
      amount: kwh,
      co2: +(kwh * 0.385).toFixed(2),
      label: 'Grid electricity',
    });
    // food
    const fk = foodSubs[Math.floor(rand() * foodSubs.length)];
    const kcal = Math.round(rand() * 600 + 1200);
    const fFactor = fk === 'chicken' ? 0.006 : fk === 'vegetarian' ? 0.0017 : fk === 'fish' ? 0.004 : 0.0009;
    entries.push({
      id: `a-f-${i}`,
      date,
      category: 'food',
      subtype: fk,
      amount: kcal,
      co2: +(kcal * fFactor).toFixed(2),
      label: foodLabel(fk),
    });
    // water
    const liters = Math.round(rand() * 180 + 80);
    entries.push({
      id: `a-w-${i}`,
      date,
      category: 'water',
      subtype: 'tap',
      amount: liters,
      co2: +(liters * 0.0003).toFixed(2),
      label: 'Household water',
    });
  }
  return entries;
}

function txLabel(k: string): string {
  return {
    car_petrol: 'Car (petrol)',
    car_diesel: 'Car (diesel)',
    car_electric: 'EV',
    bus: 'Bus',
    train: 'Train',
    bike: 'Motorcycle',
    walk: 'Walking',
    flight: 'Flight',
  }[k] ?? k;
}
function foodLabel(k: string): string {
  return {
    beef: 'Beef meal',
    pork: 'Pork meal',
    chicken: 'Chicken meal',
    fish: 'Fish meal',
    vegetarian: 'Vegetarian meal',
    vegan: 'Vegan meal',
  }[k] ?? k;
}

const defaultMissions: Mission[] = [
  {
    id: 'm1',
    title: 'Ditch the car',
    description: 'Use public transit or bike for your commute today.',
    icon: 'Bus',
    xp: 120,
    goal: 1,
    progress: 1,
    completed: false,
  },
  {
    id: 'm2',
    title: 'Lights out',
    description: 'Turn off all unused lights and appliances for 2 hours.',
    icon: 'Lightbulb',
    xp: 80,
    goal: 1,
    progress: 0,
    completed: false,
  },
  {
    id: 'm3',
    title: 'Plant-powered',
    description: 'Eat at least one fully plant-based meal today.',
    icon: 'Salad',
    xp: 100,
    goal: 1,
    progress: 0,
    completed: false,
  },
  {
    id: 'm4',
    title: 'Shorter showers',
    description: 'Keep your shower under 5 minutes.',
    icon: 'Droplets',
    xp: 60,
    goal: 1,
    progress: 0,
    completed: false,
  },
  {
    id: 'm5',
    title: 'Bring your bottle',
    description: 'Use a refillable water bottle all day.',
    icon: 'CupSoda',
    xp: 50,
    goal: 1,
    progress: 0,
    completed: false,
  },
];

const defaultBadges: Badge[] = [
  { id: 'b1', name: 'Green Hero', description: 'Saved 10 kg CO₂ in a single day', icon: 'Leaf', tier: 'gold', earned: true, date: '2024-09-02' },
  { id: 'b2', name: 'Eco Warrior', description: 'Completed 20 eco missions', icon: 'Swords', tier: 'platinum', earned: true, date: '2024-09-15' },
  { id: 'b3', name: 'Monthly Champion', description: 'Ranked #1 in your area for a month', icon: 'Trophy', tier: 'platinum', earned: false },
  { id: 'b4', name: '7-Day Streak', description: 'Completed missions 7 days straight', icon: 'Flame', tier: 'gold', earned: true, date: '2024-10-01' },
  { id: 'b5', name: 'Tree Hugger', description: 'Planted 10 trees', icon: 'TreePine', tier: 'gold', earned: true, date: '2024-09-20' },
  { id: 'b6', name: 'Water Saver', description: 'Cut water use by 30%', icon: 'Droplets', tier: 'silver', earned: true, date: '2024-10-10' },
  { id: 'b7', name: 'Solar Pioneer', description: 'Logged solar electricity use', icon: 'Sun', tier: 'silver', earned: false },
  { id: 'b8', name: 'Carnivore Conscience', description: '3 plant-based meals in a day', icon: 'Carrot', tier: 'bronze', earned: true, date: '2024-08-29' },
];

function computeSaved(history: ActivityEntry[]): number {
  const baselineTotal = 19.0;
  const days = new Set(history.map((h) => h.date)).size || 1;
  const emitted = history.reduce((s, h) => s + h.co2, 0);
  return Math.max(0, baselineTotal * days - emitted);
}

export function createInitialState(): EcoState {
  const history = generateSeedHistory();
  const saved = computeSaved(history);
  return {
    theme: 'light',
    profile: defaultProfile,
    activities: history,
    missions: defaultMissions,
    badges: defaultBadges,
    chatHistory: [],
    streak: 7,
    totalCarbonSaved: saved,
    gardenXp: Math.floor(saved * 4),
    lastMissionDate: isoDaysAgo(0),
  };
}

export function loadState(): EcoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return { ...createInitialState(), ...parsed };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: EcoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full / unavailable — non-fatal
  }
}
