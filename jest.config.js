/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: [
        "**/__tests__/**/*.test.ts",
        "**/tests/**/*.test.ts"
    ],
    moduleNameMapper: {
        '^obsidian$': '<rootDir>/test-helpers/obsidian-mock.js',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
            },
        ],
    },
};
