// 기능 하나를 "두 줄 제목 → 한 줄 부연 → 바로 가기"와 실제 화면 패널로 보여주는 한 줄 (좌우를 번갈아 놓는다)
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import * as Styled from './FeatureRow.styles';

const textVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const visualVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

interface FeatureRowProps {
  /** 큰 제목. 줄바꿈은 \n으로 */
  title: string;
  /** 한 줄 부연. 없어도 된다 */
  caption?: string;
  /** 이 기능이 있는 실제 페이지로 이동 */
  link?: { label: string; to: string };
  /** 링크 대신 둘 동작 (예: 앱 다운로드 버튼) */
  action?: ReactNode;
  /** 흰 화면 카드 없이 패널에 바로 둔다 (폰 목업처럼 자체 틀이 있을 때) */
  bare?: boolean;
  /** 화면 패널을 왼쪽에 둔다 */
  reverse?: boolean;
  /** 화면이 길면 이 높이에서 아래를 흐리게 자른다 */
  screenMaxHeight?: number;
  children: ReactNode;
}

const FeatureRow = ({
  title,
  caption,
  link,
  action,
  bare = false,
  reverse = false,
  screenMaxHeight = 420,
  children,
}: FeatureRowProps) => {
  return (
    <Styled.Row
      $reverse={reverse}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true, amount: 0.25 }}
    >
      <Styled.Text variants={textVariants}>
        <Styled.Title>{title}</Styled.Title>
        {caption && <Styled.Caption>{caption}</Styled.Caption>}
        {link && (
          <Styled.MoreLink as={Link} to={link.to}>
            {link.label}
            <span aria-hidden='true'>›</span>
          </Styled.MoreLink>
        )}
        {action}
      </Styled.Text>

      <Styled.Panel variants={visualVariants}>
        {/* 안의 실제 컴포넌트는 누르면 이동·이벤트 전송이 일어나므로 보기 전용으로 막는다 */}
        {bare ? (
          <Styled.Bare aria-hidden='true' inert>
            {children}
          </Styled.Bare>
        ) : (
          <Styled.Screen aria-hidden='true' inert $maxHeight={screenMaxHeight}>
            {children}
          </Styled.Screen>
        )}
      </Styled.Panel>
    </Styled.Row>
  );
};

export default FeatureRow;
