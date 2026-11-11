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
    let lastWidth = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === lastWidth) return;
      lastWidth = el.clientWidth;
      fitHeight(el);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

export default useAutoGrow;
