# GamePage 레이아웃 및 DotTextEffect 인터랙션 개선

## 레이아웃 구조

`TopRow`를 3-column grid(`1fr auto 1fr`)로 구성하여 타이틀을 절대 중앙에 고정하고 순위표를 오른쪽 끝에 배치.
DotTextEffect는 전체 너비 가운데, 클릭 버튼은 하단(`marginTop: 40px`)에 위치.

```
┌─────────────────────────────────────────────┐
│  [빈 공간]   동아리 클릭 배틀   [실시간 순위] │
│                                             │
│           [  개 발 팀  (DotText) ]          │
│                                             │
│                 [클릭! 버튼]                │
└─────────────────────────────────────────────┘
```

## DotTextEffect 색상 Ripple

마우스 커서 주변 `colorRadius(= hoverRadius * 1.8)` 범위 내 dot들이 거리 비례로 색상이 물드는 효과.

- 파워 커브 `Math.pow(dist / colorRadius, 2.5)` 적용 → 중심만 진하고 바깥은 급격히 회색으로
- 각 dot에 `charColors` 중 랜덤 색상 미리 배정 (글자 단위 → dot 단위 랜덤)
- `hoverRadius: 18`, `dotR: 1.8` (겹침 방지)

## 관련 코드

- `src/pages/GamePage/GamePage.tsx` — 레이아웃 구조 (TopRow, DotTextEffect 중앙, 버튼 하단)
- `src/pages/GamePage/GamePage.styles.ts` — TopRow grid 스타일
- `src/pages/GamePage/components/DotTextEffect/DotTextEffect.tsx` — 색상 ripple 및 랜덤 색상 로직
- `src/pages/GamePage/components/RankingBoard/RankingBoard.styles.ts` — Header column 방향 변경
- `src/pages/GamePage/components/ClickButton/ClickButton.styles.ts` — ClubLabel 말줄임 처리
