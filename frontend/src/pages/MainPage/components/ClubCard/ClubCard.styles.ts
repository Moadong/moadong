import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import ClubTag from '@/components/ClubTag/ClubTag';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export type CardVariant = 'default' | 'compact';

const CARD_STYLES = {
  default: {
    desktop: { borderRadius: '20px', padding: '20px', gap: '20px' },
    mobile: { borderRadius: '16px', padding: '14px', gap: '12px' },
  },
  compact: {
    desktop: { borderRadius: '10px', padding: '14px 0', gap: '14px' },
    mobile: { borderRadius: '10px', padding: '12px 0', gap: '12px' },
  },
} as const;

// 모집 중: 테두리 카드. 지원할 수 있는 동아리라 면을 세워 눈에 띄게 한다
const raisedCard = css`
  border-radius: ${CARD_STYLES.default.desktop.borderRadius};
  background-color: ${colors.base.white};
  border: 1px solid ${colors.gray[300]};

  ${media.mobile} {
    border-radius: ${CARD_STYLES.default.mobile.borderRadius};
  }
  transition:
    transform 0.2s ease-in-out,
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  @media (hover: hover) {
    &:hover {
      border-color: ${colors.gray[500]};
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    }
  }

  &:active {
    transform: scale(0.98);
    background-color: ${colors.gray[50]};
  }
`;

// 모집 마감: 면 없는 행. 구분선으로만 나눠 모집 중 카드보다 조용하게 둔다.
// 눌림·hover 면은 글자 정렬을 건드리지 않게 ::before로 좌우 8px 넓혀 깐다.
// 행 자체에는 모서리 반경을 주지 않는다(주면 구분선 양 끝이 말려 올라간다)
const flatRow = css`
  isolation: isolate;
  border-bottom: 1px solid ${colors.gray[300]};

  &::before {
    content: '';
    position: absolute;
    inset: 0 -8px;
    z-index: -1;
    border-radius: ${CARD_STYLES.compact.mobile.borderRadius};
    background-color: ${colors.gray[100]};
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  }

  @media (hover: hover) {
    &:hover::before {
      opacity: 1;
    }
  }

  &:active::before {
    opacity: 1;
  }
`;

const CardContainer = styled.div<{ $variant: CardVariant }>`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  padding: ${({ $variant }) => CARD_STYLES[$variant].desktop.padding};
  gap: ${({ $variant }) => CARD_STYLES[$variant].desktop.gap};
  touch-action: manipulation;

  ${({ $variant }) => ($variant === 'compact' ? flatRow : raisedCard)}

  ${media.mobile} {
    padding: ${({ $variant }) => CARD_STYLES[$variant].mobile.padding};
    gap: ${({ $variant }) => CARD_STYLES[$variant].mobile.gap};
  }
`;

const ClubInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ClubName = styled.h3<{ $variant: CardVariant }>`
  min-width: 0;
  ${ellipsis}
  line-height: 140%;

  ${({ $variant }) =>
    $variant === 'compact'
      ? css`
          font-size: 0.9375rem;
          font-weight: 600;
        `
      : css`
          font-size: 1.25rem;
          font-weight: bold;

          ${media.mobile} {
            font-size: 1rem;
          }
        `}
`;

// 카드 전체를 덮는 링크(stretched link). 구독 버튼은 ChildrenSlot으로 이 위에 올린다.
// border-radius는 상속 속성이 아니라 ::after의 inherit은 링크(0)를 따른다. 그래서 카드 값을 직접 준다
const CardLink = styled(Link)<{ $variant: CardVariant }>`
  color: inherit;
  text-decoration: none;
  outline: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${({ $variant }) =>
      CARD_STYLES[$variant].desktop.borderRadius};

    ${media.mobile} {
      border-radius: ${({ $variant }) =>
        CARD_STYLES[$variant].mobile.borderRadius};
    }
  }

  &:focus-visible::after {
    outline: 2px solid ${colors.primary[900]};
    outline-offset: 2px;
  }
`;

const BadgeSlot = styled.div`
  display: flex;
  flex-shrink: 0;
`;

const Introduction = styled.p<{ $variant: CardVariant }>`
  ${ellipsis}
  color: ${colors.gray[800]};
  font-weight: normal;
  line-height: 140%;

  ${({ $variant }) =>
    $variant === 'compact'
      ? css`
          margin-top: 2px;
          font-size: 0.75rem;
        `
      : css`
          margin-top: 6px;
          font-size: 0.875rem;

          ${media.mobile} {
            margin-top: 2px;
            font-size: 0.8125rem;
          }
        `}
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 12px;

  ${media.mobile} {
    margin-top: 8px;
  }
`;

// 자유 태그는 칩 없이 글자 메타로 그린다. 공용 ClubTag는 분과 칩에만 쓴다
const TagText = styled.span`
  color: ${colors.gray[800]};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 140%;

  ${media.mobile} {
    font-size: 0.75rem;
  }
`;

const CompactCategoryTag = styled(ClubTag)`
  flex-shrink: 0;
`;

// 링크(::after) 위에서 눌리도록 쌓임 순서를 올린다.
// 버튼 둘레의 빈 자리는 링크로 넘겨, 눌러도 반응 없는 곳이 생기지 않게 한다
const ChildrenSlot = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export {
  CardContainer,
  ClubInfo,
  NameRow,
  ClubName,
  CardLink,
  BadgeSlot,
  Introduction,
  TagsContainer,
  TagText,
  CompactCategoryTag,
  ChildrenSlot,
};
