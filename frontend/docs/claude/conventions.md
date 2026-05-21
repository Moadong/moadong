# 코딩 컨벤션

## 네이밍

- 변수, 함수: camelCase
- 컴포넌트, 타입: PascalCase
- 파일명: 컴포넌트는 PascalCase.tsx, 유틸은 camelCase.ts
- 상수: UPPER_SNAKE_CASE

## Import 순서

외부 라이브러리 → 내부 모듈 → 타입 → 스타일

## 스타일

- styled-components 사용, 테마 시스템 활용
- `any` 금지, 명시적 타입 정의
- 상수는 `src/constants/`에서 관리

## Mixpanel 이벤트 트래킹

- 이벤트명은 `src/constants/eventName.ts`의 `USER_EVENT`에서 관리
- 문자열 하드코딩 금지
- sessionStorage 키는 `page + id` 스코프로 작성
