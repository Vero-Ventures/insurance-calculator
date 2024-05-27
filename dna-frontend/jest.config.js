module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: [
    '**/jest_tests/**.test.ts', 
    '**/jest_tests/**/**.test.ts',
    'src/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 20000,
};
