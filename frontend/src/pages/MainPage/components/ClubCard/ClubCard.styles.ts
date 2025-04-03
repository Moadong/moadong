import styled from 'styled-components';

const CardContainer = styled.div<{
  state: string;
  isClicked: boolean;
  showShadow: boolean;
}>`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  padding: 20px;
  background-color: #fff;
  width: 100%;
  height: 170px;
  box-shadow: ${({ state, showShadow }) =>
    !showShadow
      ? 'none'
      : state === 'open'
        ? '0 0 14px rgba(0, 166, 255, 0.15)'
        : '0 0 14px rgba(0, 0, 0, 0.08)'};

  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  transform: ${({ isClicked }) => (isClicked ? 'scale(1.05)' : 'scale(1)')};
  cursor: pointer;

  &:hover {
    transform: ${({ isClicked }) =>
      isClicked ? 'scale(1.05)' : 'scale(1.03)'};
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
  gap: 18px;
`;

const ClubName = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Introduction = styled.p`
  font-size: 0.875rem;
  margin: 22px 3px 22px 5px;
  color: rgba(129, 129, 129, 1);
  line-height: 16px;
  white-space: nowrap;
`;

export {
  CardContainer,
  CardHeader,
  ClubProfile,
  ClubName,
  TagsContainer,
  Introduction,
};
