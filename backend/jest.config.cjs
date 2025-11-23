module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFiles: ['<rootDir>/tests/jest.setup.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/server.js',
    '!src/config/db.js',
  ],
};