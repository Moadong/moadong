import styled from 'styled-components';

export const Label = styled.label`
  display: block;
  padding: 0 4px;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ClubLogoWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

export const ClubLogo = styled.img`
  width: 100px;
  height: 100px;
  background: #ededed;
  border-radius: 20px;
  object-fit: cover;
`;

export const ButtonTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const HelpText = styled.p`
  font-size: 12px;
  color: #c5c5c5;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
