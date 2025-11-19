import React from 'react';
import { Activity, StatDetailType } from '../types';

interface StatsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  statType: StatDetailType | null;
}

const STAT_DETAILS = {
  caloriesBurned: {
    title: '일별 소모 칼로리',
    unit: 'kcal',
  },
  moneySaved: {
    title: '일별 절약 금액',
    unit: '원',
  },
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


const StatsDetailModal: React.FC<StatsDetailModalProps> = ({ isOpen, onClose, activities, statType }) => {
  if (!isOpen || !statType) return null;

  const details = STAT_DETAILS[statType];
  const relevantActivities = activities.filter(a => a[statType] > 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{details.title}</h2>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {relevantActivities.length > 0 ? (
            <ul className="space-y-3">
              {relevantActivities.map((activity) => (
                <li key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex flex-col">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{activity.restaurantName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(activity.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-emerald-500">
                      {activity[statType].toLocaleString()} <span className="text-sm font-medium text-slate-400">{details.unit}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">표시할 활동 기록이 없습니다.</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default StatsDetailModal;