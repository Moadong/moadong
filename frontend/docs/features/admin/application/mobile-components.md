# 지원서 관리 모바일 공통 컴포넌트

모바일 지원서 관리 화면에서 재사용되는 공통 UI 컴포넌트 모음.

## ApplicationFormContextMenu

`...` 버튼 클릭 시 나타나는 컨텍스트 메뉴. 데스크탑·모바일 공용.

- 너비: 170px, 높이: 110px, border-radius 10px, box-shadow `0px 1px 8px rgba(0,0,0,0.12)`
- 위치: `top: 60%; right: 8px` (버튼을 절반 정도 가리도록 겹침)
- 항목: 지원서 활성화/비활성화 토글, 수정하기 (optional), 복제하기 (optional), 삭제
- `onEdit`·`onDuplicate`는 optional — 전달하지 않으면 해당 항목 미노출

```tsx
<ApplicationFormContextMenu
  isActive={isActive}
  onToggleStatus={handleToggle}
  onEdit={handleEdit}          // optional: 수정하기
  onDuplicate={handleDuplicate} // optional: 복제하기
  onDelete={handleDelete}
/>
```

## ApplicationCardMobile

활성화 탭에 표시되는 지원서 카드 (모바일 전용).

- 너비: 335px, 높이: 73px, border-radius 14px
- 활성화 상태: 오렌지 도트(10px) + 오렌지 제목 (primary[900])
- 비활성화 상태: 회색 제목 (gray[800])
- `uniqueKeyPrefix="active"` 로 메뉴 키 중복 방지

## ApplicationListCardMobile

년도별 그룹 내 개별 지원서 카드 (모바일 전용).

- 너비: 335px, border-radius 14px
- 상단에 년도 헤더 + 구분선, 하단에 제목·날짜·메뉴 버튼
- 년도 헤더 클릭 시 `onNavigate` 호출
- `uniqueKeyPrefix="list"` 로 메뉴 키 중복 방지

## ApplicationTypeTab

모아동 / 외부 지원서 유형 탭 (모바일 전용, ApplicationEditTab에서 사용).

- 너비: 335px, 높이: 52px, border-radius 14px
- `ApplicationFormMode.INTERNAL` → '모아동 지원서'
- `ApplicationFormMode.EXTERNAL` → '외부 지원서'
- 활성 탭: 흰 배경 + box-shadow, 비활성 탭: 투명

## ApplicationFAB

새 지원서 만들기 플로팅 버튼 (모바일 전용).

- 48px 원형, background `primary[900]` (#FF5414)
- 화면 우하단 고정 (`position: fixed`), safe-area-inset-bottom 적용

## 관련 코드

- `src/pages/AdminPage/components/ApplicationFormContextMenu/` — 데스크탑·모바일 공용 컨텍스트 메뉴
- `src/pages/AdminPage/tabs/ApplicationTab/ApplicationListTab/components/mobile/ApplicationCardMobile/` — 활성화 탭 카드
- `src/pages/AdminPage/tabs/ApplicationTab/ApplicationListTab/components/mobile/ApplicationListCardMobile/` — 년도별 목록 카드
- `src/pages/AdminPage/tabs/ApplicationTab/ApplicationEditTab/components/mobile/ApplicationTypeTab/` — 유형 탭
