// 문구들을 한 글자씩 쳤다가 지우기를 반복하는 타자 효과 훅 (움직임 줄이기 설정이면 첫 문구를 그대로 보여준다)
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const TYPE_MS = 110;
const HOLD_MS = 1400;

interface TypewriterOptions {
  typeMs?: number;
  /** false면 멈춘다 (화면 밖에서는 타이머를 돌리지 않는다) */
  active?: boolean;
}

const useTypewriter = (
  words: string[],
  { typeMs = TYPE_MS, active = true }: TypewriterOptions = {},
) => {
  const reduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const word = words[wordIndex];

  useEffect(() => {
    if (reduceMotion || !active) return;
    const finishedTyping = !deleting && length === word.length;
    const finishedDeleting = deleting && length === 0;
    const getDelay = () => {
      if (finishedTyping) return HOLD_MS;
      if (deleting) return typeMs / 3;
      return typeMs;
    };

    const timer = window.setTimeout(() => {
      if (finishedTyping) setDeleting(true);
      else if (finishedDeleting) {
        setDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else setLength((prev) => prev + (deleting ? -1 : 1));
    }, getDelay());
    return () => window.clearTimeout(timer);
  }, [reduceMotion, active, deleting, length, word, words.length, typeMs]);

  return reduceMotion ? words[0] : word.slice(0, length);
};

export default useTypewriter;
