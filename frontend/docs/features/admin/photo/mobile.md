# PhotoEditTab 모바일 UI

모바일/태블릿 환경에서 활동 사진을 편집하는 페이지.
`AdminTabAdapter`가 디바이스를 감지해 `PhotoEditTabMobile`을 렌더링한다.

## 구조

`AdminRoutes` → `AdminTabAdapter` → (mobile) `PhotoEditTabMobile`

`useOutletContext<ClubDetail>()`로 클럽 데이터를 직접 수신하며,
`useFeedItems`, `useDragSort` 훅을 독립적으로 호출한다.

### 화면 구성

| 영역 | 조건 | 설명 |
|---|---|---|
| `UploadSection` | `!isFull` | 사진 추가 카드 및 안내 문구 |
| `GridSection` | `hasPhotos` | 업로드된 사진 그리드 (3열) |

- `PhotoUploadCard`: 현재 사진 수와 최대 수 표시, 클릭 시 파일 선택
- `FeedImageGrid`: 드래그 정렬, 개별 삭제, 업로드 실패 재시도 지원

## MobileSaveButtonArea (공통)

- `isLoading || !pendingChanges`일 때 비활성화
- 변경사항이 있을 때만 저장 가능

## 관련 코드

- `src/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTabMobile.tsx` — 모바일 메인 컴포넌트
- `src/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTabMobile.styles.ts` — 스타일
- `src/pages/AdminPage/tabs/PhotoEditTab/hooks/useFeedItems.ts` — 사진 목록 상태/저장 로직
- `src/pages/AdminPage/tabs/PhotoEditTab/hooks/useDragSort.ts` — 드래그 정렬
- `src/pages/AdminPage/tabs/PhotoEditTab/components/mobile/PhotoUploadCard/` — 업로드 카드
- `src/pages/AdminPage/components/MobileSaveButtonArea/` — 하단 저장 버튼 (공통)
