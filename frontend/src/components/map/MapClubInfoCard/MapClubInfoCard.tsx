import LocationIcon from '@/assets/images/icons/location_icon.svg?react';
import DefaultLogo from '@/assets/images/logos/default_profile_image.svg';
import cdnImage from '@/utils/cdnImage';
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
      <Styled.ClubLogo
        src={cdnImage(logo || DefaultLogo, 'logo')}
        alt={`${name} 로고`}
      />
      <Styled.ClubInfo>
        <Styled.ClubName>{name}</Styled.ClubName>
        <Styled.LocationRow>
          <LocationIcon />
          <Styled.LocationText>
            {building} {detailLocation}
          </Styled.LocationText>
        </Styled.LocationRow>
      </Styled.ClubInfo>
    </Styled.Card>
  );
};

export default MapClubInfoCard;
