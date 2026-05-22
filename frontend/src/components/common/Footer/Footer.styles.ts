import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const FooterContainer = styled.footer`
  text-align: left;
  font-size: 0.75rem;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #c5c5c5;
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px 140px 30px 140px;
  line-height: 1.25rem;
  color: #818181;

  ${media.tablet} {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.625rem;
    padding: 20px 20px 30px 20px;
  }
`;

export const PolicyLink = styled.a`
  color: #787878;
  font-size: 0.75rem;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const CopyRightText = styled.p``;

export const EmailText = styled.p`
  a {
    color: #aaa;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const AdminButton = styled.button`
  background: ${colors.base.white};
  border: 1px solid ${colors.gray[400]};
  border-radius: 6px;

  padding: 6px 12px;
  font-size: 0.75rem;
  color: ${colors.gray[700]};

  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${colors.gray[100]};
    border-color: ${colors.gray[500]};
    color: ${colors.gray[800]};
  }

  &:active {
    background: ${colors.gray[200]};
  }

  ${media.mobile} {
    align-self: flex-start;
    margin-top: 6px;
  }
`;
