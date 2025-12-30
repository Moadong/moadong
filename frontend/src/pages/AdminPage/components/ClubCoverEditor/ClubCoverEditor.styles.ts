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

export const CoverImageWrapper = styled.div`
  position: relative;
  width: 375px;
  height: 213px;
  flex-shrink: 0;
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: 12px;
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
  border: 1px solid ${({ theme }) => theme.colors.primary[900]};
  border-radius: 80px;
  background: ${({ theme }) => theme.colors.base.white};
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 12px;
  line-height: 140%;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[900]};
    color: ${({ theme }) => theme.colors.base.white};
  }
`;

export const ResetButton = styled.button`
  padding: 10px 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 80px;
  background: ${({ theme }) => theme.colors.base.white};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 12px;
  line-height: 140%;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[600]};
    color: ${({ theme }) => theme.colors.base.white};
  }
`;

export const HelpText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
