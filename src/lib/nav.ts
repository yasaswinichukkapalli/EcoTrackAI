export interface NavItem {
  id: string;
  label: string;
  icon: string;
  group: 'main' | 'learn' | 'impact';
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', group: 'main' },
  { id: 'tracker', label: 'Activity Tracker', icon: 'Activity', group: 'main' },
  { id: 'coach', label: 'AI Eco Coach', icon: 'Sparkles', group: 'main' },
  { id: 'simulator', label: 'What-If Simulator', icon: 'FlaskConical', group: 'main' },
  { id: 'missions', label: 'Daily Missions', icon: 'Target', group: 'main' },
  { id: 'rewards', label: 'Rewards & Badges', icon: 'Trophy', group: 'main' },
  { id: 'garden', label: 'Green Garden', icon: 'Trees', group: 'main' },
  { id: 'leaderboards', label: 'Leaderboards', icon: 'Medal', group: 'learn' },
  { id: 'challenges', label: 'Community', icon: 'Users', group: 'learn' },
  { id: 'hub', label: 'Rewards Hub', icon: 'Gift', group: 'learn' },
  { id: 'sessions', label: 'Eco Sessions', icon: 'Video', group: 'learn' },
  { id: 'coaches', label: 'Eco Coaches', icon: 'Compass', group: 'learn' },
  { id: 'trees', label: 'Tree Offset', icon: 'TreePine', group: 'impact' },
  { id: 'collective', label: 'Collective Impact', icon: 'Globe2', group: 'impact' },
  { id: 'profile', label: 'Profile', icon: 'User', group: 'impact' },
];
