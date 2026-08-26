/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-fixed-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
    '\\.(svg|png|jpg|jpeg|gif)$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    // vite-plugin-svgr의 `?react` 접미사는 transform 패턴(\.svg$)에 걸리지 않아
    // 별칭(^@/)보다 먼저 컴포넌트 스텁으로 보낸다
    '\\.svg\\?react$': '<rootDir>/jest.svgMock.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'], // text(콘솔 출력), lcov(Codecov용)
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // 소스 폴더
    '!src/**/*.d.ts', // 타입 선언 파일 제외
    '!src/**/index.ts', // index 파일 제외
  ],
};
