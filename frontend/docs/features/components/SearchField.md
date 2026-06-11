# SearchField — 고정 너비 제거 및 외부 제어 가능하도록 개선

`SearchField` 컴포넌트에서 `max-width` 고정값을 제거하고, `style` prop으로 외부에서 너비를 제어할 수 있도록 개선했다.

기존에는 컴포넌트 내부 스타일에 `max-width: 345px` (mobile: `255px`)가 하드코딩되어 있어 다른 컨텍스트에서 재사용할 때 너비 조정이 불가능했다.

변경 후에는 너비 제약이 필요한 사용처(`SearchBox`)에서 `SearchBoxWrapper` styled component로 감싸 직접 관리하고, 어드민(`ApplicantsTab`)처럼 레이아웃에 맞게 늘어나야 하는 경우는 별도 처리 없이 `width: 100%`로 동작한다.

## 관련 코드

- `src/components/common/SearchField/SearchField.tsx` — `style` prop 추가, `className` 제외
- `src/components/common/SearchField/SearchField.styles.ts` — `max-width` 고정값 제거
- `src/pages/MainPage/components/SearchBox/SearchBox.styles.ts` — `SearchBoxWrapper` (max-width 반응형) 신규 생성
- `src/pages/MainPage/components/SearchBox/SearchBox.tsx` — `SearchBoxWrapper`로 감싸도록 수정
