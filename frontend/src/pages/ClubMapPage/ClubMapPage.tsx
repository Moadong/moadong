import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import locationIcon from '@/assets/images/icons/location_icon.svg';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import { useNaverMap } from '@/components/map/useNaverMap';
import { MapContainer } from '@/components/map/NaverMap.styles';
import { clubLocations } from '@/constants/clubLocation';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import {
  requestNavigateBack,
} from '@/utils/webviewBridge';
import * as Styled from './ClubMapPage.styles';

const ClubMapPage = () => {
  const navigate = useNavigate();
  const { clubId, clubName } = useParams<{
    clubId: string;
    clubName: string;
  }>();

  const { data: clubDetail } = useGetClubDetail((clubName ?? clubId) || '');

  const clubLocation = clubLocations.find(
    (loc) => loc.clubName === clubDetail?.name,
  );

  const mapRef = useRef<HTMLDivElement | null>(null);

  useNaverMap(mapRef, clubLocation?.lat ?? 0, clubLocation?.lng ?? 0, {
    bubbleText: '동아리방',
  });

  const handleBackClick = () => {
    const handled = requestNavigateBack();
    if (!handled) {
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  if (!clubDetail || !clubLocation) return null;

  return (
    <Styled.Container>
      <Styled.MapWrapper>
        <MapContainer ref={mapRef} />
      </Styled.MapWrapper>

      <Styled.BackButton onClick={handleBackClick} aria-label='뒤로가기'>
        <PrevButtonIcon width={30} height={30} />
      </Styled.BackButton>

      <Styled.BottomCard>
        <Styled.ClubLogo src={clubDetail.logo} alt={`${clubDetail.name} 로고`} />
        <Styled.ClubInfo>
          <Styled.ClubName>{clubDetail.name}</Styled.ClubName>
          <Styled.LocationRow>
            <img src={locationIcon} alt='위치 아이콘' />
            <Styled.LocationText>
              {clubLocation.building} {clubLocation.detailLocation}
            </Styled.LocationText>
          </Styled.LocationRow>
        </Styled.ClubInfo>
      </Styled.BottomCard>
    </Styled.Container>
  );
};

export default ClubMapPage;
