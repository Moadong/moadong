# ClubInfoEditTab 모바일 UI

모바일/태블릿 환경에서 동아리 기본 정보를 편집하는 페이지.
`AdminTabAdapter`가 디바이스를 감지해 `ClubInfoEditTabMobile`을 렌더링한다.

## 구조

`AdminRoutes` → `AdminTabAdapter` → (mobile) `ClubInfoEditTabMobile`

상태 관리는 `useClubInfoEdit` 훅에서 담당하며, 데스크탑과 모바일이 동일한 훅을 공유한다.

### 페이지 전환 구조

메인 페이지에서 특정 필드 진입 시 서브 페이지로 전환된다 (`activePage` 상태로 제어).

| activePage | 렌더 컴포넌트 | 설명 |
|---|---|---|
| `main` | — | 기본 정보 편집 메인 |
| `freeTags` | `FreeTagEditPage` | 자유태그 편집 |
| `links` | `LinkEditPage` | SNS 링크 편집 |

### 모바일 서브 컴포넌트

- **`MobileBannerSection`**: 커버/로고 이미지 편집 영역
- **`FreeTagEditPage`**: 자유태그 추가/삭제 전용 페이지
- **`LinkEditPage`**: Instagram·YouTube 링크 입력 전용 페이지

## FixedBottomButtonArea (공통)

- 버튼 영역 자체는 배경 투명, `box-shadow` 없음
- `box-shadow`는 button 요소에만 적용 (`0px 0px 8px rgba(0,0,0,0.1)`)
- 변경사항 없을 때 버튼 비활성화, 변경 시 활성화 (`isDirty` 제어)

## 관련 코드

- `src/pages/AdminPage/tabs/ClubInfoEditTab/ClubInfoEditTabMobile.tsx` — 모바일 메인 컴포넌트
- `src/pages/AdminPage/tabs/ClubInfoEditTab/ClubInfoEditTabMobile.styles.ts` — 스타일
- `src/pages/AdminPage/tabs/ClubInfoEditTab/hooks/useClubInfoEdit.ts` — 상태/저장 로직
- `src/pages/AdminPage/tabs/ClubInfoEditTab/components/mobile/MobileBannerSection/` — 배너 섹션
- `src/pages/AdminPage/tabs/ClubInfoEditTab/components/mobile/FreeTagEditPage/` — 자유태그 편집
- `src/pages/AdminPage/tabs/ClubInfoEditTab/components/mobile/LinkEditPage/` — SNS 링크 편집
- `src/components/common/FixedBottomButtonArea/` — 하단 고정 버튼 영역 (공통)
