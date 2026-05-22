import locationIcon from '@/assets/images/icons/location_icon.svg';
import DefaultLogo from '@/assets/images/logos/default_profile_image.svg';
import * as Styled from './MapClubInfoCard.styles';

interface MapClubInfoCardProps {
  logo?: string;
  name: string;
  building: string;
  detailLocation: string;
}

const MapClubInfoCard = ({
  logo,
  name,
  building,
  detailLocation,
}: MapClubInfoCardProps) => {
  return (
    <Styled.Card>
      <Styled.ClubLogo src={logo || DefaultLogo} alt={`${name} 로고`} />
      <Styled.ClubInfo>
        <Styled.ClubName>{name}</Styled.ClubName>
        <Styled.LocationRow>
          <img src={locationIcon} alt='위치 아이콘' />
          <Styled.LocationText>
            {building} {detailLocation}
          </Styled.LocationText>
        </Styled.LocationRow>
      </Styled.ClubInfo>
    </Styled.Card>
  );
};

export default MapClubInfoCard;
