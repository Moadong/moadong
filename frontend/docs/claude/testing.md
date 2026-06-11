# 테스트 & Storybook

## 테스트

- Jest + React Testing Library
- MSW로 API 모킹
- 테스트 파일은 `*.test.ts` 또는 `*.test.tsx` 형식
- 커버리지 리포트: `npm run coverage`
- 단일 파일 실행: `npx jest path/to/file.test.ts`

## MSW (Mock Service Worker)

`src/mocks/`에서 API 모킹 관리:

- `handlers/` - 도메인별 모킹 핸들러
- `browser.ts` - MSW 브라우저 워커 설정
- Storybook 및 개발 환경에서 사용

## Storybook

- 컴포넌트 독립 개발 환경 (포트 6006)
- MSW addon으로 API 모킹 지원
- Chromatic으로 시각적 회귀 테스트
