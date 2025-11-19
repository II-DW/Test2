
import React, { useState } from 'react';
// FIX: Use the new CharacterDisplayData type which includes level and exp.
import { CharacterDisplayData } from '../types';

interface CharacterViewProps {
  // FIX: Update prop type to match the data being passed.
  character: CharacterDisplayData;
  onManage: () => void;
}

const CharacterView: React.FC<CharacterViewProps> = ({ character, onManage }) => {
  const [animationName, setAnimationName] = useState('Idle');
  const expPercentage = (character.exp / character.expToNextLevel) * 100;
  const hasStatPoints = character.statPoints > 0;
  
  // Use 'as any' to bypass strict JSX.IntrinsicElements checks for custom elements
  const ModelViewer = 'model-viewer' as any;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-center">
      <div className="relative w-full h-80 mx-auto mb-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden">
        <ModelViewer
            src={character.modelUrl}
            alt="Character 3D model"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            animation-name={animationName}
            autoplay
            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        />
        <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xl font-bold w-12 h-12 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 shadow-md z-10">
          {character.level}
        </span>

        {/* Animation Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          <button
            onClick={() => setAnimationName('Idle')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all shadow-sm backdrop-blur-sm ${
              animationName === 'Idle' 
                ? 'bg-emerald-500 text-white scale-105' 
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            대기
          </button>
          <button
            onClick={() => setAnimationName('Walk')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all shadow-sm backdrop-blur-sm ${
              animationName === 'Walk' 
                ? 'bg-emerald-500 text-white scale-105' 
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            걷기
          </button>
           <button
            onClick={() => setAnimationName('Run')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all shadow-sm backdrop-blur-sm ${
              animationName === 'Run' 
                ? 'bg-emerald-500 text-white scale-105' 
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            뛰기
          </button>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{character.name}</h2>
      <p className="text-md text-slate-500 dark:text-slate-400">Lv. {character.level}</p>

      <div className="mt-6 text-left">
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="font-medium text-slate-600 dark:text-slate-300">다음 레벨까지</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {character.exp} / {character.expToNextLevel} EXP
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${expPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-around text-center">
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">⚔️ 공격력</p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{character.attack}</p>
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">🛡️ 방어력</p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{character.defense}</p>
        </div>
      </div>
       <div className="mt-6">
        <button
          onClick={onManage}
          className={`relative w-full font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-px ${
            hasStatPoints 
              ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 animate-pulse' 
              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
          }`}
        >
          아바타 관리
          {hasStatPoints && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white text-xs font-bold items-center justify-center">
                {character.statPoints}
              </span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CharacterView;
