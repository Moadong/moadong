import styled from 'styled-components';

export const FooterContainer = styled.footer`
  text-align: left;
  font-size: 0.75rem;
  margin-top: 50px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #c5c5c5;
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 140px 30px 140px;
  line-height: 1.25rem;
  color: #818181;

  @media (max-width: 500px) {
    font-size: 0.625rem;
    padding: 20px 20px 30px 20px;
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
