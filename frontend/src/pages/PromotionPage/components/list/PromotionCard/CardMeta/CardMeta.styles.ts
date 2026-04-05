import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;

  ${media.mini_mobile} {
    font-size: 14px;
    margin-bottom: 2px;
  }
`;

export const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${media.mini_mobile} {
    font-size: 14px;
    margin-bottom: 1px;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  width: 16px;
  height: 16px;
  padding: 1.5px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.gray[500]};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  ${media.mini_mobile} {
    width: 14px;
    height: 14px;
  }
`;

export const MetaText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.mini_mobile} {
    font-size: 12px;
  }
`;
