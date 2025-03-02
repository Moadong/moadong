import styled from 'styled-components';

export const FooterContainer = styled.footer`
  text-align: left;
  font-size: 0.75rem;
  padding: 0 140px;

  @media (max-width: 500px) {
    padding: 0 20px;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #c5c5c5;
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0 30px 0;
  line-height: 1.25rem;
  color: #818181;

  @media (max-width: 500px) {
    font-size: 0.625rem;
  }
`;

export const PolicyText = styled.p``;

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
