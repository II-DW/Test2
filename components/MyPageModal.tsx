import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: () => Promise<void>;
}

type Tab = 'nickname' | 'friends';

const MyPageModal: React.FC<MyPageModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('nickname');
  
  // States for forms
  const [nickname, setNickname] = useState(user.name);
  const [friendNickname, setFriendNickname] = useState('');
  
  // States for feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Reset state when modal opens or user changes
    setNickname(user.name);
    setFriendNickname('');
    setMessage(null);
    setActiveTab('nickname');
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;
    onClose();
  };
  
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname === user.name) return;
    setLoading(true);
    try {
        await api.updateUsername(nickname);
        await onUpdate();
        showMessage('success', '이름이 성공적으로 변경되었습니다.');
    } catch (err) {
        showMessage('error', '이름 변경에 실패했습니다.');
    } finally {
        setLoading(false);
    }
  };

  const handleAddFriendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendNickname) return;
    setLoading(true);
    try {
        const result = await api.addFriend(friendNickname);
        if(result.success) {
            await onUpdate();
            showMessage('success', result.message);
            setFriendNickname('');
        } else {
            showMessage('error', result.message);
        }
    } catch (err) {
        showMessage('error', '친구 추가에 실패했습니다.');
    } finally {
        setLoading(false);
    }
  };

  const TABS: { key: Tab, label: string }[] = [
      { key: 'nickname', label: '이름 변경' },
      { key: 'friends', label: '친구 신청' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">마이페이지</h2>
        </div>
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-1 p-1" aria-label="Tabs">
            {TABS.map(tab => (
                 <button
                 key={tab.key}
                 onClick={() => setActiveTab(tab.key)}
                 className={`
                   ${activeTab === tab.key ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 dark:text-slate-400'}
                   px-3 py-2 font-medium text-sm rounded-lg transition-colors flex-1
                 `}
               >
                 {tab.label}
               </button>
            ))}
          </nav>
        </div>

        <div className="p-6 min-h-[250px]">
            {message && (
                <div className={`p-3 rounded-lg mb-4 text-sm font-semibold ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                    {message.text}
                </div>
            )}
            {activeTab === 'nickname' && (
                <form onSubmit={handleNicknameSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nickname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">새 닉네임</label>
                        <input type="text" id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" required />
                    </div>
                    <button type="submit" disabled={loading || nickname === user.name} className="w-full px-6 py-2 text-sm font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                        {loading ? '저장 중...' : '저장하기'}
                    </button>
                </form>
            )}
            {activeTab === 'friends' && (
                <form onSubmit={handleAddFriendSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="friend-nickname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">친구 닉네임</label>
                        <input type="text" id="friend-nickname" value={friendNickname} onChange={e => setFriendNickname(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="친구의 닉네임을 입력하세요" required />
                    </div>
                    <button type="submit" disabled={loading || !friendNickname} className="w-full px-6 py-2 text-sm font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                        {loading ? '추가 중...' : '친구 추가'}
                    </button>
                </form>
            )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default MyPageModal;