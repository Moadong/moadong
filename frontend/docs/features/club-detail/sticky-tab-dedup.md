# 상세 페이지 탭 이중 노출 해결

상세 페이지 스크롤 시 인라인 탭과 헤더 sticky 탭이 동시에 보이는 문제를 수정한다.

## 문제

`ClubDetailPage`에는 탭 UI가 두 곳에 있다.

- **인라인 탭** (`RightSection` 내 `UnderlineTabs`): 콘텐츠 흐름 속에 위치
- **헤더 sticky 탭** (`ClubDetailTopBar` 내 `TabBar`): 스크롤 후 상단 고정

기존에는 `ClubDetailTopBar`가 내부적으로 `useScrollTrigger(360px)`로 sticky 탭 표시를 결정했다. 360px은 임의의 고정값이라 화면이 큰 기기에서 두 탭이 동시에 노출되는 구간이 생겼다.

## 해결

`IntersectionObserver`로 인라인 탭 요소가 TopBar 뒤로 잘리는 시점을 감지해 두 탭을 정확히 교체한다.

```
인라인 탭 요소 상단이 TopBar(73px) 아래로 잘리기 시작
  → showStickyTabs = true
  → ClubDetailTopBar: showTabs prop으로 헤더 탭 표시
  → InlineTabsWrapper: visibility: hidden으로 인라인 탭 숨김
```

`visibility: hidden`을 사용해 인라인 탭의 레이아웃 공간을 유지하며 숨긴다. (`display: none`이면 레이아웃이 밀림)

## 구조 변경

탭 표시 타이밍 결정 책임이 `ClubDetailTopBar` → `ClubDetailPage`로 이동했다.

- `ClubDetailTopBar`: `showTabs` prop을 받아 렌더링만 담당
- `ClubDetailPage`: `IntersectionObserver`로 타이밍 결정 후 prop으로 전달

### DOM 마운트 타이밍 문제

`clubDetail` 로드 전엔 컴포넌트가 `null`을 반환해 인라인 탭 DOM이 없다. `useRef`는 ref가 채워져도 effect를 재실행하지 않으므로 관찰자가 등록되지 않는 경우가 생긴다. DOM 요소를 `useState`로 관리(callback ref 패턴)하면 마운트 시 state 변경으로 effect가 정확히 재실행된다.

```ts
const [inlineTabsEl, setInlineTabsEl] = useState<HTMLDivElement | null>(null);

useEffect(() => {
  if (!showTopBar || !inlineTabsEl) return;
  const observer = new IntersectionObserver(
    ([entry]) => setShowStickyTabs(!entry.isIntersecting),
    { rootMargin: '-73px 0px 0px 0px', threshold: 1 },
  );
  observer.observe(inlineTabsEl);
  return () => observer.disconnect();
}, [showTopBar, inlineTabsEl]);

// JSX
<Styled.InlineTabsWrapper ref={setInlineTabsEl} $hidden={showTopBar && showStickyTabs}>
```

## 관련 코드

- `src/pages/ClubDetailPage/ClubDetailPage.tsx` — IntersectionObserver 로직, showStickyTabs 상태
- `src/pages/ClubDetailPage/ClubDetailPage.styles.ts` — `InlineTabsWrapper` (visibility 제어)
- `src/pages/ClubDetailPage/components/ClubDetailTopBar/ClubDetailTopBar.tsx` — `showTabs` prop 수신
