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

export const HelpText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
