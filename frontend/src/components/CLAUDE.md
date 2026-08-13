# components — 공용 UI 컴포넌트

- `common/` - 페이지 무관 범용 컴포넌트 (Header, Modal, Toast, Button, Portal 등)
- `application/` - 지원서 관련 공용 컴포넌트
- `map/` - 지도 화면 전용 컴포넌트
- `ClubStateBox/`, `ClubTag/` - 동아리 상태·태그 표시

## 파일 구성

컴포넌트 하나당 같은 이름의 디렉토리를 만들고 그 안에 파일을 둔다.

```
common/Toast/
  Toast.tsx          # 로직 + 마크업
  Toast.styles.ts    # styled-components (스타일은 반드시 분리)
  Toast.stories.tsx  # Storybook (common 컴포넌트는 작성 권장)
```

- 스타일은 `* as Styled`로 import: `import * as Styled from './Toast.styles'`
- styled-components에 넘기는 커스텀 prop은 **`$` 접두사(transient prop)**. DOM에 새어나가지 않는다. 예: `$isActive`, `$duration`
- `src/components/`에는 테스트 파일이 없다. 검증은 Storybook + `npm run typecheck`로 한다 (루트 `CLAUDE.md`의 Storybook 가이드 참고)

## 스타일 하드룰

값을 직접 쓰지 말고 토큰을 쓴다.

| 대상 | 토큰 |
| --- | --- |
| 색상 | `colors` (`@/styles/theme/colors`) |
| 타이포 | `setTypography(typography.xxx)` (`@/styles/theme/typography`) |
| 트랜지션 | `transitions.duration.*`, `transitions.easing.*` |
| z-index | `Z_INDEX` (`@/styles/zIndex`) |
| 반응형 | `media.*` (`@/styles/mediaQuery`) |
| 헤더 높이 | `HEADER_HEIGHT` (`common/Header/Header.styles`) |

- 반투명 색상은 예외다. 알파 색상 토큰이나 변환 유틸이 없어서 `rgba()` 리터럴을 그대로 쓴다 (`Modal`, `Toast` 동일).
- 브레이크포인트는 **max-width 기준**이라 데스크탑 스타일을 먼저 쓰고 `media.tablet` → `media.mobile` 순으로 좁혀간다.

## 오버레이 컴포넌트 (Modal, Toast)

화면 위에 띄우는 컴포넌트는 아래 규약을 공유한다.

- **제어형**: `isOpen` + `onClose`를 받고 상태는 호출부가 소유한다. 컴포넌트가 스스로 열림 상태를 들지 않는다.
- **Portal**: `common/Portal/Portal.tsx`로 `#modal-root`(`index.html`)에 렌더한다. 조상의 `transform`·`overflow`로 인한 stacking context 문제를 피한다. Storybook에서는 `.storybook/preview.tsx`가 `#modal-root`를 만들어 준다.
- **z-index**: `Z_INDEX`에 정의된 값만 사용 (`overlay: 1100` < `modal: 1200` < `toast: 1300`).

## Toast

전역 토스트. 문구·색상·노출시간을 호출부에서 지정한다.

```tsx
const [isOpen, setIsOpen] = useState(true);

<Toast
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  message='같은 기기에서 작성 상태는 저장돼요.'
  backgroundColor={colors.primary[900]}
/>;
```

| prop | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `isOpen` | ✅ | - | 노출 여부 |
| `onClose` | ✅ | - | `duration` 경과 시 호출. 호출부가 `isOpen`을 내린다 |
| `message` | ✅ | - | 표시할 문구 |
| `backgroundColor` | | `rgba(17,17,17,0.85)` | 배경색 |
| `color` | | `colors.base.white` | 글자색 |
| `duration` | | `3500` | 노출 시간(ms) |

- **위치가 브레이크포인트별로 다르다.**
  - 701px 초과: 헤더 아래 (`top: HEADER_HEIGHT.desktop + 16px`), 위에서 내려오는 애니메이션
  - 700px 이하: 화면 하단 (`bottom: 24px`), 아래에서 올라오는 애니메이션
  - 헤더를 숨기는 화면(`<Header showOn={['desktop', 'laptop']} />`)이 많아 좁은 화면에서 상단에 두면 제목·본문을 가린다. 그래서 하단으로 붙인다.
  - ⚠️ `AppLayout` 하위 페이지(`/`, `/promotions`, `/subscriptions`, `/menu` 등)는 바텀네비가 있어 좁은 화면에서 겹친다. 해당 페이지에서 토스트를 쓰게 되면 오프셋 처리가 필요하다.
- `pointer-events: none`이라 사용자 입력을 가리지 않고, `role="status"`로 스크린리더에 읽힌다.
- 애니메이션은 `duration` 하나로 페이드인·유지·페이드아웃을 모두 처리한다. `duration` 전에 호출부가 강제로 닫으면 퇴장 애니메이션 없이 사라진다.
- 상태를 호출부의 `useState`로 들고 있어서 **언마운트·페이지 이동 시 사라진다.** 컴포넌트 밖(훅, react-query `onError`)에서 띄우거나 `navigate` 이후까지 유지해야 하면 전역 스토어(`src/store/`)가 필요하다.
