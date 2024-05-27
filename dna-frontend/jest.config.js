module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['**/jest_tests/**.test.ts', '**/jest_tests/**/**.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
