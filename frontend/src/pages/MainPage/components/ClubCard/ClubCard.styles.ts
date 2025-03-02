import styled from 'styled-components';

const CardContainer = styled.div<{ state: string }>`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  padding: 20px;
  background-color: #fff;
  width: 100%;
  height: 170px;
  box-shadow: ${({ state }) =>
    state === 'open'
      ? '0 0 14px rgba(0, 166, 255, 0.15)'
      : '0 0 14px rgba(0, 0, 0, 0.08)'};
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
