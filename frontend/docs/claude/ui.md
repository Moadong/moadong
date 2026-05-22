# UI & 스타일

## 반응형 브레이크포인트

`src/styles/mediaQuery.ts`에 정의:

- mini_mobile: 375px
- mobile: 500px
- tablet: 700px
- laptop: 1280px
- Desktop: 1280px 초과 (기본값)

## 테마 시스템

테마는 `src/styles/theme/`에 colors, typography, transitions로 정의. styled-components `ThemeProvider`를 통해 접근.

## 애니메이션

- `framer-motion` 라이브러리로 페이지 전환, 모달, 제스처 등 애니메이션 구현
- `src/styles/theme/transitions.ts`에 공통 트랜지션 정의

## 캐러셀

- `swiper` 라이브러리로 이미지 슬라이더, 카드 캐러셀 구현

## 날짜 처리

- `date-fns` 라이브러리 사용 (Moment.js 대신)
- `formatRelativeDateTime` 유틸로 상대 시간 표시
- `react-datepicker` 컴포넌트로 날짜 입력
