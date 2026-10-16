import { useState } from 'react';
import addIcon from '@/assets/images/icons/add_icon.svg';
import closeCircleIcon from '@/assets/images/icons/close_circle_icon.svg';
import ClearButtonIcon from '@/assets/images/icons/dark_clear_button_icon.svg?react';
import AddItemButton from '@/pages/AdminPage/components/AddItemButton/AddItemButton';
import ClearButton from '@/pages/AdminPage/components/ClearButton';
import { Award } from '@/types/club';
import { formatSemesterLabel } from '@/utils/awardHelpers';
import * as Styled from './AwardSemesterCard.styles';

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
  const semesterLabel = formatSemesterLabel(award) ?? '';
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
        <ClearButton type='button' onClick={onDelete} aria-label='학기 삭제'>
          <img src={closeCircleIcon} alt='삭제' width={22} height={22} />
        </ClearButton>
      </Styled.Header>

      {award.achievements.map((achievement, index) => (
        <Styled.AchievementRow key={index}>
          <Styled.AchievementInput
            value={achievement}
            placeholder='수상내역을 입력하세요'
            onChange={(e) => handleAchievementChange(index, e.target.value)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
          />
          {focusedIndex === index && achievement.length > 0 && (
            <ClearButton
              type='button'
              onMouseDown={(e) => {
                e.preventDefault();
                handleAchievementChange(index, '');
              }}
              aria-label='내용 지우기'
            >
              <ClearButtonIcon />
            </ClearButton>
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
