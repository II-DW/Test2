export interface Skill {
  name: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  modelUrl: string;
  thumbnailUrl: string;
  statPoints: number;
  attack: number;
  defense: number;
  skills: Skill[];
}

// FIX: Create a new type that combines Character data with user-level progression stats for display purposes.
export interface CharacterDisplayData extends Character {
  level: number;
  exp: number;
  expToNextLevel: number;
}

export interface UserStats {
  totalPickups: number;
  totalCaloriesBurned: number;
  totalMoneySaved: number;
  totalCarbonReduced: number; // in kg
}

export interface User {
  id: string;
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  stats: UserStats;
  character: Character;
}

export interface Activity {
  id: string;
  restaurantName: string;
  date: string; // ISO string
  caloriesBurned: number;
  moneySaved: number;
  carbonReduced: number;
  pointsEarned: number;
  useReusableContainer: boolean;
}

export interface RankItem {
  rank: number;
  userId: string;
  name: string;
  score: number;
}

export interface Rankings {
  local: RankItem[];
  friends: RankItem[];
  weekly: RankItem[];
}

export interface NewPickupData {
    restaurantName: string;
    distance: number; // in km
    orderValue: number; // in currency
    useReusableContainer: boolean;
}

export type StatDetailType = 'caloriesBurned' | 'moneySaved';

export type TabType = 'delivery' | 'activity' | 'home' | 'avatar' | 'ranking';