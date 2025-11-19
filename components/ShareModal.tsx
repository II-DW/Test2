import React from 'react';
import { User, Activity } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  activities: Activity[];
}

const ShareCard: React.FC<{ user: User, activities: Activity[] }> = ({ user, activities }) => {
    const weeklyStats = activities.reduce((acc, activity) => {
        const activityDate = new Date(activity.date);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (activityDate > oneWeekAgo) {
            acc.calories += activity.caloriesBurned;
            acc.money += activity.moneySaved;
            acc.carbon += activity.carbonReduced;
        }
        return acc;
    }, { calories: 0, money: 0, carbon: 0 });

    return (
        <div id="share-card" className="bg-slate-800 p-8 rounded-2xl w-full max-w-md text-white font-sans border-4 border-emerald-500 shadow-2xl">
            <div className="text-center mb-6">
                <p className="text-lg font-semibold text-emerald-400">이번 주 나의 픽업 성과</p>
                <h2 className="text-3xl font-bold">{user.name}님의 기록</h2>
            </div>
            
            <div className="flex justify-center items-center space-x-4 mb-8">
                <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="w-24 h-24 rounded-full border-4 border-slate-600 object-cover" />
                <div>
                    <p className="text-xl font-bold">{user.name}</p>
                    <p className="text-slate-400">Lv. {user.level}</p>
                </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                    <p className="text-sm text-slate-400">소모 열량</p>
                    <p className="text-xl font-bold text-red-400">{weeklyStats.calories.toFixed(0)} <span className="text-xs">kcal</span></p>
                </div>
                <div>
                    <p className="text-sm text-slate-400">절약 금액</p>
                    <p className="text-xl font-bold text-blue-400">{weeklyStats.money.toLocaleString()} <span className="text-xs">원</span></p>
                </div>
                <div>
                    <p className="text-sm text-slate-400">탄소 절감</p>
                    <p className="text-xl font-bold text-green-400">{weeklyStats.carbon.toFixed(2)} <span className="text-xs">kg</span></p>
                </div>
            </div>
            
            <div className="text-center">
                 <p className="text-lg font-bold text-emerald-500">🌍 픽업팰과 함께</p>
            </div>
        </div>
    );
};


const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, user, activities }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-transparent rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-full p-2 z-10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-4 flex flex-col items-center">
            <ShareCard user={user} activities={activities} />
            <div className="mt-6 flex space-x-4">
                <button className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-600 transition">
                    이미지 저장
                </button>
                <button className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-700 transition">
                    링크 복사
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;