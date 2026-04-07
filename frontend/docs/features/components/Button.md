# Button 컴포넌트

공용 버튼 컴포넌트. `React.ButtonHTMLAttributes<HTMLButtonElement>`를 extend하여 HTML 버튼의 모든 속성을 지원한다.

## Props

| Prop       | Type                         | Default  | 설명                                                                     |
| ---------- | ---------------------------- | -------- | ------------------------------------------------------------------------ |
| `width`    | `string`                     | `'auto'` | 버튼 너비 (예: `'100%'`, `'150px'`)                                      |
| `animated` | `boolean`                    | `false`  | hover 시 pulse 애니메이션, active 시 scale 축소                          |
| 그 외      | `React.ButtonHTMLAttributes` | —        | `type`, `disabled`, `onClick`, `aria-*`, `data-*` 등 모든 HTML 버튼 속성 |

## 사용 예시

```tsx
// 기본
<Button onClick={handleClick}>저장</Button>

// 너비 지정 + submit
<Button width="100%" type="submit">로그인</Button>

// 애니메이션 + 비활성화
<Button animated disabled={isLoading} onClick={handleSave}>
  저장하기
</Button>
```

## 스타일

테마 시스템(`theme.colors`, `theme.typography`)을 참조한다.

- 배경: `gray[900]` (#3A3A3A)
- 텍스트: `base.white`
- 높이: 42px, border-radius: 10px
- 폰트: `typography.paragraph.p2` (16px, weight 600)
- disabled: `gray[500]` 배경, `gray[600]` 텍스트

## 관련 코드

- `src/components/common/Button/Button.tsx` — 컴포넌트 구현
- `src/styles/theme/colors.ts` — 색상 토큰
- `src/styles/theme/typography.ts` — 타이포그래피 토큰
