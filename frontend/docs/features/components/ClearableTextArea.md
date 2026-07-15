# ClearableTextArea

어드민 모바일 편집 화면에서 공통으로 사용하는 textarea 컴포넌트. 포커스 감지, 클리어 버튼 표시, auto-grow 로직을 단일 컴포넌트로 캡슐화한다.

## 동작

- 포커스 시 → 부모 Card의 `focus-within` CSS로 검정 테두리 활성화
- 포커스 + 내용 있을 때 → X(클리어) 버튼 표시
- X 버튼 `onMouseDown`에서 `e.preventDefault()` → blur 없이 값 초기화 후 포커스 유지
- `useAutoGrow`로 입력 내용에 따라 높이 자동 조절

## Props

| prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `value` | `string` | — | 입력값 |
| `onChange` | `(value: string) => void` | — | 값 변경 핸들러 (클리어 시 `''` 전달) |
| `onClear` | `() => void` | — | 클리어 버튼 클릭 시 사이드이펙트 전용 (Mixpanel 등). 값 초기화는 `onChange('')`로 처리 |
| `placeholder` | `string` | — | placeholder 텍스트 |
| `maxLength` | `number` | — | 최대 글자수 (HTML attribute로 브라우저 처리) |
| `rows` | `number` | `1` | 초기 행 수 |
| `size` | `'default' \| 'large'` | `'default'` | 타이포그래피 변형 (`default`: p6 14px/400, `large`: p3 16px/500) |

## 테두리 활성화 방식

`ClearableTextArea` 자체는 테두리를 직접 조작하지 않는다. 부모 Card 스타일에서 `focus-within`으로 처리한다.

```ts
// EditField.styles.ts, InfoSection.styles.ts, FAQSection.styles.ts
export const Card = styled.div`
  border: 1px solid ${colors.gray[200]};

  &:focus-within {
    border-color: ${colors.gray[800]};
  }
`;
```

## 사용처

| 컴포넌트 | size | onClear 용도 |
|---|---|---|
| `TextField` (ClubInfoMobile 동아리명·소개) | `large` | Mixpanel 트래킹 |
| `ClubIntroEditTabMobile` (소개·활동·이런사람·혜택) | `default` | 없음 |
| `FAQSection` (답변 영역) | `default` | 없음 |

## 관련 코드

- `src/pages/AdminPage/components/ClearableTextArea/ClearableTextArea.tsx` — 컴포넌트 본체
- `src/pages/AdminPage/components/ClearableTextArea/ClearableTextArea.styles.ts` — Row, Textarea, ClearButton 스타일
- `src/hooks/useAutoGrow.ts` — textarea 높이 자동 조절 훅
- `src/assets/images/icons/dark_clear_button_icon.svg` — X 아이콘 (import 별칭: `ClearButtonIcon`)
