// 대시보드 미리보기의 브라우저 창 틀(점 세 개·주소창), 지원자 현황 화면 배치, 새 지원서 알림, 아래쪽 흐림 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

/* 창 아래쪽이 배경으로 자연스럽게 사라지게 한다 */
export const Fade = styled.div`
  width: 100%;
  max-width: 1000px;
  max-height: 560px;
  overflow: hidden;
  mask-image: linear-gradient(180deg, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, black 70%, transparent 100%);

  ${media.tablet} {
    max-height: 460px;
  }
`;

export const Window = styled.div`
  overflow: hidden;
  border-radius: 18px;
  background: ${colors.gray[100]};
  box-shadow:
    0 0 0 1px ${colors.gray[300]},
    0 30px 70px rgba(17, 17, 17, 0.14);
`;

export const TitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  height: 44px;
  padding: 0 16px;
  background: ${colors.base.white};
  border-bottom: 1px solid ${colors.gray[250]};
`;

export const Dots = styled.span`
  display: inline-flex;
  gap: 7px;

  span {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: ${colors.gray[400]};
  }
`;

export const Address = styled.span`
  flex: 1;
  max-width: 360px;
  margin: 0 auto;
  padding: 6px 14px;
  border-radius: 8px;
  background: ${colors.gray[100]};
  font-size: 13px;
  color: ${colors.gray[700]};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.mobile} {
    font-size: 11px;
  }
`;

export const Body = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  pointer-events: none;
  user-select: none;
  text-align: left;

  ${media.tablet} {
    padding: 14px;
  }
`;

export const Main = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

export const FormName = styled.span`
  font-size: 14px;
  color: ${colors.gray[700]};
`;

export const List = styled.div`
  overflow: hidden;
  border-radius: 16px;
  background: ${colors.base.white};
`;

/* 오른쪽 위에 잠깐 떴다 사라지는 새 지원서 알림 */
export const Toast = styled(motion.div)`
  position: absolute;
  top: 18px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  background: ${colors.gray[950]};
  font-size: 13px;
  font-weight: 600;
  color: ${colors.base.white};
  box-shadow: 0 10px 24px rgba(17, 17, 17, 0.2);

  ${media.tablet} {
    top: 10px;
    right: 10px;
    font-size: 11px;
  }
`;

export const ToastDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colors.primary[800]};
`;

export const PageTitle = styled.p`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.base.black};
`;

export const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 184px;
  flex-shrink: 0;
  padding: 16px 12px;
  border-radius: 16px;
  background: ${colors.base.white};

  ${media.tablet} {
    display: none;
  }
`;

export const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 12px;
  border-bottom: 1px solid ${colors.gray[250]};
  font-size: 14px;
  font-weight: 700;
  color: ${colors.gray[950]};

  img {
    width: 20px;
    height: 20px;
  }
`;

export const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SidebarCategory = styled.p`
  padding: 0 8px 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${colors.gray[600]};
`;

export const SidebarItem = styled.p<{ $active: boolean }>`
  padding: 7px 10px;
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? colors.primary[500] : 'transparent'};
  font-size: 13.5px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? colors.primary[900] : colors.gray[800])};
`;
