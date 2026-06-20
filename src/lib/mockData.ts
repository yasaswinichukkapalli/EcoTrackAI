import type { LeaderboardEntry, EcoSession, Coach, GardenStage } from './types';

export const GARDEN_STAGES: GardenStage[] = [
  { level: 0, name: 'Seed', minCarbonSaved: 0, emoji: '🌱' },
  { level: 1, name: 'Sprout', minCarbonSaved: 10, emoji: '🌿' },
  { level: 2, name: 'Sapling', minCarbonSaved: 30, emoji: '🪴' },
  { level: 3, name: 'Young Tree', minCarbonSaved: 60, emoji: '🌳' },
  { level: 4, name: 'Bloom', minCarbonSaved: 100, emoji: '🌸' },
  { level: 5, name: 'Forest', minCarbonSaved: 150, emoji: '🌲' },
  { level: 6, name: 'Eden', minCarbonSaved: 220, emoji: '🏞️' },
];

export const areaLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Kavya R.', area: 'Koramangala', city: 'Bengaluru', co2Saved: 84.2, trees: 22 },
  { rank: 2, name: 'Aria Chen', area: 'Indiranagar', city: 'Bengaluru', co2Saved: 76.5, trees: 14, isYou: true },
  { rank: 3, name: 'Dev P.', area: 'Whitefield', city: 'Bengaluru', co2Saved: 71.3, trees: 18 },
  { rank: 4, name: 'Meera S.', area: 'Jayanagar', city: 'Bengaluru', co2Saved: 68.0, trees: 11 },
  { rank: 5, name: 'Rahul K.', area: 'HSR Layout', city: 'Bengaluru', co2Saved: 64.8, trees: 9 },
  { rank: 6, name: 'Ishita M.', area: 'Malleshwaram', city: 'Bengaluru', co2Saved: 61.2, trees: 13 },
  { rank: 7, name: 'Vikram N.', area: 'BTM Layout', city: 'Bengaluru', co2Saved: 58.9, trees: 7 },
  { rank: 8, name: 'Sara T.', area: 'Hebbal', city: 'Bengaluru', co2Saved: 55.4, trees: 10 },
];

export const cityLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Bengaluru', area: '', city: '', co2Saved: 18420, trees: 2840 },
  { rank: 2, name: 'Mumbai', area: '', city: '', co2Saved: 16750, trees: 2610 },
  { rank: 3, name: 'Delhi', area: '', city: '', co2Saved: 15200, trees: 2390 },
  { rank: 4, name: 'Pune', area: '', city: '', co2Saved: 13100, trees: 1980 },
  { rank: 5, name: 'Hyderabad', area: '', city: '', co2Saved: 11980, trees: 1760 },
  { rank: 6, name: 'Chennai', area: '', city: '', co2Saved: 10420, trees: 1540 },
  { rank: 7, name: 'Kolkata', area: '', city: '', co2Saved: 9680, trees: 1320 },
];

export const stateLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Karnataka', area: '', city: '', co2Saved: 42100, trees: 6240 },
  { rank: 2, name: 'Maharashtra', area: '', city: '', co2Saved: 38600, trees: 5780 },
  { rank: 3, name: 'Tamil Nadu', area: '', city: '', co2Saved: 32400, trees: 4980 },
  { rank: 4, name: 'Delhi NCR', area: '', city: '', co2Saved: 26800, trees: 3850 },
  { rank: 5, name: 'Telangana', area: '', city: '', co2Saved: 23100, trees: 3320 },
  { rank: 6, name: 'Gujarat', area: '', city: '', co2Saved: 19800, trees: 2890 },
  { rank: 7, name: 'West Bengal', area: '', city: '', co2Saved: 17200, trees: 2540 },
];

export const monthlyChampions: LeaderboardEntry[] = [
  { rank: 1, name: 'Ananya G.', area: 'Pune', city: 'Pune', co2Saved: 142.8, trees: 31 },
  { rank: 2, name: 'Rohan V.', area: 'Bandra', city: 'Mumbai', co2Saved: 138.2, trees: 27 },
  { rank: 3, name: 'Diya K.', area: 'Anna Nagar', city: 'Chennai', co2Saved: 134.0, trees: 25 },
  { rank: 4, name: 'Arjun M.', area: 'Banjara Hills', city: 'Hyderabad', co2Saved: 129.5, trees: 23 },
  { rank: 5, name: 'Zara F.', area: 'Salt Lake', city: 'Kolkata', co2Saved: 126.1, trees: 20 },
];

export const ecoSessions: EcoSession[] = [
  {
    id: 's1',
    title: 'Composting 101: From Scraps to Soil',
    speaker: 'Dr. Lakshmi Iyer',
    date: 'Jun 22',
    time: '6:00 PM IST',
    duration: '45 min',
    topic: 'Waste',
    attendees: 1240,
  },
  {
    id: 's2',
    title: 'Solar Power for Every Home',
    speaker: 'Rajesh Menon',
    date: 'Jun 25',
    time: '7:30 PM IST',
    duration: '60 min',
    topic: 'Energy',
    attendees: 980,
  },
  {
    id: 's3',
    title: 'Mindful Eating: The Plant-Forward Plate',
    speaker: 'Chef Sanya Gupta',
    date: 'Jun 28',
    time: '5:00 PM IST',
    duration: '50 min',
    topic: 'Food',
    attendees: 1530,
  },
  {
    id: 's4',
    title: 'Urban Cycling: Safer Routes, Greener Cities',
    speaker: 'Aravind Pillai',
    date: 'Jul 02',
    time: '6:30 PM IST',
    duration: '40 min',
    topic: 'Transport',
    attendees: 720,
  },
];

export const coaches: Coach[] = [
  {
    id: 'c1',
    name: 'Gaia',
    title: 'Your Eco Coach',
    avatarColor: 'from-emerald-400 to-teal-600',
    specialty: 'Carbon Reduction',
    message: "You're crushing it this week! Transit emissions down 18%. Let's keep momentum with one more plant-based meal today.",
    weeklyGoal: 'Cut transport CO₂ by 25% — switch 2 car trips to public transit.',
    motivation: 'Small habits compound into big impact. You saved enough CO₂ this week to charge your phone for 4 years!',
  },
  {
    id: 'c2',
    name: 'Verda',
    title: 'Energy Coach',
    avatarColor: 'from-amber-400 to-orange-600',
    specialty: 'Electricity & Appliances',
    message: 'Your evening electricity peaked between 7-9 PM. Try shifting laundry to off-peak hours — it cuts both CO₂ and your bill.',
    weeklyGoal: 'Reduce peak-hour electricity by 30%.',
    motivation: 'Every kWh saved today is a cleaner grid tomorrow.',
  },
  {
    id: 'c3',
    name: 'Terra',
    title: 'Food Coach',
    avatarColor: 'from-rose-400 to-pink-600',
    specialty: 'Diet & Foodprint',
    message: 'Swapping one beef meal weekly saves ~24 kg CO₂/year. Your vegetarian streak this week is worth planting a sapling!',
    weeklyGoal: '3 plant-based dinners this week.',
    motivation: 'Your fork is the most powerful climate tool you own.',
  },
];

export const topPerformers = [
  { name: 'Aarav S.', achievement: '100-day streak', avatarColor: 'from-emerald-400 to-blue-500' },
  { name: 'Naina R.', achievement: 'Saved 250 kg CO₂', avatarColor: 'from-amber-400 to-rose-500' },
  { name: 'Kabir M.', achievement: 'Planted 30 trees', avatarColor: 'from-teal-400 to-emerald-600' },
  { name: 'Riya J.', achievement: 'Top ranked in city', avatarColor: 'from-violet-400 to-fuchsia-500' },
];

export const communityChallenges = [
  {
    id: 'ch1',
    title: 'Indiranagar vs Koramangala',
    subtitle: 'Area vs Area',
    type: 'area',
    teamA: { name: 'Indiranagar', value: 845, goal: 1000, trees: 22 },
    teamB: { name: 'Koramangala', value: 920, goal: 1000, trees: 26 },
    metric: 'kg CO₂ saved',
    endsIn: '3 days',
  },
  {
    id: 'ch2',
    title: 'IISc vs IIT Bombay',
    subtitle: 'College vs College',
    type: 'college',
    teamA: { name: 'IISc', value: 1240, goal: 1500, trees: 41 },
    teamB: { name: 'IIT Bombay', value: 1380, goal: 1500, trees: 48 },
    metric: 'kg CO₂ saved',
    endsIn: '5 days',
  },
  {
    id: 'ch3',
    title: 'Indiranagar vs Jayanagar',
    subtitle: 'Area vs Area',
    type: 'area',
    teamA: { name: 'Indiranagar', value: 620, goal: 800, trees: 14 },
    teamB: { name: 'Jayanagar', value: 580, goal: 800, trees: 11 },
    metric: 'kg CO₂ saved',
    endsIn: '1 week',
  },
];

export const rewardsHub = [
  {
    id: 'r1',
    name: 'Sapling Gift Kit',
    description: 'A native tree sapling delivered to your door.',
    icon: 'TreePine',
    tier: 'gold' as const,
    requirement: 'Top 10 monthly leaders',
    claimed: false,
  },
  {
    id: 'r2',
    name: 'Sustainability Certificate',
    description: 'Digital certificate signed by EcoTrack & partner NGOs.',
    icon: 'Award',
    tier: 'silver' as const,
    requirement: 'Complete 5 community challenges',
    claimed: false,
  },
  {
    id: 'r3',
    name: 'Eco Champion Bundle',
    description: 'Reusable bottle, tote & bamboo cutlery set.',
    icon: 'Gift',
    tier: 'platinum' as const,
    requirement: 'Rank #1 in your area for a month',
    claimed: false,
  },
  {
    id: 'r4',
    name: 'Workshop Voucher',
    description: 'Free entry to a premium permaculture workshop.',
    icon: 'Ticket',
    tier: 'gold' as const,
    requirement: 'Earn 4 badges',
    claimed: false,
  },
  {
    id: 'r5',
    name: 'Forest Day Pass',
    description: 'Guided trail walk in a protected forest reserve.',
    icon: 'Mountain',
    tier: 'platinum' as const,
    requirement: 'Top 3 state leaderboard',
    claimed: false,
  },
  {
    id: 'r6',
    name: 'Green Home Audit',
    description: 'Professional energy & water audit at your home.',
    icon: 'Home',
    tier: 'gold' as const,
    requirement: 'Maintain 30-day streak',
    claimed: false,
  },
];
