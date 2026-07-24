# ApplicationFormList 년도별 그룹핑

지원서 목록 화면에서 지원서를 년도별로 분류해 표시하는 구조.

## 구조

- **게시된 지원서 섹션**: `status === 'ACTIVE'`인 지원서만 모아 상단에 핀 고정
- **년도 그룹 섹션**: `semesterYear` 기준으로 그룹핑, 활성/비활성 전부 표시

## API 응답 구조와 프론트 처리

API는 `ApplicationFormGroup[]`를 내려주는데, 같은 `semesterYear`라도 `active: true / false`로 분리된 두 그룹이 올 수 있다.

```ts
// API 응답 예시
[
  { semesterYear: 2026, active: true,  forms: [...] },
  { semesterYear: 2026, active: false, forms: [...] },
]
```

프론트에서 `Map<number, ApplicationFormItem[]>`으로 머지해 같은 년도를 하나의 그룹으로 합친다.
`Number()` 변환으로 타입 불일치(`string` vs `number`) 방어.

```ts
const yearMap = new Map<number, ApplicationFormItem[]>();
formGroups.forEach((group) => {
  const year = Number(group.semesterYear);
  const existing = yearMap.get(year) ?? [];
  yearMap.set(year, [...existing, ...group.forms]);
});
```

## UI 텍스트 규칙

- "게시/미게시" 대신 "활성화/비활성화" 용어 사용 (모바일 디자인 통일)
- 컨텍스트 메뉴: `지원서 활성화` / `지원서 비활성화`

## 관련 코드

- `src/pages/AdminPage/components/ApplicationFormList/ApplicationFormList.tsx` — 목록 렌더링, 년도별 머지 로직
- `src/pages/AdminPage/components/ApplicationFormContextMenu/ApplicationFormContextMenu.tsx` — ... 메뉴 (데스크탑·모바일 공용)
- `src/pages/AdminPage/tabs/ApplicationTab/ApplicationListTab/ApplicationListTab.styles.ts` — 스타일
- `src/hooks/Queries/useApplication.ts` — `useGetApplicationList`, 상태 변경 뮤테이션
