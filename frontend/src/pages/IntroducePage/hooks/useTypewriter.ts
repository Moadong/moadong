// 문구들을 한 글자씩 쳤다가 지우기를 반복하는 타자 효과 훅 (움직임 줄이기 설정이면 첫 문구를 그대로 보여준다)
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const TYPE_MS = 110;
const HOLD_MS = 1400;

const useTypewriter = (words: string[], typeMs = TYPE_MS) => {
  const reduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const word = words[wordIndex];

  useEffect(() => {
    if (reduceMotion) return;
    const finishedTyping = !deleting && length === word.length;
    const finishedDeleting = deleting && length === 0;

    const timer = window.setTimeout(
      () => {
        if (finishedTyping) setDeleting(true);
        else if (finishedDeleting) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        } else setLength((prev) => prev + (deleting ? -1 : 1));
      },
      finishedTyping ? HOLD_MS : deleting ? typeMs / 3 : typeMs,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, deleting, length, word, words.length, typeMs]);

  return reduceMotion ? words[0] : word.slice(0, length);
};

export default useTypewriter;
