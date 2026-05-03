# Header 컴포넌트 구조

`Header` 컴포넌트는 UI 렌더링만 담당하고, 비즈니스 로직은 전용 훅으로 분리되어 있다.

## 역할 분리

| 관심사 | 담당 |
|--------|------|
| 네비게이션 + 트래킹 | `useHeaderNavigation` |
| 렌더 조건 판단 (showOn/hideOn) | `useHeaderVisibility` |
| 스크롤 감지 | `useScrollDetection` |
| UI 렌더링 | `Header.tsx` |

## useHeaderVisibility

`showOn`, `hideOn` props를 받아 현재 디바이스에서 Header를 렌더링할지 결정한다.

```ts
const isVisible = useHeaderVisibility(showOn, hideOn);
if (!isVisible) return null;
```

- `hideOn`이 `showOn`보다 우선순위가 높다
- 내부에서 `useDevice`, `isInAppWebView`를 호출해 현재 디바이스 타입을 판단
- `DeviceType`은 `src/types/device.ts`에서 공통 관리

## useHeaderNavigation

네비게이션 이동과 Mixpanel 트래킹을 함께 처리한다. `handleMenuClose`를 통해 모바일 메뉴 닫기 트래킹도 담당.

## 관련 코드

- `src/components/common/Header/Header.tsx` — UI 렌더링
- `src/hooks/Header/useHeaderVisibility.ts` — 렌더 조건 훅
- `src/hooks/Header/useHeaderNavigation.ts` — 네비게이션 + 트래킹 훅
- `src/types/device.ts` — DeviceType 공통 타입
