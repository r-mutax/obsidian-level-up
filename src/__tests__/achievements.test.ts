import { checkAchievements } from '../achievements';
import { LevelData, DEFAULT_DATA } from '../types';

describe('Achievements System', () => {
    let mockData: LevelData;

    beforeEach(() => {
        mockData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        mockData.stats = {
            notesCreated: 0,
            notesDeleted: 0,
            linksCreated: 0,
            charsWritten: 0
        };
        mockData.earnedBadges = [];
    });

    test('should unlock Beginner badge at level 2', () => {
        mockData.level = 2;
        const newBadges = checkAchievements(mockData);
        expect(newBadges).toHaveLength(1);
        expect(newBadges[0].id).toBe('level-2');
        expect(newBadges[0].name).toBe('Beginner');
    });

    test('should not unlock badge if requirement not met', () => {
        mockData.level = 1;
        const newBadges = checkAchievements(mockData);
        expect(newBadges).toHaveLength(0);
    });

    test('should unlock Note Taker badge at 10 notes', () => {
        mockData.stats.notesCreated = 10;
        const newBadges = checkAchievements(mockData);
        expect(newBadges).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 'note-10' })
            ])
        );
    });

    test('should not return already earned badges', () => {
        mockData.level = 2;
        mockData.earnedBadges = ['level-2'];
        const newBadges = checkAchievements(mockData);
        expect(newBadges).toHaveLength(0);
    });

    test('should unlock multiple badges at once', () => {
        mockData.level = 10;
        const newBadges = checkAchievements(mockData);
        // Level 2, 5, 10
        expect(newBadges.map(b => b.id)).toEqual(expect.arrayContaining(['level-2', 'level-5', 'level-10']));
    });

    test('should unlock Streak badges', () => {
        mockData.streak = 7;
        const newBadges = checkAchievements(mockData);
        // 3 days, 7 days
        expect(newBadges.map(b => b.id)).toEqual(expect.arrayContaining(['streak-3', 'streak-7']));
    });

    test('should unlock Cleaner badge on first delete', () => {
        mockData.stats.notesDeleted = 1;
        const newBadges = checkAchievements(mockData);
        expect(newBadges[0].id).toBe('event-cleaner');
    });
});
