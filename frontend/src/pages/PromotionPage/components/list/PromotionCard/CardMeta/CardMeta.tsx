import LocationIcon from '@/assets/images/icons/location_icon.svg';
import TimeIcon from '@/assets/images/icons/time_icon.svg';
import * as Styled from './CardMeta.styles';

interface CardMetaProps {
  title: string;
  description: string;
  location: string | null;
  startDate: string;
}

const CardMeta = ({
  title,
  description,
  location,
  startDate,
}: CardMetaProps) => {
  const startDateObj = new Date(startDate);
  const formattedStartDate = startDateObj.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <Styled.Container>
      <Styled.TitleSection>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Description>{description}</Styled.Description>
      </Styled.TitleSection>

      {location && (
        <Styled.MetaRow>
          <Styled.Icon>
            <img src={LocationIcon} alt='Location' />
          </Styled.Icon>
          <Styled.MetaText>{location}</Styled.MetaText>
        </Styled.MetaRow>
      )}

      <Styled.MetaRow>
        <Styled.Icon>
          <img src={TimeIcon} alt='Time' />
        </Styled.Icon>
        <Styled.MetaText>{formattedStartDate}</Styled.MetaText>
      </Styled.MetaRow>
    </Styled.Container>
  );
};

export default CardMeta;
