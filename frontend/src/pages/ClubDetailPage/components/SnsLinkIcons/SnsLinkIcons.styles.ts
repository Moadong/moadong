import styled from 'styled-components';

export const SnsIconGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const SnsIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const SnsLink = styled.a`
  display: inline-block;
  line-height: 0;
`;
