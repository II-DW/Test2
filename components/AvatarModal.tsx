import React, { useState, useEffect } from 'react';
// FIX: Use the new CharacterDisplayData type which includes level and other stats.
import { CharacterDisplayData } from '../types';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Update prop type to match the data being passed from App.tsx.
  character: CharacterDisplayData;
  onSubmit: (points: { attack: number, defense: number }) => Promise<void>;
}

const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, character, onSubmit }) => {
  const [pointsToAttack, setPointsToAttack] = useState(0);
  const [pointsToDefense, setPointsToDefense] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const availablePoints = character.statPoints - pointsToAttack - pointsToDefense;

  useEffect(() => {
    // Reset local state when modal opens or character data changes
    if (isOpen) {
        setPointsToAttack(0);
        setPointsToDefense(0);
        setIsSaving(false);
    }
  }, [isOpen, character]);

  if (!isOpen) return null;

  const handleAddPoint = (stat: 'attack' | 'defense') => {
    if (availablePoints > 0) {
      if (stat === 'attack') setPointsToAttack(p => p + 1);
      if (stat === 'defense') setPointsToDefense(p => p + 1);
    }
  };

  const handleRemovePoint = (stat: 'attack' | 'defense') => {
    if (stat === 'attack' && pointsToAttack > 0) {
      setPointsToAttack(p => p - 1);
    }
    if (stat === 'defense' && pointsToDefense > 0) {
      setPointsToDefense(p => p - 1);
    }
  };

  const handleSubmit = async () => {
    if (pointsToAttack > 0 || pointsToDefense > 0) {
      setIsSaving(true);
      try {
        await onSubmit({ attack: pointsToAttack, defense: pointsToDefense });
      } catch (error) {
        console.error("Failed to save stats", error);
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={isSaving ? undefined : onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">아바타 관리</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <img src={character.thumbnailUrl} alt={character.name} className="w-24 h-24 rounded-full object-cover ring-2 ring-emerald-400" />
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{character.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Lv. {character.level}</p>
            </div>
          </div>

          {character.statPoints > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-center">
              <p className="font-bold text-yellow-800 dark:text-yellow-300">
                사용 가능한 스탯 포인트: <span className="text-2xl">{availablePoints}</span> / {character.statPoints}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">스탯을 분배하여 캐릭터를 성장시키세요!</p>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">스탯 분배</h4>
            {/* Attack Stat */}
            <div className="flex items-center justify-between">
              <span className="font-medium">⚔️ 공격력: {character.attack} {pointsToAttack > 0 && <span className="text-green-500 font-bold text-lg"> +{pointsToAttack}</span>}</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleRemovePoint('attack')} disabled={isSaving || pointsToAttack === 0} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold">-</button>
                <button onClick={() => handleAddPoint('attack')} disabled={isSaving || availablePoints === 0} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold">+</button>
              </div>
            </div>
            {/* Defense Stat */}
            <div className="flex items-center justify-between">
              <span className="font-medium">🛡️ 방어력: {character.defense} {pointsToDefense > 0 && <span className="text-green-500 font-bold text-lg"> +{pointsToDefense}</span>}</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleRemovePoint('defense')} disabled={isSaving || pointsToDefense === 0} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold">-</button>
                <button onClick={() => handleAddPoint('defense')} disabled={isSaving || availablePoints === 0} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold">+</button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">보유 스킬</h4>
              <ul className="space-y-2">
                  {character.skills.map(skill => (
                      <li key={skill.name} className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">{skill.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{skill.description}</p>
                      </li>
                  ))}
              </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end space-x-3">
          <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50">닫기</button>
          {character.statPoints > 0 && (
            <button onClick={handleSubmit} disabled={isSaving || (pointsToAttack === 0 && pointsToDefense === 0)} className="px-6 py-2 text-sm font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 w-28 text-center">
                {isSaving ? '저장 중...' : '분배 완료'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
