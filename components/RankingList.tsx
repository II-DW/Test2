
import React, { useState } from 'react';
import { Rankings, RankItem } from '../types';

interface RankingListProps {
  rankings: Rankings;
  currentUserId: string;
}

type RankingCategory = 'local' | 'friends' | 'weekly';

const RankingList: React.FC<RankingListProps> = ({ rankings, currentUserId }) => {
  const [activeTab, setActiveTab] = useState<RankingCategory>('local');

  const renderRankItems = (items: RankItem[]) => {
    return items.slice(0, 5).map((item) => (
      <li
        key={item.userId}
        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
          item.userId === currentUserId ? 'bg-emerald-100 dark:bg-emerald-800/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
        }`}
      >
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold w-6 text-center text-slate-500 dark:text-slate-400">{item.rank}</span>
          <img className="h-10 w-10 rounded-full object-cover" src={`https://i.pravatar.cc/150?u=${item.userId}`} alt={item.name} />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
        </div>
        <span className="font-bold text-emerald-500">{item.score.toLocaleString()} P</span>
      </li>
    ));
  };
  
  const TABS: { key: RankingCategory, label: string }[] = [
      { key: 'local', label: '지역 랭킹' },
      { key: 'friends', label: '친구 랭킹' },
      { key: 'weekly', label: '주간 랭킹' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
      <div className="mb-4">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {TABS.map(tab => (
                 <button
                 key={tab.key}
                 onClick={() => setActiveTab(tab.key)}
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
      <ul className="space-y-2">
        {renderRankItems(rankings[activeTab])}
      </ul>
    </div>
  );
};

export default RankingList;
