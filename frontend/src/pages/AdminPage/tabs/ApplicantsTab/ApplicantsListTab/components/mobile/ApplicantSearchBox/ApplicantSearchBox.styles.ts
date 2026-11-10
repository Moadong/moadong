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
  box-shadow: inset 0 0 0 1px ${colors.gray[200]};
  /* 강제 색상(고대비) 모드는 box-shadow를 지우므로, 평소엔 안 보이고 그 모드에서만 테두리로 그려지는 outline을 둔다 */
  outline: 1px solid transparent;
  outline-offset: -1px;
  border-radius: 14px;
  box-sizing: border-box;

  &:focus-within {
    box-shadow: inset 0 0 0 1px ${colors.primary[800]};
    background: ${colors.base.white};

    path,
    circle {
      stroke: ${colors.primary[800]};
    }
  }

  /* 강제 색상 모드에서는 입력 포커스를 시스템 강조색 outline으로 보여 준다 */
  @media (forced-colors: active) {
    &:focus-within {
      outline: 2px solid Highlight;
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
  width: 16px;
  height: 16px;
  margin-right: 4px;
  flex-shrink: 0;

  path,
  circle {
    stroke: ${colors.gray[700]};
    stroke-width: 2;
  }
`;
