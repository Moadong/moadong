import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 12px;
  background: ${colors.base.white};
  padding: 0 44px 0 14px;
  font-size: 0.95rem;
  color: ${colors.gray[900]};

  &::placeholder {
    color: ${colors.gray[500]};
  }

  &:focus {
    outline: 2px solid ${colors.primary[700]};
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: ${colors.gray[900]};
  color: ${colors.base.white};
  cursor: pointer;
  padding: 0;
`;
