import { LevelData } from "./types";

const BASE_XP = 100;
const EXPONENT = 1.5;

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

export function updateStreak(data: LevelData, isoDate: string): { data: LevelData, streakChanged: boolean, gainedXp: number } {
    const lastDate = data.lastDateJoined;

    // 初回ログイン
    if (!lastDate) {
        data.lastDateJoined = isoDate;
        data.streak = 1;
        return { data, streakChanged: true, gainedXp: 0 };
    }

    // 同じ日なら何もしない
    if (lastDate === isoDate) {
        return { data, streakChanged: false, gainedXp: 0 };
    }

    const yesterday = new Date(isoDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = yesterday.toISOString().split('T')[0];

    let gainedXp = 0;

    // 昨日の日付と一致すればストリーク継続
    if (lastDate === yesterdayIso) {
        data.streak++;
    } else {
        // 途切れたらリセット
        data.streak = 1;
    }

    data.lastDateJoined = isoDate;
    return { data, streakChanged: true, gainedXp };
}
