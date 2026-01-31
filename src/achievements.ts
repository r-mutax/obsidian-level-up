import { LevelData, Badge } from './types';

export const BADGES: Badge[] = [
    // Level (5 stages: Bronze -> Diamond)
    { id: 'level-2', name: 'Beginner', description: 'Reach Level 2', icon: 'trophy', tier: 'bronze', bonusXp: 50, condition: (d) => d.level >= 2 },
    { id: 'level-5', name: 'Apprentice', description: 'Reach Level 5', icon: 'trophy', tier: 'silver', bonusXp: 100, condition: (d) => d.level >= 5 },
    { id: 'level-10', name: 'High Roller', description: 'Reach Level 10', icon: 'trophy', tier: 'gold', bonusXp: 500, condition: (d) => d.level >= 10 },
    { id: 'level-20', name: 'Expert', description: 'Reach Level 20', icon: 'trophy', tier: 'platinum', bonusXp: 1000, condition: (d) => d.level >= 20 },
    { id: 'level-50', name: 'Master', description: 'Reach Level 50', icon: 'trophy', tier: 'diamond', bonusXp: 5000, condition: (d) => d.level >= 50 },

    // Notes (6 stages: Bronze -> Master)
    { id: 'note-1', name: 'First Note', description: 'Create your first note', icon: 'file-text', tier: 'bronze', bonusXp: 50, condition: (d) => d.stats.notesCreated >= 1 },
    { id: 'note-10', name: 'Note Taker', description: 'Create 10 notes', icon: 'file-text', tier: 'silver', bonusXp: 100, condition: (d) => d.stats.notesCreated >= 10 },
    { id: 'note-50', name: 'Librarian', description: 'Create 50 notes', icon: 'file-text', tier: 'gold', bonusXp: 300, condition: (d) => d.stats.notesCreated >= 50 },
    { id: 'note-100', name: 'Archivist', description: 'Create 100 notes', icon: 'file-text', tier: 'platinum', bonusXp: 500, condition: (d) => d.stats.notesCreated >= 100 },
    { id: 'note-500', name: 'Knowledge Base', description: 'Create 500 notes', icon: 'file-text', tier: 'diamond', bonusXp: 2000, condition: (d) => d.stats.notesCreated >= 500 },
    { id: 'note-1000', name: 'Encyclopedia', description: 'Create 1000 notes', icon: 'file-text', tier: 'master', bonusXp: 5000, condition: (d) => d.stats.notesCreated >= 1000 },

    // Streak (7 stages: Bronze -> Legend)
    { id: 'streak-3', name: 'Consistency', description: '3 Days Streak', icon: 'flame', tier: 'bronze', bonusXp: 100, condition: (d) => d.streak >= 3 },
    { id: 'streak-7', name: 'On Fire', description: '7 Days Streak', icon: 'flame', tier: 'silver', bonusXp: 300, condition: (d) => d.streak >= 7 },
    { id: 'streak-14', name: 'Unstoppable', description: '14 Days Streak', icon: 'flame', tier: 'gold', bonusXp: 500, condition: (d) => d.streak >= 14 },
    { id: 'streak-30', name: 'Habit Builder', description: '30 Days Streak', icon: 'flame', tier: 'platinum', bonusXp: 1000, condition: (d) => d.streak >= 30 },
    { id: 'streak-60', name: 'Marathon', description: '60 Days Streak', icon: 'flame', tier: 'diamond', bonusXp: 2000, condition: (d) => d.streak >= 60 },
    { id: 'streak-100', name: 'Centurion', description: '100 Days Streak', icon: 'flame', tier: 'master', bonusXp: 5000, condition: (d) => d.streak >= 100 },
    { id: 'streak-365', name: 'Year of Power', description: '365 Days Streak', icon: 'sun', tier: 'legend', bonusXp: 10000, condition: (d) => d.streak >= 365 },

    // Chars (6 stages: Bronze -> Master)
    { id: 'char-1k', name: 'Scribbler', description: 'Write 1,000 characters', icon: 'feather', tier: 'bronze', bonusXp: 50, condition: (d) => d.stats.charsWritten >= 1000 },
    { id: 'char-10k', name: 'Author', description: 'Write 10,000 characters', icon: 'feather', tier: 'silver', bonusXp: 200, condition: (d) => d.stats.charsWritten >= 10000 },
    { id: 'char-50k', name: 'Novelist', description: 'Write 50,000 characters', icon: 'feather', tier: 'gold', bonusXp: 1000, condition: (d) => d.stats.charsWritten >= 50000 },
    { id: 'char-100k', name: 'Prolific', description: 'Write 100,000 characters', icon: 'feather', tier: 'platinum', bonusXp: 2000, condition: (d) => d.stats.charsWritten >= 100000 },
    { id: 'char-500k', name: 'Typewriter', description: 'Write 500,000 characters', icon: 'feather', tier: 'diamond', bonusXp: 5000, condition: (d) => d.stats.charsWritten >= 500000 },
    { id: 'char-1m', name: 'Millionaire', description: 'Write 1,000,000 characters', icon: 'feather', tier: 'master', bonusXp: 10000, condition: (d) => d.stats.charsWritten >= 1000000 },

    // Links (4 stages: Bronze -> Platinum)
    { id: 'link-10', name: 'Connector', description: 'Create 10 links', icon: 'link', tier: 'bronze', bonusXp: 100, condition: (d) => d.stats.linksCreated >= 10 },
    { id: 'link-50', name: 'Networker', description: 'Create 50 links', icon: 'link', tier: 'silver', bonusXp: 300, condition: (d) => d.stats.linksCreated >= 50 },
    { id: 'link-100', name: 'Spider', description: 'Create 100 links', icon: 'link', tier: 'gold', bonusXp: 500, condition: (d) => d.stats.linksCreated >= 100 },
    { id: 'link-500', name: 'Webmaster', description: 'Create 500 links', icon: 'link', tier: 'platinum', bonusXp: 2000, condition: (d) => d.stats.linksCreated >= 500 },

    // Events
    { id: 'event-cleaner', name: 'Cleaner', description: 'Delete your first note', icon: 'trash-2', tier: 'special', bonusXp: 50, condition: (d) => d.stats.notesDeleted >= 1 },
];

export function checkAchievements(data: LevelData): Badge[] {
    const newBadges: Badge[] = [];

    // Ensure stats exist
    if (!data.stats) {
        data.stats = {
            notesCreated: 0,
            notesDeleted: 0,
            linksCreated: 0,
            charsWritten: 0
        };
    }
    if (!data.earnedBadges) {
        data.earnedBadges = [];
    }

    for (const badge of BADGES) {
        if (!data.earnedBadges.includes(badge.id)) {
            if (badge.condition(data)) {
                newBadges.push(badge);
            }
        }
    }

    return newBadges;
}
