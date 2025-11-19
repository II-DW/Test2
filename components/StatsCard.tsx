
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, icon, color, onClick }) => {
  const isClickable = !!onClick;
  const cardClasses = `bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-md flex items-center space-x-4 transition-transform transform ${isClickable ? 'hover:scale-105 cursor-pointer' : ''}`;

  return (
    <div className={cardClasses} onClick={onClick} role={isClickable ? 'button' : undefined} tabIndex={isClickable ? 0 : undefined} onKeyDown={isClickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}>
      <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {value} <span className="text-base font-medium text-slate-400 dark:text-slate-300">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default StatsCard;