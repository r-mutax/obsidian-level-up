import { calculateNextLevelXp, addXp } from '../gamification';
import { LevelData, DEFAULT_DATA } from '../types';

describe('Gamification Logic', () => {
    let mockData: LevelData;

    beforeEach(() => {
        mockData = { ...DEFAULT_DATA };
    });

    test('calculateNextLevelXp should return correct values', () => {
        expect(calculateNextLevelXp(1)).toBe(100);
        // 100 * 2^1.5 = 100 * 2.828 = 282
        expect(calculateNextLevelXp(2)).toBe(282);
    });

    test('addXp should increase currentXp', () => {
        const result = addXp(mockData, 50);
        expect(result.data.currentXp).toBe(50);
        expect(result.leveledUp).toBe(false);
    });

    test('addXp should trigger level up', () => {
        // Lv 1, Next 100
        const result = addXp(mockData, 120);
        expect(result.data.level).toBe(2);
        expect(result.data.currentXp).toBe(20); // 120 - 100
        expect(result.leveledUp).toBe(true);
    });

    test('addXp should trigger multiple level ups', () => {
        // Lv 1 (100xp needed) -> Lv 2 (282xp needed)
        // Total 382xp needed for Lv 3
        const result = addXp(mockData, 500);
        expect(result.data.level).toBe(3);
        expect(result.leveledUp).toBe(true);
    });
});
