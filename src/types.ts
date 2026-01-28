export interface LevelData {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    totalXp: number;
    streak: number;
    lastDateJoined: string; // ISO Date
}

export interface GamificationSettings {
    xpPerChar: number;
    xpPerNote: number;
    streakBonus: number;
    debug: boolean;
}

export const DEFAULT_SETTINGS: GamificationSettings = {
    xpPerChar: 1,
    xpPerNote: 50,
    streakBonus: 100,
    debug: true,
}

export const DEFAULT_DATA: LevelData = {
    level: 1,
    currentXp: 0,
    nextLevelXp: 100,
    totalXp: 0,
    streak: 0,
    lastDateJoined: '',
}
