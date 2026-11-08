// 데모 화면이 보이면 정해진 순서대로 커서를 요소 위로 옮기고 눌러 상태를 바꾸며, 끝나면 처음부터 반복하는 훅
import { RefObject, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import type { CursorState } from '@/pages/IntroducePage/components/MacCursor/MacCursor';

export interface CursorStep {
  /** 커서가 갈 요소. 없으면 제자리에서 기다린다 */
  target?: (root: HTMLElement) => Element | null | undefined;
  /** 도착하면 누른다 */
  click?: boolean;
  /** 누른 뒤(또는 도착 뒤) 실행할 상태 변경 */
  action?: () => void;
  /** 다음 단계로 가기 전 기다리는 시간(ms) */
  wait?: number;
  /** 이 단계가 끝나면 커서를 감춘다 (다음 목표가 생기면 다시 나타난다) */
  hide?: boolean;
}

interface ScriptedCursorOptions {
  /** 오른쪽 아래에서 날아오지 않고, 첫 목표 위에 놓인 채로 나타난다 */
  startAtFirstTarget?: boolean;
}

const TRAVEL_MS = 520;
const PRESS_MS = 160;
const DEFAULT_WAIT_MS = 500;

/** 루트 안에서 글자가 정확히 일치하는 요소를 찾는다 */
export const findByText = (
  root: HTMLElement,
  selector: string,
  text: string,
): Element | undefined =>
  [...root.querySelectorAll(selector)].find(
    (element) => element.textContent?.trim() === text,
  );

const useScriptedCursor = (
  rootRef: RefObject<HTMLElement | null>,
  steps: CursorStep[],
  /** 한 바퀴가 끝나면 데모 상태를 처음으로 되돌린다 */
  reset: () => void,
  { startAtFirstTarget = false }: ScriptedCursorOptions = {},
) => {
  const reduceMotion = useReducedMotion();
  const inView = useInView(rootRef, { amount: 0.5 });
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    clickId: 0,
    visible: false,
  });
  // 매 렌더마다 새로 만들어지는 함수들을 최신 값으로만 참조한다
  const stepsRef = useRef(steps);
  const resetRef = useRef(reset);
  useEffect(() => {
    stepsRef.current = steps;
    resetRef.current = reset;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !inView || reduceMotion) return;

    let cancelled = false;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    const moveTo = (element: Element) => {
      const rootRect = root.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      setCursor((prev) => ({
        ...prev,
        visible: true,
        x: rect.left - rootRect.left + rect.width / 2,
        y: rect.top - rootRect.top + rect.height / 2,
      }));
    };

    const startPoint = () => {
      const rootRect = root.getBoundingClientRect();
      const first = startAtFirstTarget
        ? stepsRef.current[0]?.target?.(root)
        : null;
      if (first) {
        const rect = first.getBoundingClientRect();
        return {
          x: rect.left - rootRect.left + rect.width / 2,
          y: rect.top - rootRect.top + rect.height / 2,
        };
      }
      return { x: rootRect.width * 0.8, y: rootRect.height * 0.75 };
    };

    // 매 바퀴 같은 자리(기본은 화면 오른쪽 아래쯤)에서 나타나 시작한다
    const appearAtStart = async () => {
      setCursor((prev) => ({ ...prev, ...startPoint(), visible: true }));
      await sleep(400);
    };

    const run = async () => {
      await appearAtStart();

      while (!cancelled) {
        for (const step of stepsRef.current) {
          if (cancelled) return;
          const element = step.target?.(root);
          if (element) {
            moveTo(element);
            await sleep(TRAVEL_MS);
          }
          if (cancelled) return;
          if (step.click) {
            setCursor((prev) => ({ ...prev, clickId: prev.clickId + 1 }));
            await sleep(PRESS_MS);
          }
          step.action?.();
          if (step.hide) setCursor((prev) => ({ ...prev, visible: false }));
          await sleep(step.wait ?? DEFAULT_WAIT_MS);
        }
        if (cancelled) return;
        // 마지막 자리에서 첫 목표로 미끄러지지 않게, 사라진 뒤 시작 자리로 옮겨 다시 나타난다
        setCursor((prev) => ({ ...prev, visible: false }));
        await sleep(300);
        if (cancelled) return;
        resetRef.current();
        await sleep(100);
        setCursor((prev) => ({ ...prev, ...startPoint() }));
        await sleep(400);
        if (cancelled) return;
        await appearAtStart();
      }
    };

    run();
    return () => {
      cancelled = true;
      resetRef.current();
    };
  }, [rootRef, inView, reduceMotion, startAtFirstTarget]);

  return { cursor, enabled: !reduceMotion };
};

export default useScriptedCursor;
