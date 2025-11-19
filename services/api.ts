import { User, Activity, Rankings, NewPickupData, RankItem, Character } from '../types';

// --- MOCK DATABASE ---
let mockCharacter: Character = {
    id: 'char_1',
    name: '피키',
    modelUrl: 'https://cdn.glitch.global/4835a878-1a2c-4545-9fce-05c56bde802b/puffy_dragon.glb?v=1716490334812',
    thumbnailUrl: 'https://i.pravatar.cc/150?u=char_1',
    statPoints: 3,
    attack: 10,
    defense: 8,
    skills: [
        { name: '절약의 일격', description: '절약 금액에 비례하여 추가 포인트를 획득합니다.' },
        { name: '탄소 방패', description: '탄소 절감량이 높을수록 방어력이 증가합니다.' },
    ],
};

let mockUser: User = {
  id: 'user_1',
  name: '김픽업',
  level: 5,
  exp: 120,
  expToNextLevel: 250,
  stats: {
    totalPickups: 28,
    totalCaloriesBurned: 1450,
    totalMoneySaved: 42000,
    totalCarbonReduced: 7.5,
  },
  character: mockCharacter
};

let mockActivities: Activity[] = [
  { id: 'act_1', restaurantName: '피자헛', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), caloriesBurned: 60, moneySaved: 3000, carbonReduced: 0.35, pointsEarned: 55, useReusableContainer: true },
  { id: 'act_2', restaurantName: 'BHC 치킨', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), caloriesBurned: 45, moneySaved: 3000, carbonReduced: 0.2, pointsEarned: 40, useReusableContainer: false },
  { id: 'act_3', restaurantName: '스타벅스', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), caloriesBurned: 25, moneySaved: 1000, carbonReduced: 0.15, pointsEarned: 25, useReusableContainer: true },
  { id: 'act_4', restaurantName: '버거킹', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), caloriesBurned: 80, moneySaved: 2000, carbonReduced: 0.4, pointsEarned: 70, useReusableContainer: false },
];

const allOtherUsers: Omit<User, 'stats' | 'level' | 'exp' | 'expToNextLevel' | 'character'>[] = [
    { id: 'user_2', name: '박배달' },
    { id: 'user_3', name: '이포장' },
    { id: 'user_4', name: '최워킹' },
    { id: 'user_5', name: '강달려' },
    { id: 'user_6', name: '조절약' },
    { id: 'user_7', name: '주민1' },
    { id: 'user_8', name: '주민2' },
];

let mockFriends: Omit<User, 'stats' | 'level' | 'exp' | 'expToNextLevel' | 'character'>[] = allOtherUsers.slice(0, 3);

let mockRankings: Rankings = {
  local: [],
  friends: [],
  weekly: [],
};

const generateRankings = () => {
    const generate = (users: {id: string, name: string}[]): RankItem[] => {
        const fullUserList = users.some(u => u.id === mockUser.id) ? users : [...users, { id: mockUser.id, name: mockUser.name }];
        
        const ranked = fullUserList.map(u => ({
            userId: u.id,
            name: u.name,
            score: u.id === mockUser.id 
                ? mockUser.exp * 10 + mockUser.stats.totalPickups * 5 
                : Math.floor(Math.random() * 5000) + 500
        }));
        
        return ranked.sort((a, b) => b.score - a.score).map((item, index) => ({...item, rank: index + 1}));
    }
    
    mockRankings.local = generate(allOtherUsers);
    mockRankings.friends = generate(mockFriends);
    mockRankings.weekly = generate(allOtherUsers);
};

generateRankings();


// --- MOCK API FUNCTIONS ---
const simulateDelay = <T,>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 500));

export const api = {
  fetchUserData: (): Promise<User> => {
    return simulateDelay(mockUser);
  },
  fetchActivities: (): Promise<Activity[]> => simulateDelay(mockActivities),
  fetchRankings: (): Promise<Rankings> => {
    generateRankings(); // Regenerate every time to reflect potential user changes
    return simulateDelay(mockRankings);
  },
  logPickup: (data: NewPickupData): Promise<Activity> => {
    const { distance, useReusableContainer } = data;
    
    // Simple calculation logic
    const caloriesBurned = Math.round(distance * 30); // 30 kcal per km walk
    const moneySaved = 3000; // Assume flat delivery fee saving
    let carbonReduced = parseFloat((distance * 0.15).toFixed(2)); // 0.15 kg CO2 per km for a car

    // Add bonus for reusable container
    if (useReusableContainer) {
        carbonReduced += 0.05; // Add 50g CO2 reduction bonus
        carbonReduced = parseFloat(carbonReduced.toFixed(2));
    }

    const pointsEarned = Math.round(caloriesBurned * 0.5 + moneySaved / 100 + carbonReduced * 20);

    const newActivity: Activity = {
        id: `act_${Date.now()}`,
        restaurantName: data.restaurantName,
        date: new Date().toISOString(),
        caloriesBurned,
        moneySaved,
        carbonReduced,
        pointsEarned,
        useReusableContainer,
    };

    // Update user stats
    mockUser.stats.totalPickups += 1;
    mockUser.stats.totalCaloriesBurned += caloriesBurned;
    mockUser.stats.totalMoneySaved += moneySaved;
    mockUser.stats.totalCarbonReduced += carbonReduced;
    
    // Update user EXP and Level
    mockUser.exp += pointsEarned;
    if (mockUser.exp >= mockUser.expToNextLevel) {
        mockUser.level += 1;
        mockUser.exp -= mockUser.expToNextLevel;
        mockUser.expToNextLevel = Math.round(mockUser.expToNextLevel * 1.5);
        mockUser.character.statPoints += 3; // Grant stat points on level up
    }
    
    mockActivities.unshift(newActivity);
    if(mockActivities.length > 20) mockActivities.pop();

    return simulateDelay(newActivity);
  },
  updateUsername: (newName: string): Promise<User> => {
    if (newName && newName.trim().length > 0) {
        mockUser.name = newName.trim();
    }
    return simulateDelay(mockUser);
  },
  addFriend: (nickname: string): Promise<{ success: boolean; message: string; }> => {
    const friendToAdd = allOtherUsers.find(u => u.name === nickname);

    if (!friendToAdd) {
        return simulateDelay({ success: false, message: '해당 닉네임의 사용자를 찾을 수 없습니다.' });
    }
    if (friendToAdd.id === mockUser.id) {
        return simulateDelay({ success: false, message: '자기 자신을 친구로 추가할 수 없습니다.' });
    }
    if (mockFriends.some(f => f.id === friendToAdd.id)) {
        return simulateDelay({ success: false, message: '이미 친구 목록에 있습니다.' });
    }

    mockFriends.push(friendToAdd);
    return simulateDelay({ success: true, message: `${nickname}님을 친구로 추가했습니다.` });
  },
  allocateStatPoints: (points: { attack: number, defense: number }): Promise<Character> => {
    const totalPointsToSpend = points.attack + points.defense;
    if (mockUser.character.statPoints >= totalPointsToSpend) {
        mockUser.character.attack += points.attack;
        mockUser.character.defense += points.defense;
        mockUser.character.statPoints -= totalPointsToSpend;
    } else {
        // This should be handled by client-side validation, but as a fallback:
        return Promise.reject(new Error("Not enough stat points."));
    }
    return simulateDelay(mockUser.character);
  },
};