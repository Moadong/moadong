import rightArrowIcon from '@/assets/images/icons/right_arrow_icon.svg';
import { Award, SemesterTerm } from '@/types/club';
import InfoSection from '../InfoSection/InfoSection';
import * as Styled from './AwardSection.styles';

interface Props {
  awards: Award[];
  onNavigate?: (award?: Award) => void;
}

const getSemesterSortValue = (award: Award): number => {
  const semesterValue = award.semesterTerm === SemesterTerm.FIRST ? 1 : 2;
  return award.year * 10 + semesterValue;
};

const formatSemesterLabel = (award: Award): string => {
  const semesterLabel =
    award.semesterTerm === SemesterTerm.FIRST ? '1학기' : '2학기';
  return `${award.year} ${semesterLabel}`;
};

const AwardSection = ({ awards, onNavigate }: Props) => {
  const label = awards.length === 0 ? '이런 상을 받았어요' : '동아리 성과';

  const sortedAwards = [...awards].sort(
    (a, b) => getSemesterSortValue(b) - getSemesterSortValue(a),
  );

  return (
    <InfoSection label={label}>
      <Styled.Content>
        {awards.length === 0 ? (
          <Styled.Row onClick={() => onNavigate?.()}>
            <Styled.EmptyText>없음</Styled.EmptyText>
            <Styled.NavButton as='span'>
              <img src={rightArrowIcon} alt='편집' />
            </Styled.NavButton>
          </Styled.Row>
        ) : (
          sortedAwards.map((award) => (
            <Styled.Row
              key={`${award.year}-${award.semesterTerm}`}
              onClick={() => onNavigate?.(award)}
            >
              <Styled.SemesterChip>
                {formatSemesterLabel(award)}
              </Styled.SemesterChip>
              <Styled.RightArea>
                <Styled.CountText>{award.achievements.length}</Styled.CountText>
                <Styled.NavButton as='span'>
                  <img src={rightArrowIcon} alt='편집' />
                </Styled.NavButton>
              </Styled.RightArea>
            </Styled.Row>
          ))
        )}
      </Styled.Content>
    </InfoSection>
  );
};

export default AwardSection;
