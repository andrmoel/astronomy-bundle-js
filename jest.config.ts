module.exports = {
  testEnvironment: 'node',
  roots: [
      '<rootDir>/app',
      '<rootDir>/packages',
  ],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@package/(.*)$': '<rootDir>/packages/$1',
  },
};
