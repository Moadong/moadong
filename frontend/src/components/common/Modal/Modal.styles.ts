import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { Z_INDEX } from '@/styles/zIndex';

export const Overlay = styled.div`
  inset: 0;
  position: fixed;
  z-index: ${Z_INDEX.overlay};
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  /*
   * 내용이 화면보다 길면 가운데 정렬은 위아래로 똑같이 넘쳐 상단이 잘린다.
   * safe는 넘칠 때만 위쪽 기준으로 붙여 제목이 잘려나가지 않게 한다.
   *
   * overflow: hidden은 스크롤바만 감출 뿐 스크롤은 되는 상자라, 화면 밖 요소로
   * 포커스가 가면 브라우저가 이 상자를 스크롤해 모달을 위로 밀어버린다.
   * 되돌릴 스크롤바가 없어 잘린 상단은 다시 못 본다. clip은 스크롤 상자를
   * 만들지 않아 이 밀림이 아예 일어나지 않는다.
   *
   * 두 속성 모두 미지원 브라우저를 위해 기존 값을 앞에 남겨둔다.
   */
  align-items: center;
  align-items: safe center;
  overflow: hidden;
  overflow: clip;
  transition: background-color 0.2s ease;
  touch-action: none;
`;

export const ContentWrapper = styled.div`
  position: relative;
  outline: none;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: fit-content;
`;

export const StandardLayout = styled.div<{ $width?: string }>`
  background: ${colors.base.white};
  border-radius: 10px;
  overflow: hidden;
  margin: 24px;
  max-height: calc(100dvh - 48px - env(safe-area-inset-bottom));
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => $width || '400px'};
  max-width: 100%;
`;

export const Header = styled.div`
  padding: 30px;
  border-bottom: 1px solid ${colors.gray[400]};
  display: flex;
  align-items: center;
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 800;
  flex: 1;
  text-align: left;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  font-size: 20px;
  font-weight: 800;
  color: ${colors.gray[600]};
  line-height: 1;
  cursor: pointer;
`;

export const Description = styled.p`
  padding: 20px 32px 0px;
  text-align: left;
  color: ${colors.gray[600]};
  font-weight: 600;
`;

export const Body = styled.div`
  padding: 16px 30px 30px;
  overflow: auto;
`;
