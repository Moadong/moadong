import { useEffect, useRef } from 'react';

const fitHeight = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
};

const useAutoGrow = (value: string) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) fitHeight(ref.current);
  }, [value]);

  // 화면 폭이 바뀌면(회전·분할 화면) 같은 글도 줄바꿈 수가 달라지므로 높이를 다시 잰다.
  // 높이를 맞추는 것 자체도 크기 변화라 너비가 바뀐 경우에만 다시 잰다.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    // clientWidth는 정수라 소수점 너비 변화를 놓치므로 콘텐츠 상자 너비(contentRect)로 비교한다
    let lastWidth: number | undefined;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width;
      if (width === undefined || width === lastWidth) return;
      const isFirst = lastWidth === undefined;
      lastWidth = width;
      // observe 직후의 첫 알림은 지금 너비를 기억만 한다(높이는 값 기준 effect가 이미 맞췄다)
      if (!isFirst) fitHeight(el);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

export default useAutoGrow;
