import rightArrowIcon from '@/assets/images/icons/right_arrow_icon.svg';
import { Award, SemesterTerm } from '@/types/club';
import * as Styled from './AwardSection.styles';

interface AwardSectionProps {
  awards: Award[];
  onNavigate?: (award?: Award) => void;
}

const getSortValue = (award: Award): number => {
  const semesterValue = award.semesterTerm === SemesterTerm.FIRST ? 1 : 2;
  return award.year * 10 + semesterValue;
};

const formatSemesterLabel = (award: Award): string => {
  const semesterLabel =
    award.semesterTerm === SemesterTerm.FIRST ? '1학기' : '2학기';
  return `${award.year} ${semesterLabel}`;
};

const AwardSection = ({ awards, onNavigate }: AwardSectionProps) => {
  const isEmpty = awards.length === 0;
  const sortedAwards = [...awards].sort(
    (a, b) => getSortValue(b) - getSortValue(a),
  );

  return (
    <Styled.Wrapper>
      <Styled.Header>
        <Styled.Label>
          {isEmpty ? '이런 상을 받았어요' : '동아리 성과'}
        </Styled.Label>
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
