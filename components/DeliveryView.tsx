
import React, { useState } from 'react';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface Restaurant {
    id: string;
    name: string;
    category: string;
    rating: number;
    deliveryTime: string;
    minOrder: number;
    imageUrl: string;
    menu: MenuItem[];
}

const CATEGORIES = ['전체', '치킨', '피자', '한식', '분식', '카페/디저트', '일식', '양식'];

const MOCK_RESTAURANTS: Restaurant[] = [
    {
        id: 'r1',
        name: '황금올리브 치킨',
        category: '치킨',
        rating: 4.8,
        deliveryTime: '40-50분',
        minOrder: 15000,
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80',
        menu: [
            { id: 'm1', name: '황금올리브 치킨', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&q=80' },
            { id: 'm2', name: '양념 치킨', price: 21000, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&q=80' },
        ]
    },
    {
        id: 'r2',
        name: '도미노 피자',
        category: '피자',
        rating: 4.7,
        deliveryTime: '30-40분',
        minOrder: 20000,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
        menu: [
            { id: 'm3', name: '포테이토 피자', price: 25000, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80' },
            { id: 'm4', name: '페퍼로니 피자', price: 23000, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80' },
        ]
    },
    {
        id: 'r3',
        name: '엽기 떡볶이',
        category: '분식',
        rating: 4.9,
        deliveryTime: '30-45분',
        minOrder: 14000,
        imageUrl: 'https://images.unsplash.com/photo-1625244515785-c900783451e9?w=500&q=80',
        menu: [
            { id: 'm5', name: '엽기 떡볶이', price: 14000, imageUrl: 'https://images.unsplash.com/photo-1625244515785-c900783451e9?w=200&q=80' },
            { id: 'm6', name: '모둠 튀김', price: 4000, imageUrl: 'https://images.unsplash.com/photo-1625244515785-c900783451e9?w=200&q=80' },
        ]
    },
    {
        id: 'r4',
        name: '메가 커피',
        category: '카페/디저트',
        rating: 4.6,
        deliveryTime: '20-30분',
        minOrder: 8000,
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
        menu: [
            { id: 'm7', name: '아메리카노', price: 2000, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80' },
            { id: 'm8', name: '카페라떼', price: 3500, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80' },
        ]
    },
    {
        id: 'r5',
        name: '맥도날드',
        category: '양식',
        rating: 4.5,
        deliveryTime: '25-35분',
        minOrder: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
        menu: [
            { id: 'm9', name: '빅맥 세트', price: 7500, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80' },
            { id: 'm10', name: '상하이 버거', price: 6500, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80' },
        ]
    }
];

const DeliveryView: React.FC = () => {
    const [category, setCategory] = useState('전체');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
    const [orderComplete, setOrderComplete] = useState<{type: 'delivery' | 'pickup', itemName: string} | null>(null);

    const filteredRestaurants = category === '전체' 
        ? MOCK_RESTAURANTS 
        : MOCK_RESTAURANTS.filter(r => r.category === category);

    const handleOrder = (type: 'delivery' | 'pickup') => {
        if (selectedMenu) {
            setOrderComplete({ type, itemName: selectedMenu.name });
            setSelectedMenu(null);
            setSelectedRestaurant(null);
        }
    };

    if (orderComplete) {
        return (
            <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-6 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">주문이 완료되었습니다!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                    <span className="font-bold text-emerald-500">{orderComplete.itemName}</span>
                    {orderComplete.type === 'pickup' ? '을(를) 포장 주문했습니다.' : '이(가) 곧 배달됩니다.'}
                </p>
                {orderComplete.type === 'pickup' && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl mb-8 max-w-sm w-full">
                        <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">🎁 픽업 보너스</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">매장 방문 시 <strong>배달비 절약</strong> 인증을 통해 포인트를 획득하세요!</p>
                    </div>
                )}
                <button 
                    onClick={() => setOrderComplete(null)}
                    className="w-full max-w-sm bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    if (selectedRestaurant) {
        return (
            <div className="bg-white dark:bg-slate-900 min-h-full pb-20">
                <div className="sticky top-16 z-20 bg-white dark:bg-slate-900 p-4 flex items-center border-b border-slate-100 dark:border-slate-800">
                    <button onClick={() => setSelectedRestaurant(null)} className="mr-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">{selectedRestaurant.name}</h2>
                </div>
                
                <div className="relative h-48 bg-slate-200">
                    <img src={selectedRestaurant.imageUrl} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center text-white">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="font-bold mr-2">{selectedRestaurant.rating}</span>
                            <span className="text-sm opacity-80">최소주문 {selectedRestaurant.minOrder.toLocaleString()}원</span>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">대표 메뉴</h3>
                    <div className="space-y-4">
                        {selectedRestaurant.menu.map(item => (
                            <div key={item.id} onClick={() => setSelectedMenu(item)} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                                    <p className="text-slate-500 dark:text-slate-400">{item.price.toLocaleString()}원</p>
                                </div>
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
                            </div>
                        ))}
                    </div>
                </div>

                {selectedMenu && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center" onClick={() => setSelectedMenu(null)}>
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="relative h-48">
                                <img src={selectedMenu.imageUrl} alt={selectedMenu.name} className="w-full h-full object-cover" />
                                <button onClick={() => setSelectedMenu(null)} className="absolute top-4 right-4 bg-black/40 text-white p-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{selectedMenu.name}</h3>
                                <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-6">{selectedMenu.price.toLocaleString()}원</p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleOrder('delivery')}
                                        className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                                    >
                                        <span className="text-2xl mb-2">🛵</span>
                                        <span className="font-bold text-slate-800 dark:text-white">배달 주문</span>
                                        <span className="text-xs text-slate-500 mt-1">배달비 +3,000원</span>
                                    </button>
                                    <button 
                                        onClick={() => handleOrder('pickup')}
                                        className="flex flex-col items-center justify-center p-4 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">추천</div>
                                        <span className="text-2xl mb-2">🏃</span>
                                        <span className="font-bold text-emerald-700 dark:text-emerald-400">포장 주문</span>
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">배달비 0원 + 포인트 적립</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-2">오늘 뭐 먹지?</h2>
                <p className="opacity-90">포장 주문으로 지구도 지키고 포인트도 받으세요!</p>
            </div>

            {/* Category List */}
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            category === cat 
                                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Restaurant List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredRestaurants.map(restaurant => (
                    <div 
                        key={restaurant.id} 
                        onClick={() => setSelectedRestaurant(restaurant)}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex space-x-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <img src={restaurant.imageUrl} alt={restaurant.name} className="w-24 h-24 rounded-lg object-cover bg-slate-200" />
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{restaurant.name}</h3>
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                <span className="text-yellow-400 mr-1">★</span>
                                <span className="font-medium mr-2">{restaurant.rating}</span>
                                <span>• {restaurant.category}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                                <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs mr-2">{restaurant.deliveryTime}</span>
                                <span className="text-xs">최소주문 {restaurant.minOrder.toLocaleString()}원</span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredRestaurants.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        해당 카테고리의 가게가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryView;
