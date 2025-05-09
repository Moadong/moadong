import styled from 'styled-components';
import { HeaderStyles } from '@/components/common/Header/Header.styles';
import { FooterContainer } from '@/components/common/Footer/Footer.styles';

export const IntroducePageHeader = styled(HeaderStyles)`
  max-width: none;

  @media (max-width: 500px) {
    display: flex;
  }
`;

export const IntroducePageFooter = styled(FooterContainer)`
  margin-top: -50px;
`;

export const IntroduceImage = styled.img`
  width: 100vw;
  height: auto;
  margin-top: 62px;
`;
