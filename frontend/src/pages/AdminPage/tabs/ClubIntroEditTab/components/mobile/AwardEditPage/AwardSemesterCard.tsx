import addIcon from '@/assets/images/icons/add_icon.svg';
import closeCircleIcon from '@/assets/images/icons/close_circle_icon.svg';
import FieldClearButtonIcon from '@/assets/images/icons/field_clear_button_icon.svg?react';
import AddItemButton from '@/pages/AdminPage/components/AddItemButton/AddItemButton';
import { Award, SemesterTerm, SemesterTermType } from '@/types/club';
import * as Styled from './AwardSemesterCard.styles';

const formatSemesterLabel = (
  year: number,
  semesterTerm: SemesterTermType,
): string => {
  const termLabel = semesterTerm === SemesterTerm.FIRST ? '1학기' : '2학기';
  return `${year} ${termLabel}`;
};

interface AwardSemesterCardProps {
  award: Award;
  onChange: (award: Award) => void;
  onDelete: () => void;
}

const AwardSemesterCard = ({
  award,
  onChange,
  onDelete,
}: AwardSemesterCardProps) => {
  const semesterLabel = formatSemesterLabel(award.year, award.semesterTerm);

  const handleAchievementChange = (index: number, value: string) => {
    onChange({
      ...award,
      achievements: award.achievements.map((a, i) => (i === index ? value : a)),
    });
  };

  const handleAddAchievement = () => {
    onChange({ ...award, achievements: [...award.achievements, ''] });
  };

  return (
    <Styled.Card>
      <Styled.Header>
        <Styled.SemesterLabel>{semesterLabel}</Styled.SemesterLabel>
        <Styled.IconButton
          type='button'
          onClick={onDelete}
          aria-label='학기 삭제'
        >
          <img src={closeCircleIcon} alt='삭제' width={22} height={22} />
        </Styled.IconButton>
      </Styled.Header>

      {award.achievements.map((achievement, index) => (
        <Styled.AchievementRow key={index}>
          <Styled.AchievementInput
            value={achievement}
            placeholder='수상내역을 입력하세요'
            onChange={(e) => handleAchievementChange(index, e.target.value)}
          />
          {achievement.length > 0 && (
            <Styled.IconButton
              type='button'
              onMouseDown={(e) => {
                e.preventDefault();
                handleAchievementChange(index, '');
              }}
              aria-label='내용 지우기'
            >
              <FieldClearButtonIcon />
            </Styled.IconButton>
          )}
        </Styled.AchievementRow>
      ))}

      <AddItemButton type='button' onClick={handleAddAchievement}>
        <img src={addIcon} alt='' width={16} height={16} />
        수상내역 추가
      </AddItemButton>
    </Styled.Card>
  );
};

export default AwardSemesterCard;
