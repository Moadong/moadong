import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import locationIcon from '@/assets/images/icons/location_icon.svg';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import DefaultLogo from '@/assets/images/logos/default_profile_image.svg';
import { MapContainer } from '@/components/map/NaverMap.styles';
import { useNaverMap } from '@/components/map/useNaverMap';
import { clubLocations } from '@/constants/clubLocation';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { requestNavigateBack } from '@/utils/webviewBridge';
import * as Styled from './ClubMapPage.styles';

const ClubMapPage = () => {
  const navigate = useNavigate();
  const { clubId, clubName } = useParams<{
    clubId: string;
    clubName: string;
  }>();

  const {
    data: clubDetail,
    isLoading,
    error,
  } = useGetClubDetail((clubName ?? clubId) || '');

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

  return (
    <Styled.Container>
      <Styled.BackButton onClick={handleBackClick} aria-label='뒤로가기'>
        <PrevButtonIcon width={30} height={30} />
      </Styled.BackButton>

      {isLoading && <Styled.StatusMessage>불러오는 중...</Styled.StatusMessage>}
      {!isLoading && error && (
        <Styled.StatusMessage>
          동아리 정보를 불러오지 못했어요.
        </Styled.StatusMessage>
      )}
      {!isLoading && !error && clubDetail && !clubLocation && (
        <Styled.StatusMessage>
          동아리방 위치 정보가 없어요.
        </Styled.StatusMessage>
      )}

      {clubDetail && clubLocation && (
        <>
          <Styled.MapWrapper>
            <MapContainer ref={mapRef} />
          </Styled.MapWrapper>

          <Styled.BottomCard>
            <Styled.ClubLogo
              src={clubDetail.logo || DefaultLogo}
              alt={`${clubDetail.name} 로고`}
            />
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
        </>
      )}
    </Styled.Container>
  );
};

export default ClubMapPage;
