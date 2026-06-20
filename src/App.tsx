import { useState } from 'react';
import { EcoProvider } from './context/EcoContext';
import { MobileNav, Sidebar, TopBar } from './components/Navigation';
import { GradientOrbs } from './components/ui';
import Dashboard from './pages/Dashboard';
import ActivityTracker from './pages/ActivityTracker';
import EcoCoach from './pages/EcoCoach';
import Simulator from './pages/Simulator';
import Missions from './pages/Missions';
import Rewards from './pages/Rewards';
import Garden from './pages/Garden';
import Leaderboards from './pages/Leaderboards';
import Community from './pages/Community';
import RewardsHub from './pages/RewardsHub';
import Sessions from './pages/Sessions';
import Coaches from './pages/Coaches';
import TreeOffset from './pages/TreeOffset';
import Collective from './pages/Collective';
import Profile from './pages/Profile';

const PAGES: Record<string, React.ComponentType<{ setPage: (p: string) => void }>> = {
  dashboard: Dashboard,
  tracker: ActivityTracker,
  coach: EcoCoach,
  simulator: Simulator,
  missions: Missions,
  rewards: Rewards,
  garden: Garden,
  leaderboards: Leaderboards,
  challenges: Community,
  hub: RewardsHub,
  sessions: Sessions,
  coaches: Coaches,
  trees: TreeOffset,
  collective: Collective,
  profile: Profile,
};

function Shell() {
  const [page, setPage] = useState('dashboard');
  const Page = PAGES[page] ?? Dashboard;

  const handleSet = (p: string) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-bg min-h-screen">
      <GradientOrbs />
      <Sidebar page={page} setPage={handleSet} />
      <div className="lg:pl-72">
        <TopBar page={page} setPage={handleSet} />
        <main className="px-3 pb-28 pt-4 lg:px-6 lg:pb-8">
          <div className="mx-auto max-w-6xl">
            <Page setPage={handleSet} />
          </div>
        </main>
      </div>
      <MobileNav page={page} setPage={handleSet} />
    </div>
  );
}

export default function App() {
  return (
    <EcoProvider>
      <Shell />
    </EcoProvider>
  );
}
