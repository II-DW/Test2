
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onShare: () => void;
  onOpenMyPage: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onShare, onOpenMyPage }) => {
  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-sm border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-emerald-500">🌍</span>
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">
              픽업팰 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">v1.0</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onShare}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Share achievements"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button 
              onClick={onOpenMyPage}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Open My Page"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">{user.name} (Lv. {user.level})</span>
              <img
                className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-400"
                src={`https://i.pravatar.cc/150?u=${user.id}`}
                alt="User avatar"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
