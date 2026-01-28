import { DEFAULT_DATA } from '../src/types';
import { calculateNextLevelXp, addXp } from '../src/gamification';

describe('Gamification Logic', () => {
    test('calculateNextLevelXp follows exponential curve', () => {
        expect(calculateNextLevelXp(1)).toBe(100);
        // 100 * 2^1.5 = 100 * 2.828 = 282
        expect(calculateNextLevelXp(2)).toBe(282);
    });

    test('addXp increments XP and detects level up', () => {
        let data = { ...DEFAULT_DATA };
        expect(data.level).toBe(1);
        expect(data.currentXp).toBe(0);

        const result = addXp(data, 50);
        expect(result.data.currentXp).toBe(50);
        expect(result.leveledUp).toBe(false);

        const levelUpResult = addXp(data, 60); // Total 110, needs 100 for lvl 1->2
        expect(levelUpResult.leveledUp).toBe(true);
        expect(levelUpResult.data.level).toBe(2);
        // 110 - 100 = 10
        expect(levelUpResult.data.currentXp).toBe(10);
        expect(levelUpResult.data.nextLevelXp).toBe(282);
    });
});
