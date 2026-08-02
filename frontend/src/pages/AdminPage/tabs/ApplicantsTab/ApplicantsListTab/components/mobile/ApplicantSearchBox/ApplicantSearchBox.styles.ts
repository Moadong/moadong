import styled from 'styled-components';
import SearchButtonIcon from '@/assets/images/icons/search_button_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  height: 48px;
  width: 100%;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;
  box-sizing: border-box;

  &:focus-within {
    border-color: ${colors.primary[800]};
    background: ${colors.base.white};

    path, circle {
      stroke: ${colors.primary[800]};
    }
  }
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  ${setTypography(typography.paragraph.p4)}
  color: ${colors.base.black};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const SearchIcon = styled(SearchButtonIcon)`
  width: 17px;
  height: 17px;
  flex-shrink: 0;

  path, circle {
    stroke: ${colors.gray[700]};
    stroke-width: 2;
  }
`;
