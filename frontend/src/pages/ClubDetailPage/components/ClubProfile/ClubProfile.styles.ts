import styled from 'styled-components';

const ClubContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 21px;

  @media (max-width: 500px) {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'logo name'
      'tags tags';
    gap: 12px;
  }
`;

const ClubInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  @media (max-width: 500px) {
    display: contents;
  }
`;

const ClubName = styled.p`
  font-size: 2.375rem;
  font-weight: bold;
  color: #000;

  @media (max-width: 500px) {
    font-size: 1.875rem;
    grid-area: name;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 500px) {
    gap: 6px;
    grid-area: tags;
  }
`;

export { ClubContainer, ClubInfo, ClubName, TagContainer };
