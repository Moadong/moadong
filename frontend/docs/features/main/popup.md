# Popup — 다중 팝업 지원 구조

메인 페이지에서 노출되는 팝업 시스템. `PopupConfig` 배열로 여러 팝업을 관리하며, 첫 번째 eligible 팝업을 자동으로 표시한다.

## 구조

- `configs: PopupConfig[]`를 prop으로 받아, 조건을 통과하는 첫 번째 팝업을 표시
- 각 팝업은 독립적인 `storageKey` / `sessionKey`를 가짐
- `daysToHide: 0`으로 설정하면 "다시 보지 않기" 클릭 후에도 항상 재표시

## PopupConfig 필드

| 필드           | 타입                   | 설명                                     |
| -------------- | ---------------------- | ---------------------------------------- |
| `id`           | `string`               | Mixpanel `popupType` 값으로 사용         |
| `storageKey`   | `string`               | "다시 보지 않기" localStorage 키         |
| `sessionKey`   | `string`               | "닫기" sessionStorage 키                 |
| `daysToHide`   | `number?`              | 숨김 유지 일수 (기본 7, 0이면 항상 표시) |
| `image`        | `string`               | 팝업 이미지 경로                         |
| `mobileOnly`   | `boolean?`             | 모바일 전용 여부                         |
| `onImageClick` | `(trackEvent) => void` | 이미지 클릭 핸들러 (트래킹 포함)         |

## 새 팝업 추가 방법

1. `popupConfigs.ts`에 `PopupConfig` 객체 추가
2. `MainPage.tsx`의 `configs` 배열에 삽입 (앞에 넣을수록 우선 표시)

## 관련 코드

- `src/utils/popupUtils.ts` — `PopupConfig` 인터페이스, `isPopupHidden`, `DAYS_TO_HIDE`
- `src/pages/MainPage/components/Popup/Popup.tsx` — 팝업 렌더링 컴포넌트
- `src/pages/MainPage/components/Popup/popupConfigs.ts` — 팝업 config 정의 (`APP_DOWNLOAD_POPUP`)
- `src/pages/MainPage/components/Popup/Popup.test.tsx` — `isPopupHidden` 유틸 테스트
