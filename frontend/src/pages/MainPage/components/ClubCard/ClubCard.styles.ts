import styled from 'styled-components';

const CardContainer = styled.div<{
  $state: string;
  $isClicked: boolean;
}>`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  background-color: #fff;
  width: 100%;
  gap: 16px;

  box-shadow: ${({ $state }) =>
    $state === 'open'
      ? '0 0 14px rgba(0, 166, 255, 0.15)'
      : '0 0 14px rgba(0, 0, 0, 0.08)'};

  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  transform: ${({ $isClicked }) => ($isClicked ? 'scale(1.05)' : 'scale(1)')};
  cursor: pointer;

  &:hover {
    transform: ${({ $isClicked }) =>
      $isClicked ? 'scale(1.05)' : 'scale(1.03)'};
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

const ClubName = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
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
  margin: ${INTRODUCTION_MARGIN.desktop.margin};
  color: rgba(129, 129, 129, 1);
  line-height: 16px;
  white-space: nowrap;

  @media (max-width: 500px) {
    margin: ${INTRODUCTION_MARGIN.mobile.margin};
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
