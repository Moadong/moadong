import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import BrandDoodle from '@/pages/IntroducePage/components/BrandDoodle/BrandDoodle';
import {
  fadeUp,
  VIEWPORT_CONFIG,
} from '@/pages/IntroducePage/constants/animations';
import type { ChatMessage } from '@/pages/IntroducePage/constants/audience';
import ChatRoom from './ChatRoom/ChatRoom';
import * as Styled from './ProblemSection.styles';

/** 단톡방이 보이기 시작한 뒤 첫 메시지, 이후 메시지마다 걸리는 시간 */
const FIRST_DELAY_MS = 250;
const MESSAGE_GAP_MS = 480;

interface ProblemSectionProps {
  title: string;
  roomName: string;
  messages: ChatMessage[];
}

/** 보이기 시작하면 메시지를 단톡방처럼 하나씩 도착시킨다 */
const useArrivedCount = (inView: boolean, total: number) => {
  const reduceMotion = useReducedMotion();
  const [arrived, setArrived] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion || arrived >= total) return;
    const timer = window.setTimeout(
      () => setArrived((prev) => prev + 1),
      arrived === 0 ? FIRST_DELAY_MS : MESSAGE_GAP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [inView, reduceMotion, arrived, total]);

  return reduceMotion ? total : arrived;
};

const ProblemSection = ({ title, roomName, messages }: ProblemSectionProps) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chatRef, { once: true, amount: 0.4 });
  const arrived = useArrivedCount(inView, messages.length);

  return (
    <Styled.ProblemSection>
      <BrandDoodle
        shape='twistLeft'
        width='min(28vw, 360px)'
        position={{ top: '30%', right: 'max(-220px, calc(50% - 640px))' }}
        rotate={150}
        fillOpacity={0.07}
      />
      <Styled.ProblemSectionTitle
        variants={fadeUp}
        initial='hidden'
        whileInView='show'
        viewport={VIEWPORT_CONFIG}
      >
        {title}
      </Styled.ProblemSectionTitle>

      <ChatRoom
        roomRef={chatRef}
        roomName={roomName}
        messages={messages}
        arrived={arrived}
      />
    </Styled.ProblemSection>
  );
};

export default ProblemSection;
