
import React, { useState, useEffect, useCallback } from 'react';
import { User, Activity, Rankings, NewPickupData, StatDetailType, CharacterDisplayData, TabType } from './types';
import { api } from './services/api';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import RankingList from './components/RankingList';
import RecentActivity from './components/RecentActivity';
import ShareModal from './components/ShareModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import LogPickupModal from './components/LogPickupModal';
import MyPageModal from './components/MyPageModal';
import StatsDetailModal from './components/StatsDetailModal';
import TabBar from './components/TabBar';
import CharacterView from './components/CharacterView';
import AvatarModal from './components/AvatarModal';
import DeliveryView from './components/DeliveryView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [rankings, setRankings] = useState<Rankings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isLogPickupModalOpen, setLogPickupModalOpen] = useState(false);
  const [isMyPageModalOpen, setMyPageModalOpen] = useState(false);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
  const [statDetailType, setStatDetailType] = useState<StatDetailType | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userData, activitiesData, rankingsData] = await Promise.all([
        api.fetchUserData(),
        api.fetchActivities(),
        api.fetchRankings(),
      ]);
      setUser(userData);
      setActivities(activitiesData);
      setRankings(rankingsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogPickupSubmit = useCallback(async (data: NewPickupData) => {
    if (!user) return;
    
    setLogPickupModalOpen(false);
    setIsLoading(true);

    try {
        await api.logPickup(data);
        await fetchData();
    } catch (error) {
        console.error("Failed to log pickup:", error);
        setIsLoading(false);
    }
  }, [user, fetchData]);
  
  const handleAllocateStats = useCallback(async (points: { attack: number; defense: number }) => {
    if (!user || !user.character) return;
    
    setIsLoading(true);
    setAvatarModalOpen(false);

    try {
      await api.allocateStatPoints(points);
      await fetchData();
    } catch (error) {
      console.error("Failed to allocate stat points:", error);
      // Re-open modal on failure if desired, or show a toast message
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchData]);


  const handleOpenStatsDetail = (type: StatDetailType) => {
    setStatDetailType(type);
  };


  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !rankings) {
    return <div className="text-center text-red-500 mt-10">데이터 로딩에 실패했습니다.</div>;
  }

  const FlameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A5 5 0 0012 11c0 0 .5 1.5 1.5 3.5A5 5 0 019.879 16.121z" /></svg>;
  const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
  const LeafIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

  // FIX: Create a combined object for character display data to satisfy component prop types.
  const characterDisplayData: CharacterDisplayData = {
    ...user.character,
    level: user.level,
    exp: user.exp,
    expToNextLevel: user.expToNextLevel,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans pb-20">
      {isLoading && user && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <LoadingSpinner />
        </div>
      )}
      <Header 
        user={user} 
        onShare={() => setShareModalOpen(true)} 
        onOpenMyPage={() => setMyPageModalOpen(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeTab === 'delivery' && (
          <DeliveryView />
        )}
        {activeTab === 'activity' && (
             <RecentActivity activities={activities} />
        )}
        {activeTab === 'home' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <StatsCard title="소모 열량" value={`${user.stats.totalCaloriesBurned.toFixed(0)}`} unit="kcal" icon={<FlameIcon />} color="text-red-500" onClick={() => handleOpenStatsDetail('caloriesBurned')} />
                  <StatsCard title="절약 금액" value={`${user.stats.totalMoneySaved.toFixed(0)}`} unit="원" icon={<MoneyIcon />} color="text-blue-500" onClick={() => handleOpenStatsDetail('moneySaved')} />
                  <StatsCard title="탄소 절감량" value={`${user.stats.totalCarbonReduced.toFixed(2)}`} unit="kg" icon={<LeafIcon />} color="text-green-500" />
                </div>
                {/* Short preview or welcome message could go here if rankings are moved */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold mb-2">👋 환영합니다, {user.name}님!</h2>
                    <p className="text-slate-600 dark:text-slate-300">오늘도 건강한 픽업 활동으로 지구를 지켜주셔서 감사합니다.</p>
                </div>
            </div>
        )}
        {activeTab === 'avatar' && user.character && (
            <CharacterView character={characterDisplayData} onManage={() => setAvatarModalOpen(true)} />
        )}
        {activeTab === 'ranking' && (
            <RankingList rankings={rankings} currentUserId={user.id} />
        )}
      </main>

      {(activeTab === 'home' || activeTab === 'activity') && (
        <button
            onClick={() => setLogPickupModalOpen(true)}
            className="fixed bottom-24 right-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-16 w-16 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out flex items-center justify-center z-20"
            aria-label="새로운 픽업 기록하기"
        >
            <PlusIcon />
        </button>
      )}

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setShareModalOpen(false)}
        user={user}
        activities={activities.slice(0, 5)} 
      />
      <LogPickupModal
        isOpen={isLogPickupModalOpen}
        onClose={() => setLogPickupModalOpen(false)}
        onSubmit={handleLogPickupSubmit}
      />
      <MyPageModal
        isOpen={isMyPageModalOpen}
        onClose={() => setMyPageModalOpen(false)}
        user={user}
        onUpdate={fetchData}
      />
      <StatsDetailModal
        isOpen={!!statDetailType}
        onClose={() => setStatDetailType(null)}
        activities={activities}
        statType={statDetailType}
      />
      {user.character && (
        <AvatarModal
          isOpen={isAvatarModalOpen}
          onClose={() => setAvatarModalOpen(false)}
          character={characterDisplayData}
          onSubmit={handleAllocateStats}
        />
      )}
    </div>
  );
};

export default App;
