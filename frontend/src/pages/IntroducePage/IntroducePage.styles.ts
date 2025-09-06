import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

export const IntroducePageHeader = styled.header`
  width: 100%;
  background: #fff;
`;
export const IntroducePageFooter = styled.footer`
  background: #fff;
  border-top: 1px solid #eee;
`;
export const Main = styled.main`
  background: #fff;
`;
export const Container = styled.div`
  width: min(1120px, 92vw);
  margin: 0 auto;
  padding: 72px 0;
`;

/* 접근성 유틸 */
export const VisuallyHidden = styled.span``;

/* 1) 인트로 */
export const IntroSection = styled(motion.section)`
  width: 100%;
  height: 1100px;
  background: linear-gradient(
    180deg,
    rgba(255, 84, 20, 0.004) 0%,
    rgba(255, 84, 20, 0.08) 55.29%,
    rgba(255, 84, 20, 0.004) 100%
  );
  position: relative;
  overflow: hidden;
`;

export const BackgroundShapes = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

export const Shape = styled.div<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}>`
  position: absolute;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
`;

export const TextWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;

export const IntroTitle = styled(motion.h1)`
  color: #ff5414;
  font-size: 80px;
`;
export const IntroSubtitle = styled(motion.h2)`
  font-size: 36px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

export const IntroDescription = styled(motion.p)`
  font-size: 1.125rem;
  line-height: 1.6;
  color: #555;
`;

export const IntroButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 46px 14px 50px;
  background: #ff5414;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  margin-top: 28px;
  cursor: pointer;

  .icon {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }
`;

export const VisualWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PhoneImage = styled(motion.img)`
  width: 320px;
  z-index: 1;
`;

export const CardImage = styled(motion.img)`
  position: absolute;
  bottom: -20px;
  width: 180px;
  z-index: 2;
`;

/* 2) 페인 포인트 */
export const PainPointsSection = styled.section`
  background: #fff;
  text-align: center;
  position: relative;
`;
export const Step = styled.p`
  margin: 24px 0;
  font-size: 16px;
  color: #555;
`;
export const DotTrail = styled.div`
  width: 2px;
  height: 32px;
  margin: 0 auto;
  background: repeating-linear-gradient(
    to bottom,
    #ddd 0,
    #ddd 6px,
    transparent 6px,
    transparent 12px
  );
`;
export const QuestionMark = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 40px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff5eb;
  color: #ff6b00;
  font-weight: 700;
  font-size: 24px;
`;

/* 3) 슬로건 */
export const SloganSection = styled.section`
  background: #fff7f0;
`;
export const Slogan = styled.h2`
  text-align: center;
  font-size: 28px;
  margin: 0;
`;

/* 4) 카테고리 */
export const CategorySection = styled(motion.section)`
  background: #fff;
`;
export const SectionTitle = styled.h3`
  font-size: 22px;
  margin-bottom: 16px;
`;
export const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
export const Card = styled(motion.article)`
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
`;
export const CardHeader = styled.h4`
  padding: 16px;
  font-size: 18px;
  margin: 0;
  border-bottom: 1px solid #f2f2f2;
`;
export const CardBody = styled.p`
  padding: 14px 16px;
  color: #666;
  margin: 0;
`;

/* 5) 하이라이트 */
export const HighlightsSection = styled(motion.section)`
  background: #fff;
`;
export const TileGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;
export const Tile = styled(motion.div)`
  border-radius: 16px;
  padding: 20px;
  background: #fafafa;
  border: 1px solid #eee;
`;
export const TileTitle = styled.h5`
  margin: 0 0 8px;
  font-size: 18px;
`;
export const TileCaption = styled.p`
  margin: 0;
  color: #666;
`;

/* 6) 제휴/문의 */
export const ContactSection = styled(motion.section)`
  background: #fff7f0;
  text-align: center;
`;
export const ContactButton = styled(motion.a)`
  display: inline-block;
  margin-top: 12px;
  padding: 12px 18px;
  border-radius: 999px;
  background: #ff6b00;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
`;
