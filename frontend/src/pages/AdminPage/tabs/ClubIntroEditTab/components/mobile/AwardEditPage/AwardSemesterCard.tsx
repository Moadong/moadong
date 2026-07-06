import addIcon from '@/assets/images/icons/add_icon.svg';
import closeCircleIcon from '@/assets/images/icons/close_circle_icon.svg';
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
      achievements: award.achievements.map((a, i) =>
        i === index ? value : a,
      ),
    });
  };

  const handleAchievementDelete = (index: number) => {
    onChange({
      ...award,
      achievements: award.achievements.filter((_, i) => i !== index),
    });
  };

  const handleAddAchievement = () => {
    onChange({ ...award, achievements: [...award.achievements, ''] });
  };

  return (
    <Styled.Card>
      <Styled.Header>
        <Styled.SemesterLabel>{semesterLabel}</Styled.SemesterLabel>
        <Styled.DeleteButton
          type='button'
          onClick={onDelete}
          aria-label='학기 삭제'
        >
          <img src={closeCircleIcon} alt='삭제' width={22} height={22} />
        </Styled.DeleteButton>
      </Styled.Header>

      {award.achievements.map((achievement, index) => (
        <Styled.AchievementRow key={index}>
          <Styled.AchievementInput
            value={achievement}
            placeholder='수상내역을 입력하세요'
            onChange={(e) => handleAchievementChange(index, e.target.value)}
          />
          <Styled.DeleteButton
            type='button'
            onClick={() => handleAchievementDelete(index)}
            aria-label='수상내역 삭제'
          >
            <img src={closeCircleIcon} alt='삭제' width={22} height={22} />
          </Styled.DeleteButton>
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
