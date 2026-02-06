export interface LevelData {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    totalXp: number;
    streak: number;
    lastDateJoined: string; // ISO Date
    // Phase 1 Extensions
    xpHistory: Record<string, number>; // YYYY-MM-DD: xp
    // Phase 2 Extensions
    earnedBadges: string[];
    stats: {
        notesCreated: number;
        notesDeleted: number;
        linksCreated: number;
        charsWritten: number;
    };
    // Phase 2: Quest System
    quests: Quest[];
    lastQuestGenDate: string; // ISO Date YYYY-MM-DD
}

export const DEFAULT_DATA: LevelData = {
    level: 1,
    currentXp: 0,
    nextLevelXp: 100,
    totalXp: 0,
    streak: 0,
    lastDateJoined: new Date().toISOString().split('T')[0],
    xpHistory: {},
    earnedBadges: [],
    stats: {
        notesCreated: 0,
        notesDeleted: 0,
        linksCreated: 0,
        charsWritten: 0
    },
    quests: [],
    lastQuestGenDate: ''
}

export interface Quest {
    id: string;
    type: 'daily' | 'weekly';
    description: string;
    target: number;      // e.g. 500 chars
    progress: number;    // current value
    completed: boolean;
    rewardXp: number;
    expiresAt: string;   // ISO Date
    meta: {
        type: 'chars' | 'notes' | 'links' | 'xp';
    };
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'legend' | 'special';
    bonusXp: number;
    condition: (data: LevelData) => boolean;
}

export interface GamificationSettings {
    xpPerChar: number;
    xpPerNote: number;
    streakBonus: number;
    // Phase 0 Extensions
    xpPerLink: number;
    linkFactor: number;
    xpPerMinuteReading: number;
    // Phase 1 Extensions
    excludedFolders: string; // 改行区切りの文字列として保存
    // Phase 3 Extensions
    enableEffects: boolean;
    debug: boolean;
}

export const DEFAULT_SETTINGS: GamificationSettings = {
    xpPerChar: 1,
    xpPerNote: 50,
    streakBonus: 100,
    xpPerLink: 10,
    linkFactor: 0.5,
    xpPerMinuteReading: 10,
    excludedFolders: '',
    enableEffects: true,
    debug: true,
}
