# Portal 컴포넌트 분리 및 PortalModal 리팩토링

`createPortal`을 추상화한 범용 `Portal` 컴포넌트를 `common/Portal/`로 분리하고, `PortalModal`이 이를 사용하도록 리팩토링했다.

## 배경

기존 `PortalModal`은 `createPortal` 호출, 스크롤 잠금, 오버레이 처리를 모두 담당했다. Portal 렌더링 로직을 별도 컴포넌트로 분리해 툴팁, 토스트, 드로어 등 다른 컴포넌트에서도 재사용할 수 있도록 했다.

## Portal 컴포넌트

```tsx
interface PortalProps {
  children: ReactNode;
  rootId?: string; // 기본값: 'modal-root'
}
```

- `rootId` prop으로 다른 DOM root에도 렌더링 가능
- `children`은 `ReactNode` 직접 선언 (필수값이므로 `PropsWithChildren` 미사용)

## PortalModal 변경 사항

- `createPortal` 직접 호출 → `<Portal>` 컴포넌트로 교체
- `useEffect` cleanup 버그 수정: `if (!isOpen) return` 가드 추가로 불필요한 overflow 리셋 방지
- `onClick` 핸들러 단순화: `closeOnBackdrop ? onClose : undefined`

## 관련 코드

- `src/components/common/Portal/Portal.tsx` — 범용 포탈 컴포넌트
- `src/components/common/Modal/PortalModal.tsx` — Portal을 사용하는 모달 래퍼
