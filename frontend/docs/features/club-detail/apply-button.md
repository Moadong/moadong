# 동아리 상세 지원하기 버튼 구조

## 구조

`ClubApplyButton`이 지원하기 흐름 전체를 담당한다. 별도 래퍼 없이 `ClubDetailPage`, `LegacyClubDetailPage`에서 직접 호출.

```
ClubDetailPage
└── <ClubApplyButton />
    ├── useGetClubDetail — clubDetail fetch (recruitmentStatus, deadlineText 계산 포함)
    ├── FixedBottomButtonArea — 반응형 하단 고정 영역
    └── ApplicationSelectModal — 지원서 선택 모달
```

## 주요 로직

- `deadlineText`: `clubDetail`의 `recruitmentStart`, `recruitmentEnd`, `recruitmentStatus`로 내부 계산
- 모집 상태별 버튼 텍스트 분기: `CLOSED`/`UPCOMING` → deadlineText만 표시, `OPEN` → "지원하기 | 마감일"
- 지원서 1개: 바로 이동, 2개 이상: `ApplicationSelectModal` 표시
- 외부 지원서(`EXTERNAL`): `externalApplicationUrl`로 외부 링크 이동

## 제거된 것

- `ShareButton` — `FloatingButtonGroup`의 공유 버튼으로 통합
- `ClubDetailFooter` — 의미 없는 래퍼였으므로 제거, `deadlineText` 계산을 `ClubApplyButton` 내부로 이동

## 관련 코드

- `src/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton.tsx` — 지원하기 전체 로직
- `src/components/common/FixedBottomButtonArea/FixedBottomButtonArea.tsx` — 하단 버튼 영역
