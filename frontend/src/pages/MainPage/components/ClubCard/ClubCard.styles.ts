import styled from 'styled-components';

const CARD_STYLES = {
  desktop: {
    borderRadius: '20px',
    padding: '20px',
    gap: '16px',
  },
  mobile: {
    borderRadius: '16px',
    padding: '16px',
    gap: '8px',
  },
} as const;

const CardContainer = styled.div<{
  $state: string;
  $isClicked: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: ${CARD_STYLES.desktop.borderRadius};
  padding: ${CARD_STYLES.desktop.padding};
  gap: ${CARD_STYLES.desktop.gap};
  background-color: #fff;

  box-shadow: ${({ $state }) =>
    $state === 'open'
      ? '0 0 14px rgba(0, 166, 255, 0.15)'
      : '0 0 14px rgba(0, 0, 0, 0.08)'};

  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  transform: ${({ $isClicked }) => ($isClicked ? 'scale(1.05)' : 'scale(1)')};
  cursor: pointer;
  touch-action: manipulation;

  @media (max-width: 500px) {
    border-radius: ${CARD_STYLES.mobile.borderRadius};
    padding: ${CARD_STYLES.mobile.padding};
    gap: ${CARD_STYLES.mobile.gap};
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.10);
  }

  @media (hover: hover) {
    &:hover {
      transform: ${({ $isClicked }) =>
        $isClicked ? 'scale(1.05)' : 'scale(1.03)'};
    }
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 300px) {
    height: auto;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ClubProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ClubInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ClubName = styled.p`
  font-size: 1.375rem;
  font-weight: bold;

  @media (max-width: 500px) {
    font-size: 1rem;
  }
`;

export const StateBoxTagContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    gap: 6px;
  }
`;

const INTRODUCTION_MARGIN = {
  desktop: {
    margin: '10px 0px 0px 0px',
  },
  mobile: {
    margin: '6px 0px 0px 0px',
  },
} as const;

const Introduction = styled.p`
  font-size: 0.875rem;
  font-weight: normal;
  margin: ${INTRODUCTION_MARGIN.desktop.margin};
  color: rgba(129, 129, 129, 1);
  line-height: 16px;
  white-space: nowrap;

  @media (max-width: 500px) {
    margin: ${INTRODUCTION_MARGIN.mobile.margin};
    font-size: 0.75rem;
  }
`;

export {
  CardContainer,
  CardHeader,
  ClubProfile,
  ClubName,
  ClubInfo,
  TagsContainer,
  Introduction,
};
