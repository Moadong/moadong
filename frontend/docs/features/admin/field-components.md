# 관리자 설정 편집 필드 공통 컴포넌트

관리자 설정 화면(기본정보 편집, 자유태그 편집, 링크 추가)의 모바일 편집 UI에서 공통으로 사용하는 필드 컴포넌트 시스템.

## 설계 패턴

**Presentational & Container 패턴** 적용.

- Container: 각 탭 페이지 (API 호출, 상태 관리, 핸들러 정의)
- Presentational: 필드 컴포넌트들 (props만 받아 UI 렌더링)

SOLID 원칙:
- **S**: EditField는 카드 껍데기, TextField는 텍스트 입력, NavField는 네비게이션 표시로 역할 분리
- **O**: EditField의 `children`으로 새로운 필드 타입을 추가할 때 EditField 수정 불필요
- **I**: 각 컴포넌트가 필요한 props만 수신
- **D**: onChange, onClear, onNavigate 등 핸들러를 Container(페이지)에서 주입

## 컴포넌트 구조

### EditField (기반 컴포넌트)

모든 필드가 공유하는 카드 껍데기. `label`과 `children`을 받아 렌더링. 재사용이 없는 일회성 필드(분과 토글, 자유태그 입력, 링크 입력 등)는 별도 컴포넌트 없이 페이지에서 EditField를 직접 사용한다.

```tsx
<EditField label="분과">
  {/* 페이지에서 직접 정의한 content */}
</EditField>
```

### TextField (공통 컴포넌트)

텍스트 입력 필드. 포커스 시 활성 테두리 + X 버튼 노출, 최대 2줄 자동 리사이즈.

**사용처**: 동아리명, 동아리 한줄소개, 링크 URL 입력 등 텍스트를 직접 입력하는 모든 필드

```tsx
<TextField
  label="동아리명"
  value={value}
  onChange={setValue}
  onClear={() => setValue('')}
/>
```

### NavField (공통 컴포넌트)

클릭 시 다른 화면으로 이동하는 필드. 오른쪽 화살표 아이콘 고정. children으로 현재 상태를 표시한다.

**사용처**: 자유태그 편집 진입, 링크 추가 진입 (등록된 태그 미리보기 또는 링크 개수 표시)

```tsx
// 태그가 있는 경우
<NavField label="자유태그 (5자이내)" onNavigate={handleNavigate}>
  <ClubTag type="자유">태그명</ClubTag>
</NavField>

// 없는 경우
<NavField label="자유태그 (5자이내)" onNavigate={handleNavigate}>
  <Styled.EmptyText>없음</Styled.EmptyText>
</NavField>
```

### 페이지 인라인 필드 (EditField 직접 사용)

재사용이 없거나 content가 특수한 필드는 컴포넌트로 분리하지 않고 페이지에서 EditField를 직접 사용한다.

| 필드 | 사용 페이지 | 비고 |
|---|---|---|
| 분과 토글 | 기본정보 편집 탭 | 카테고리 버튼 나열 |
| 자유태그 입력 | 자유태그 편집 페이지 | 태그 추가/삭제 슬롯 |
| 링크 URL 입력 | 링크 추가 페이지 | URL 텍스트 파란색 처리 포함 |

## 디렉토리

```
src/pages/AdminPage/components/
  editFields/
    EditField/
      EditField.tsx
      EditField.styles.ts
      EditField.stories.tsx
    TextField/
      TextField.tsx
      TextField.styles.ts
      TextField.stories.tsx
    NavField/
      NavField.tsx
      NavField.styles.ts
      NavField.stories.tsx
```

## 관련 코드

- `src/pages/AdminPage/components/editFields/EditField/EditField.tsx` — 편집 필드 공통 카드 컴포넌트
- `src/pages/AdminPage/components/editFields/TextField/TextField.tsx` — 텍스트 입력 필드
- `src/pages/AdminPage/components/editFields/NavField/NavField.tsx` — 네비게이션 필드
