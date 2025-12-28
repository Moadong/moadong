import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const ApplyButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  gap: 10px;
`;

export const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  cursor: ${({disabled}) => (disabled ? 'default' : 'pointer')};
  transition: transform 0.2s ease-in-out;
  background-color: ${({ disabled }) => disabled ? colors.gray[500] : colors.primary[800]};

  padding: 10px 40px;
  width: 517px;
  height: 50px;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  color: #fff;
  text-align: center;

  img {
    font-size: 12px;
    font-weight: 600;
  }

  ${media.mobile} {
    width: 273px;
    background-color: ${({ disabled }) => disabled ? colors.gray[500] : colors.gray[900]};
  }
`;

export const Separator = styled.span`
  margin: 0 8px;
  border-left: 1px solid #787878;
  height: 12px;
  display: inline-block;
`;