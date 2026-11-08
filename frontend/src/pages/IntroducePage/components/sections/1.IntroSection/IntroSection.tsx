import { ReactNode, useRef } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import BrandDoodle from '@/pages/IntroducePage/components/BrandDoodle/BrandDoodle';
import {
  fade,
  fadeIn,
  stagger,
  VIEWPORT_CONFIG,
} from '@/pages/IntroducePage/constants/animations';
import * as Styled from './IntroSection.styles';

/** 제목 줄마다 아래에서 밀려 올라오며 나타난다 */
const titleLineVariants: Variants = {
  hidden: { y: '110%' },
  show: (index: number) => ({
    y: '0%',
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1 + index * 0.12,
    },
  }),
};

interface IntroSectionProps {
  /** 큰 제목. 줄바꿈은 \n으로 */
  title: string;
  subtitle: string;
  /** 대상별 시작 버튼 */
  actions: ReactNode;
  /** 제목 아래 큰 화면 (학생은 폰, 운영진은 관리자 대시보드) */
  visual: ReactNode;
}

const IntroSection = ({
  title,
  subtitle,
  actions,
  visual,
}: IntroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  // 스크롤하면 글자는 빠르게 올라가며 흐려지고, 폰은 천천히 올라가며 커진다
  const textY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <Styled.IntroSection
      ref={sectionRef}
      variants={stagger}
      initial='hidden'
      whileInView='show'
      viewport={VIEWPORT_CONFIG}
      aria-labelledby='intro-title'
    >
      {/* 대상을 바꾸면 로고 도형을 처음부터 다시 그린다 */}
      <Styled.Doodles key={title}>
        <BrandDoodle
          shape='twistLeft'
          trigger='mount'
          width='min(34vw, 460px)'
          position={{ top: '-40px', left: 'max(-160px, calc(50% - 720px))' }}
          fillOpacity={0.09}
        />
        <BrandDoodle
          shape='twistRight'
          trigger='mount'
          width='min(22vw, 290px)'
          position={{ top: '220px', right: 'max(-90px, calc(50% - 660px))' }}
          fillOpacity={0.1}
          delay={0.35}
        />
      </Styled.Doodles>

      <Styled.Container>
        <Styled.TextWrapper
          style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
        >
          {/* 대상을 바꾸면 key가 바뀌어 다시 마운트되므로, 부모 상태와 무관하게 직접 show로 보낸다 */}
          <Styled.IntroTitle
            key={title}
            id='intro-title'
            initial='hidden'
            animate='show'
          >
            {title.split('\n').map((line, index) => (
              <Styled.TitleLineMask key={line}>
                <Styled.TitleLine custom={index} variants={titleLineVariants}>
                  {line}
                </Styled.TitleLine>
              </Styled.TitleLineMask>
            ))}
          </Styled.IntroTitle>
          <Styled.IntroSubtitle
            key={subtitle}
            variants={fadeIn}
            initial='hidden'
            animate='show'
          >
            {subtitle}
          </Styled.IntroSubtitle>
          <Styled.ActionsWrapper variants={fadeIn}>
            {actions}
          </Styled.ActionsWrapper>
        </Styled.TextWrapper>

        <Styled.VisualWrapper
          style={reduceMotion ? undefined : { y: visualY, scale: visualScale }}
        >
          <Styled.Phone
            key={title}
            variants={fade}
            initial='hidden'
            animate='show'
          >
            {visual}
          </Styled.Phone>
        </Styled.VisualWrapper>
      </Styled.Container>
    </Styled.IntroSection>
  );
};

export default IntroSection;
