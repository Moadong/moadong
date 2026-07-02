# 자유태그 모바일 편집 페이지

`ClubInfoEditTabMobile`의 "자유태그" 항목을 탭하면 `activePage` state가 `'freeTags'`로 전환되어 `FreeTagEditPage`가 풀스크린으로 노출된다. 라우트 변경 없이 state 기반으로 서브뷰를 전환하는 패턴으로, `LinkEditPage`와 동일한 구조다.

## 태그 입력 UI

`initialTags` 배열 길이만큼 `EditField` 카드를 렌더링한다. 각 카드 내부에 `#` prefix와 단일 `<input>`(최대 5자)이 있으며, 값이 없을 때는 점선 배경 SVG(`DashedBgSvg`)가 표시된다.

점선 배경은 `DashedBoxBg` SVG를 `styled()`로 래핑해 사용한다. `preserveAspectRatio='none'`으로 가로 방향으로 늘어나며, 코너 아티팩트는 `stroke-dashoffset: 4` CSS 오버라이드로 완화한다.

## 저장 조건

`tags.join(',') !== initialTags.join(',')`으로 dirty 여부를 판단하며, 변경이 없으면 저장 버튼이 비활성화된다.

## 관련 코드

- `src/pages/AdminPage/tabs/ClubInfoEditTab/components/mobile/FreeTagEditPage/FreeTagEditPage.tsx` — 메인 서브페이지 컴포넌트
- `src/pages/AdminPage/tabs/ClubInfoEditTab/components/mobile/FreeTagEditPage/FreeTagEditPage.styles.ts` — `DashedBgSvg` styled component (점선 배경 SVG)
- `src/pages/AdminPage/components/editFields/EditField/EditField.tsx` — 카드 래퍼
