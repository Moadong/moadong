import rightArrowIcon from '@/assets/images/icons/right_arrow_icon.svg';
import { Award } from '@/types/club';
import { formatSemesterLabel, getAwardSortValue } from '@/utils/awardHelpers';
import * as Styled from './AwardSection.styles';

interface AwardSectionProps {
  awards: Award[];
  onNavigate?: (award?: Award) => void;
}

const AwardSection = ({ awards, onNavigate }: AwardSectionProps) => {
  const isEmpty = awards.length === 0;
  const sortedAwards = [...awards].sort(
    (a, b) => getAwardSortValue(b) - getAwardSortValue(a),
  );

  return (
    <Styled.Wrapper>
      <Styled.Header>
        <Styled.Label>이런 상을 받았어요</Styled.Label>
      </Styled.Header>
      <Styled.Card>
        {isEmpty ? (
          <Styled.AwardRow onClick={() => onNavigate?.()}>
            <Styled.EmptyText>없음</Styled.EmptyText>
            <Styled.NavButton>
              <img src={rightArrowIcon} alt='편집' />
            </Styled.NavButton>
          </Styled.AwardRow>
        ) : (
          sortedAwards.map((award) => (
            <Styled.AwardRow
              key={`${award.year}-${award.semesterTerm}`}
              onClick={() => onNavigate?.(award)}
            >
              <Styled.SemesterChip>
                {formatSemesterLabel(award)}
              </Styled.SemesterChip>
              <Styled.RightArea>
                <Styled.AchievementCount>
                  {award.achievements.length}
                </Styled.AchievementCount>
                <Styled.NavButton>
                  <img src={rightArrowIcon} alt='편집' />
                </Styled.NavButton>
              </Styled.RightArea>
            </Styled.AwardRow>
          ))
        )}
      </Styled.Card>
    </Styled.Wrapper>
  );
};

export default AwardSection;
