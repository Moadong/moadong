import LocationIcon from '@/assets/images/icons/location_icon.svg';
import TimeIcon from '@/assets/images/icons/time_icon.svg';
import { formatKSTDate } from '@/utils/formatKSTDateTime';
import * as Styled from './CardMeta.styles';

interface CardMetaProps {
  title: string;
  location: string | null;
  startDate: string;
}

const CardMeta = ({ title, location, startDate }: CardMetaProps) => {
  const formattedStartDate = formatKSTDate(startDate);

  return (
    <Styled.Container>
      <Styled.Title>{title}</Styled.Title>

      <Styled.MetaContainer>
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
      </Styled.MetaContainer>
    </Styled.Container>
  );
};

export default CardMeta;
