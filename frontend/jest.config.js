/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-fixed-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
    '\\.(svg|png|jpg|jpeg|gif)$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'], // text(콘솔 출력), lcov(Codecov용)
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // 소스 폴더
    '!src/**/*.d.ts', // 타입 선언 파일 제외
    '!src/**/index.ts', // index 파일 제외
  ],
};
