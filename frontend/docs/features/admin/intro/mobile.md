# ClubIntroEditTab 모바일 UI

모바일/태블릿 환경에서 동아리 상세 정보를 편집하는 페이지.
`ClubIntroEditTab`에서 `useDevice`로 분기해 렌더링된다.

## 구조

`ClubIntroEditTab` → `useDevice` 분기 → `ClubIntroEditTabMobile`

상태 관리는 `useClubIntroEdit` 훅에서 담당하며, 데스크톱과 모바일이 동일한 훅을 공유한다.

### useClubIntroEdit

- `useOutletContext`로 `ClubDetail` 수신
- `isDirty`: 초기값과 비교해 변경 여부 감지 → 저장 버튼 활성화 제어
- `handleUpdateClub`: 전체 필드 일괄 저장

### ClubIntroEditTabMobile 섹션 구성

| 섹션 | 컴포넌트 | 최대 글자 |
|---|---|---|
| 동아리를 소개할게요 | `InfoSection` | 300자 |
| 이런 활동을 해요 | `InfoSection` | 300자 |
| 이런 상을 받았어요 | `AwardSection` | — |
| 이런 사람이 오면 좋아요 | `InfoSection` | 300자 |
| 부원이 되면 이런 혜택이 있어요 | `InfoSection` | 300자 |
| 자주 묻는 질문(FAQ) | `FAQSection` | 질문 100 / 답변 300 |

## 컴포넌트 동작 상세

### AwardSection

- 레이블은 수상 이력 유무에 관계없이 항상 `이런 상을 받았어요`로 고정
- 수상 이력이 없으면 빈 카드, 있으면 학기별 목록 + NavButton 표시

### FAQSection

- 글자수 카운터는 `AnswerWrapper` 하단에 항상 표시 (입력 여부 무관)
- 표시 형식: `질문: {n}/100 | 답변: {n}/300`
- 질문·답변 textarea 모두 `useAutoGrow` 훅으로 자동 높이 조절

### FixedBottomButtonArea (공통)

- 버튼 영역 자체는 배경 투명, `box-shadow` 없음
- `box-shadow`는 button 요소에만 적용 (`0px 0px 8px rgba(0,0,0,0.1)`)
- 변경사항 없을 때 버튼 비활성화, 변경 시 활성화 (`isDirty` 제어)

## 관련 코드

- `src/pages/AdminPage/tabs/ClubIntroEditTab/ClubIntroEditTabMobile.tsx` — 모바일 메인 컴포넌트
- `src/pages/AdminPage/tabs/ClubIntroEditTab/ClubIntroEditTabMobile.styles.ts` — 스타일
- `src/pages/AdminPage/tabs/ClubIntroEditTab/hooks/useClubIntroEdit.ts` — 상태/저장 로직
- `src/pages/AdminPage/tabs/ClubIntroEditTab/components/mobile/InfoSection/` — 텍스트 입력 섹션
- `src/pages/AdminPage/tabs/ClubIntroEditTab/components/mobile/AwardSection/` — 수상 내역 섹션
- `src/pages/AdminPage/tabs/ClubIntroEditTab/components/mobile/FAQSection/` — FAQ 편집 섹션
- `src/components/common/FixedBottomButtonArea/` — 하단 고정 버튼 영역 (공통)
