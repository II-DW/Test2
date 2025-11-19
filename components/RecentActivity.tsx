import React, { useState, useMemo } from 'react';
import { Activity } from '../types';

interface RecentActivityProps {
  activities: Activity[];
}

type ActivityCategory = 'all' | 'reusable' | 'highCarbon';

const TABS: { key: ActivityCategory, label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'reusable', label: '다회용기 사용' },
    { key: 'highCarbon', label: '탄소 절감 으뜸' }
];

const ActivityIcon: React.FC = () => (
    <div className="bg-green-100 dark:bg-green-800/50 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.5 2A2.5 2.5 0 003 4.5v11A2.5 2.5 0 005.5 18h9a2.5 2.5 0 002.5-2.5V8.836a2.5 2.5 0 00-.732-1.768l-3.068-3.068A2.5 2.5 0 0011.164 3H5.5a.5.5 0 01-.5-.5V2zM12 4.5a.5.5 0 00-.5-.5h-2a.5.5 0 000 1h2a.5.5 0 00.5-.5zM12 7a.5.5 0 00-.5-.5H5.5a.5.5 0 000 1h6a.5.5 0 00.5-.5z"/>
        </svg>
    </div>
);

const ReusableContainerIcon: React.FC = () => (
    <div title="다회용기 사용!">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
    </div>
)

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}년 전`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}달 전`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}일 전`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}시간 전`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}분 전`;
    return `${Math.floor(seconds)}초 전`;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const [activeTab, setActiveTab] = useState<ActivityCategory>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ACTIVITIES_PER_PAGE = 5;

  const filteredActivities = useMemo(() => {
    switch (activeTab) {
        case 'reusable':
            return activities.filter(a => a.useReusableContainer);
        case 'highCarbon':
            // Let's define "High Carbon Savings" as reducing 0.35kg or more
            return activities.filter(a => a.carbonReduced >= 0.35);
        case 'all':
        default:
            return activities;
    }
  }, [activities, activeTab]);
  
  const totalPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE);
  const startIndex = (currentPage - 1) * ACTIVITIES_PER_PAGE;
  const currentActivities = filteredActivities.slice(startIndex, startIndex + ACTIVITIES_PER_PAGE);

  const handleTabClick = (tab: ActivityCategory) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page on tab change
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;
    return (
      <nav className="flex justify-center items-center space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`flex items-center justify-center h-10 w-10 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              currentPage === page
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">최근 활동</h2>
        </div>

        <div className="mb-4">
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabClick(tab.key)}
                            className={`${
                                activeTab === tab.key
                                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
        
        {currentActivities.length > 0 ? (
            <ul className="space-y-3">
                {currentActivities.map((activity) => (
                    <li key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <ActivityIcon />
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{activity.restaurantName}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{timeAgo(activity.date)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {activity.useReusableContainer && <ReusableContainerIcon />}
                            <div className="text-right">
                                <p className="font-bold text-green-500">+{activity.pointsEarned} P</p>
                                <p className="text-sm text-slate-400">-{activity.carbonReduced.toFixed(2)}kg CO₂</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">해당하는 활동이 없습니다.</p>
            </div>
        )}

        <Pagination />
    </div>
  );
};

export default RecentActivity;
