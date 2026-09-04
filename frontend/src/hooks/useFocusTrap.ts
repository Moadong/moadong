import { RefObject, useEffect } from 'react';

/**
 * 열린 오버레이 안에 포커스를 가둔다.
 *
 * 오버레이는 #root 뒤에 붙는 별도 포털이라 배경이 그대로 탭 순서에 남는다.
 * aria-modal은 접근성 트리만 바꿀 뿐 포커스 순서를 막지 못해서, 열려 있는 채로
 * Tab을 누르면 뒤에 깔린 요소로 새어나간다. 그래서 열릴 때 안으로 옮기고,
 * Tab을 안에서 순환시키고, 닫힐 때 열기 전 자리로 돌려놓는다.
 *
 * 오버레이가 겹칠 때 각자 가두면 아래 오버레이가 위에 열린 것의 포커스를 뺏는다.
 * useTopmostEscape와 같은 이유로 열린 순서를 쌓아두고 맨 위 하나만 가둔다.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const stack: HTMLElement[] = [];

/**
 * display는 상속되지 않아 조상까지 거슬러 올라가야 하고, visibility는 상속되지만
 * 자식이 visible로 되돌릴 수 있어서 요소 자신의 계산값만 본다.
 */
const isHiddenByStyle = (element: HTMLElement) => {
  if (getComputedStyle(element).visibility !== 'visible') return true;

  let node: HTMLElement | null = element;
  while (node) {
    if (getComputedStyle(node).display === 'none') return true;
    node = node.parentElement;
  }

  return false;
};

/**
 * display:none·visibility:hidden 요소는 셀렉터엔 걸리지만 포커스를 못 받는다.
 * 그런 요소가 끝자리에 오면 focus()가 조용히 무시돼 Tab이 먹통이 된다.
 * checkVisibility가 없는 환경(Safari 17.3 이하)은 계산된 스타일로 대신 본다.
 */
const isVisible = (element: HTMLElement) =>
  element.checkVisibility
    ? element.checkVisibility({ visibilityProperty: true })
    : !isHiddenByStyle(element);

const getFocusable = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(isVisible);

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return;

  const container = stack[stack.length - 1];
  if (!container) return;

  /** 안에 잡을 것이 없으면 컨테이너 자신에 묶어둔다 */
  const focusable = getFocusable(container);
  const first = focusable[0] ?? container;
  const last = focusable[focusable.length - 1] ?? container;

  const active = document.activeElement;

  // 배경을 클릭하면 포커스가 body로 빠진다. 다음 Tab에서 다시 데려온다.
  if (!container.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
    return;
  }

  /** 열린 직후 포커스를 받는 컨테이너는 첫 요소 앞자리로 친다 */
  const atStart = active === container || active === first;

  // 사이 요소들은 브라우저 기본 이동에 맡기고 양 끝만 이어붙인다
  if (event.shiftKey && atStart) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

const useFocusTrap = (
  isOpen: boolean,
  containerRef: RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!isOpen || !container) return;

    const previouslyFocused = document.activeElement;

    if (stack.length === 0) {
      document.addEventListener('keydown', handleKeyDown);
    }
    stack.push(container);

    // 첫 요소를 바로 잡으면 그 요소의 onFocus가 딸려 실행된다(스와이프 행이 열리는 식).
    // 컨테이너를 잡아 두면 아무것도 건드리지 않으면서 Tab이 자연스럽게 안쪽으로 들어간다.
    container.focus();

    return () => {
      stack.splice(stack.indexOf(container), 1);
      if (stack.length === 0) {
        document.removeEventListener('keydown', handleKeyDown);
      }

      // 모달에서 페이지를 떠나면 열기 전 요소가 이미 사라져 있다.
      // 스크롤 잠금이 풀리며 돌려놓은 위치를 흔들지 않도록 preventScroll으로 되돌린다.
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen, containerRef]);
};

export default useFocusTrap;
