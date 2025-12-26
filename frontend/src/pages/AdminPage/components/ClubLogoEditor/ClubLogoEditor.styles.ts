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

export const UploadButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ff6b35;
  border-radius: 80px;
  background: white;
  color: #ff6b35;
  font-size: 12px;
  line-height: 140%;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ff6b35;
    color: white;
  }
`;

export const ResetButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #999;
  border-radius: 80px;
  background: white;
  color: #999;
  font-size: 12px;
  line-height: 140%;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #999;
    color: white;
  }
`;

export const HelpText = styled.p`
  font-size: 12px;
  color: #c5c5c5;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
