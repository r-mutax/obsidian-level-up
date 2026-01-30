import { LevelData } from './types';

// Constants for XP Calculation
const BASE_XP = 100; // XP needed for level 2
const EXPONENT = 1.5; // Difficulty scaling factor

export function calculateNextLevelXp(level: number): number {
    return Math.floor(BASE_XP * Math.pow(level, EXPONENT));
}

export function addXp(data: LevelData, amount: number): { data: LevelData, leveledUp: boolean } {
    let leveledUp = false;
    data.currentXp += amount;
    data.totalXp += amount;

    while (data.currentXp >= data.nextLevelXp) {
        data.currentXp -= data.nextLevelXp;
        data.level++;
        data.nextLevelXp = calculateNextLevelXp(data.level);
        leveledUp = true;
    }

    return { data, leveledUp };
}

export function updateStreak(data: LevelData, today: string): { data: LevelData, streakChanged: boolean, gainedXp: number } {
    const lastDate = data.lastDateJoined;
    let streakChanged = false;
    let gainedXp = 0;

    if (today === lastDate) {
        return { data, streakChanged, gainedXp };
    }

    const todayDate = new Date(today);
    const lastDateObj = new Date(lastDate);
    const diffTime = Math.abs(todayDate.getTime() - lastDateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        data.streak++;
        streakChanged = true;
        // 基本ボーナス(50) + ストリーク数x10 (最大500)
        gainedXp = 50 + Math.min(data.streak * 10, 500);
    } else if (diffDays > 1) {
        data.streak = 1; // Reset streak, but count today
        streakChanged = true;
        gainedXp = 10; // Small bonus for returning
    }

    data.lastDateJoined = today;
    return { data, streakChanged, gainedXp };
}
