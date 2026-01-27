/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^obsidian$': '<rootDir>/test-helpers/obsidian-mock.ts',
    },
};
