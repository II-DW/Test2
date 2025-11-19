
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent border-solid rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">데이터를 불러오는 중...</p>
        </div>
    );
};
