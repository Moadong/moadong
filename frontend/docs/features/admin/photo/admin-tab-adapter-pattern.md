# PhotoEditTab — AdminTabAdapter 패턴 적용

`refactor/#1840`에서 도입한 `AdminTabAdapter`를 PhotoEdit 탭에 적용.
데스크탑/모바일 분기를 각 탭 내부에서 처리하던 방식을 라우트 레벨로 이동.

## 적용 방식

`AdminRoutes.tsx`에서 `photo-edit` 라우트를 `AdminTabAdapter`로 감싸고,
`PhotoEditTab`(desktop)과 `PhotoEditTabMobile`(mobile)을 각각 주입.

```tsx
<Route
  path='photo-edit'
  element={
    <AdminTabAdapter
      desktop={<PhotoEditTab />}
      mobile={<PhotoEditTabMobile />}
    />
  }
/>
```

## 컴포넌트별 변경

**PhotoEditTab** (desktop-only)
- `useDevice`, `isMobile/isTablet` 분기 제거
- `PhotoEditTabMobile` import 제거

**PhotoEditTabMobile** (mobile-only, 독립화)
- props interface(`clubId`, `originalFeeds`) 제거
- `useOutletContext<ClubDetail>()`을 직접 호출해 데이터 취득

## 관련 코드

- `src/pages/AdminPage/AdminTabAdapter.tsx` — 디바이스 분기 어댑터
- `src/pages/AdminPage/AdminRoutes.tsx` — 라우트 정의
- `src/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTab.tsx` — 데스크탑 전용
- `src/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTabMobile.tsx` — 모바일 독립 컴포넌트
