import React, { useState } from 'react';
import { NewPickupData } from '../types';

interface LogPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewPickupData) => void;
}

const LogPickupModal: React.FC<LogPickupModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [distance, setDistance] = useState('');
  const [orderValue, setOrderValue] = useState('');
  const [useReusableContainer, setUseReusableContainer] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName || !distance || !orderValue) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }
    const distanceNum = parseFloat(distance);
    const orderValueNum = parseFloat(orderValue);
    if (isNaN(distanceNum) || isNaN(orderValueNum) || distanceNum <= 0 || orderValueNum <= 0) {
        setError('거리와 주문 금액은 0보다 큰 숫자여야 합니다.');
        return;
    }

    onSubmit({
      restaurantName,
      distance: distanceNum,
      orderValue: orderValueNum,
      useReusableContainer,
    });
    // Reset form for next time
    setRestaurantName('');
    setDistance('');
    setOrderValue('');
    setUseReusableContainer(false);
    setPhoto(null);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">새로운 픽업 기록</h2>
          </div>
          <div className="p-6 space-y-4">
            {error && <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">{error}</div>}
            
            <div>
              <label htmlFor="restaurant" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">가게 이름</label>
              <input type="text" id="restaurant" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="예: 스타벅스" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">거리 (km)</label>
                <input type="number" id="distance" value={distance} onChange={e => setDistance(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="예: 1.2" step="0.1" min="0" required />
              </div>
              <div>
                <label htmlFor="orderValue" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">주문 금액 (원)</label>
                <input type="number" id="orderValue" value={orderValue} onChange={e => setOrderValue(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="예: 15000" step="100" min="0" required />
              </div>
            </div>

            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <label htmlFor="reusableContainer" className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" id="reusableContainer" checked={useReusableContainer} onChange={e => setUseReusableContainer(e.target.checked)} className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700" />
                <span className="font-semibold text-green-800 dark:text-green-300">다회용기 사용하기 ♻️</span>
              </label>
            </div>
            
            {useReusableContainer && (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="text-slate-500 dark:text-slate-400">
                    <svg className="w-12 h-12 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <p className="mt-1 text-sm">{photo ? photo.name : '인증샷 첨부하기'}</p>
                    <p className="text-xs">{photo ? '클릭하여 사진 변경' : '(선택 사항)'}</p>
                  </div>
                  <input id="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            )}

          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">취소</button>
            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">기록하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogPickupModal;
