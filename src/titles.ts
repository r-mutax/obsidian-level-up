export interface Title {
    minLevel: number;
    name: string;
    avatar: string; // Emoji or Icon name
}

export const TITLES: Title[] = [
    { minLevel: 1, name: 'Novice', avatar: '🌱' },
    { minLevel: 10, name: 'Apprentice', avatar: '🌿' },
    { minLevel: 20, name: 'Adept', avatar: '🌳' },
    { minLevel: 40, name: 'Expert', avatar: '🧙‍♂️' },
    { minLevel: 60, name: 'Master', avatar: '👑' },
    { minLevel: 100, name: 'Legend', avatar: '🐲' }
];

export function getTitle(level: number): Title {
    // Find the highest title where level >= minLevel
    let currentTitle = TITLES[0];
    for (const title of TITLES) {
        if (level >= title.minLevel) {
            currentTitle = title;
        } else {
            break;
        }
    }
    return currentTitle;
}

export function getNextTitle(level: number): Title | null {
    for (const title of TITLES) {
        if (level < title.minLevel) {
            return title;
        }
    }
    return null;
}
