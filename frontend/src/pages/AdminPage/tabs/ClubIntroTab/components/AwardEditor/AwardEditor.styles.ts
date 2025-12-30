import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Label = styled.label`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.base.black};
`;

export const AddSemesterSection = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const DropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: 8px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.base.white};
  cursor: pointer;
  gap: 8px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }

  img {
    width: 12px;
    height: 12px;
  }
`;

export const AddButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary[900]};
  color: ${({ theme }) => theme.colors.base.white};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

export const AwardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const AwardItem = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
`;

export const SemesterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const SemesterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.base.black};
  margin: 0;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

export const AchievementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

export const AchievementItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const AchievementInput = styled.input`
  flex: 1;
  padding: 8px 36px 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: 6px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.base.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const AchievementRemoveButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 16px;
    height: 16px;
    opacity: 0.5;
  }

  &:hover img {
    opacity: 1;
  }
`;

export const AddAchievementButton = styled.button`
  padding: 8px 16px;
  background: none;
  color: ${({ theme }) => theme.colors.primary[900]};
  border: 1px dashed ${({ theme }) => theme.colors.primary[900]};
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;
