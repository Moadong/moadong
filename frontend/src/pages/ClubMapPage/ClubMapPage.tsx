import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import MapClubInfoCard from '@/components/map/MapClubInfoCard/MapClubInfoCard';
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

          <Styled.BottomCardWrapper>
            <MapClubInfoCard
              logo={clubDetail.logo}
              name={clubDetail.name}
              building={clubLocation.building}
              detailLocation={clubLocation.detailLocation}
            />
          </Styled.BottomCardWrapper>
        </>
      )}
    </Styled.Container>
  );
};

export default ClubMapPage;
