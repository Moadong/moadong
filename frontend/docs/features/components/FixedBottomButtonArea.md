# FixedBottomButtonArea — 하단 고정 버튼 영역 공통 컴포넌트

어드민 저장하기 버튼과 동아리 상세 지원하기 버튼을 통일하기 위해 도입한 공통 컴포넌트.
투명 배경 영역 위에 공통 `Button` 컴포넌트를 올려 렌더링한다.

## 브레이크포인트별 동작

| 환경 | position | 너비 | 크기 |
|---|---|---|---|
| 데스크탑 (>700px) | `sticky; bottom: 0` | 버튼 517px, 중앙 정렬 | 60px 높이 |
| 태블릿 (≤700px) | `fixed; bottom: 0` | `max-width: 500px`, 센터 정렬 | 50px 높이 |
| 모바일 (≤500px) | `fixed; bottom: 0` | 전체 너비 | 50px 높이 |

데스크탑에서 `position: sticky`를 사용하는 이유: `fixed`로 하면 글로벌 Footer와 겹침.
태블릿에서 `max-width: 500px`을 사용하는 이유: 어드민 모바일 컨테이너 너비(`500px`)와 일치시켜 콘텐츠 영역 이탈 방지.

## 사용처

- `AdminPage` 모바일 탭 저장하기 버튼 (4곳)
- `ClubDetailPage` 지원하기 버튼 (`ClubApplyButton`)

## 관련 코드

- `src/components/common/FixedBottomButtonArea/FixedBottomButtonArea.tsx` — 컴포넌트
- `src/components/common/FixedBottomButtonArea/FixedBottomButtonArea.styles.ts` — 브레이크포인트별 스타일
