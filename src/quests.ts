import { LevelData, Quest } from './types';
import { Notice } from 'obsidian';

export function generateDailyQuests(data: LevelData): LevelData {
    // Check if quests are already generated for today
    const today = new Date().toISOString().split('T')[0];
    if (data.lastQuestGenDate === today) {
        return data; // No changes
    }

    // Generate 3 random quests
    const newQuests: Quest[] = [];
    const questTypes = ['chars', 'notes', 'links', 'xp'] as const;
    const expiresAt = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(); // +1 day (approx)

    for (let i = 0; i < 3; i++) {
        const type = questTypes[Math.floor(Math.random() * questTypes.length)];
        const id = `daily-${today}-${i}`;

        // Ensure unique types in one day if possible, or just allow random
        // Simpler for now: just random

        let description = '';
        let target = 0;
        let rewardXp = 0;

        switch (type) {
            case 'chars':
                // User requested max 400 chars
                // Generate between 100 and 400 chars
                target = Math.floor(Math.random() * 4 + 1) * 100; // 100, 200, 300, 400
                description = `Write ${target} characters`;
                rewardXp = Math.floor(target / 10);
                break;
            case 'notes':
                target = Math.floor(Math.random() * 3 + 1); // 1 - 3 notes
                description = `Create ${target} new notes`;
                rewardXp = target * 50;
                break;
            case 'links':
                target = Math.floor(Math.random() * 5 + 1); // 1 - 5 links
                description = `Add ${target} internal links`;
                rewardXp = target * 20;
                break;
            case 'xp':
                target = Math.floor(Math.random() * 5 + 1) * 100; // 100 - 500 XP
                description = `Gain ${target} XP`;
                rewardXp = Math.floor(target / 5);
                break;
        }

        newQuests.push({
            id,
            type: 'daily',
            description,
            target,
            progress: 0,
            completed: false,
            rewardXp,
            expiresAt,
            meta: { type }
        });
    }

    // Keep active weekly quests? Or just replace dailies
    // For now, simple implementation: just reset quests daily
    // Ideally we should filter out expired ones and append new ones, but clearing old dailies is fine.

    // Filter out previous DAILY quests, keep others if implemented in future
    const otherQuests = (data.quests || []).filter(q => q.type !== 'daily');

    return {
        ...data,
        quests: [...otherQuests, ...newQuests],
        lastQuestGenDate: today
    };
}

export function updateQuestProgress(data: LevelData, type: 'chars' | 'notes' | 'links' | 'xp', amount: number): { data: LevelData, completedQuests: Quest[] } {
    let updated = false;
    const completedQuests: Quest[] = [];

    const newQuests = (data.quests || []).map(quest => {
        if (!quest.completed && quest.meta.type === type) {
            const newProgress = Math.min(quest.progress + amount, quest.target);

            if (newProgress !== quest.progress) {
                updated = true;
                const wasCompleted = quest.completed;
                const isCompleted = newProgress >= quest.target;

                if (isCompleted && !wasCompleted) {
                    completedQuests.push(quest);
                }

                return {
                    ...quest,
                    progress: newProgress,
                    completed: isCompleted
                };
            }
        }
        return quest;
    });

    if (updated) {
        return {
            data: { ...data, quests: newQuests },
            completedQuests
        };
    }

    return { data, completedQuests: [] };
}
