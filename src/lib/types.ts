// Core domain types for EcoTrack AI

export type Theme = 'light' | 'dark';

export type ActivityCategory = 'transport' | 'electricity' | 'food' | 'water';

export interface ActivityEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  category: ActivityCategory;
  subtype: string;
  amount: number; // raw units (km, kWh, kcal, liters)
  co2: number; // kg CO2
  label: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  goal: number;
  progress: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earned: boolean;
  date?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  city: string;
  state: string;
  area: string;
  college: string;
  avatarColor: string;
  treesPlanted: number;
  joinedDate: string;
  trustScore: number;
}

export interface GardenStage {
  level: number;
  name: string;
  minCarbonSaved: number;
  emoji: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  area: string;
  city: string;
  co2Saved: number;
  trees: number;
  isYou?: boolean;
}

export interface EcoSession {
  id: string;
  title: string;
  speaker: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
  attendees: number;
}

export interface Coach {
  id: string;
  name: string;
  title: string;
  avatarColor: string;
  specialty: string;
  message: string;
  weeklyGoal: string;
  motivation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  text: string;
  ts: number;
}

export interface EcoState {
  theme: Theme;
  profile: UserProfile;
  activities: ActivityEntry[];
  missions: Mission[];
  badges: Badge[];
  chatHistory: ChatMessage[];
  streak: number;
  totalCarbonSaved: number;
  gardenXp: number;
  lastMissionDate: string;
}

// Carbon emission factors (kg CO2 per unit)
export const FACTORS = {
  transport: {
    car_petrol: 0.171, // kg/km
    car_diesel: 0.153,
    car_electric: 0.053,
    bus: 0.089,
    train: 0.041,
    bike: 0,
    walk: 0,
    flight: 0.255,
  },
  electricity: {
    grid: 0.385, // kg/kWh (global avg)
    solar: 0,
    wind: 0,
  },
  food: {
    beef: 0.06, // kg/kcal... we'll use per meal
    pork: 0.012,
    chicken: 0.006,
    fish: 0.004,
    vegetarian: 0.0017,
    vegan: 0.0009,
  },
  water: 0.0003, // kg CO2 per liter (treatment + heating)
} as const;

// Savings reference (avg person baseline kg CO2/day by category)
export const DAILY_BASELINE = {
  transport: 8.2,
  electricity: 4.6,
  food: 5.3,
  water: 0.9,
  total: 19.0,
};

export const KG_CO2_PER_TREE_YEAR = 21; // a mature tree absorbs ~21kg CO2/yr
export const KG_CO2_PER_TREE_DAY = KG_CO2_PER_TREE_YEAR / 365;
