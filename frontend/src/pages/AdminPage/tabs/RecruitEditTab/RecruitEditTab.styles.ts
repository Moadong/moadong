import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

export const RecruitPeriodContainer = styled.div`
  display: flex;
  gap: 16px;
  max-width: 706px;
`;

export const AlwaysRecruitButton = styled.button<{ $active: boolean }>`
  border-radius: 6px;
  height: 45px;
  padding: 0px 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;

  color: ${({ $active }) => ($active ? '#fff' : '#797979')};
  background: ${({ $active }) => ($active ? '#FF7543' : 'rgba(0,0,0,0.05)')};
  border: ${({ $active }) => ($active ? 'none' : '1px solid #C5C5C5')};
  transition:
    background-color 0.12s ease,
    transform 0.06s ease;

  &:active {
    transform: translateY(1px);
  }
`;

export const Label = styled.p`
  font-size: 1.125rem;
  margin-bottom: 8px;
  font-weight: 600;
`;
