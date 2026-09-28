import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from 'styled-components';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import useShare from '@/hooks/useShare';
import { Club } from '@/types/club';
import PeaceLayout, {
  PEACE_PAGE_TITLE,
} from './components/PeaceLayout/PeaceLayout';
import RecommendedClubs from './components/RecommendedClubs/RecommendedClubs';
import ResultCard from './components/ResultCard/ResultCard';
import { KIOSK_IDLE_MS } from './constants/kiosk';
import { isPeaceTypeId, PEACE_TYPES, PeaceTypeId } from './data/peaceTypes';
import { useIdleReset } from './hooks/useIdleReset';
import { PeaceSource, usePeaceParams } from './hooks/usePeaceParams';
import * as Styled from './PeaceResultPage.styles';

/** 방문객 폰에서 열 결과 링크. 부스 모드 플래그는 빼고 유입 경로만 붙인다 */
const buildResultUrl = (
  type: PeaceTypeId,
  sub: PeaceTypeId | undefined,
  source: PeaceSource,
) => {
  const params = new URLSearchParams({ type });
  if (sub) params.set('sub', sub);
  params.set('src', source);
  return `${window.location.origin}/peace/result?${params.toString()}`;
};

const PeaceResultPage = () => {
  useTrackPageView(PAGE_VIEW.PEACE_RESULT_PAGE);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const { handleShare } = useShare();
  const theme = useTheme();
  const { isKiosk, src, withParams } = usePeaceParams();
  const [isStudentOpen, setIsStudentOpen] = useState(false);

  useIdleReset(isKiosk, KIOSK_IDLE_MS, () =>
    navigate(withParams('/peace'), { replace: true }),
  );

  const typeParam = searchParams.get('type');
  if (!isPeaceTypeId(typeParam)) {
    return <Navigate to={withParams('/peace')} replace />;
  }

  const type = PEACE_TYPES[typeParam];
  const subParam = searchParams.get('sub');
  const sub =
    isPeaceTypeId(subParam) && subParam !== type.id
      ? PEACE_TYPES[subParam]
      : undefined;
  const partner = PEACE_TYPES[type.partner];
  const palette = theme.colors.secondary[type.colorIndex];

  const handleClubClick = (club: Club) => {
    trackEvent(USER_EVENT.PEACE_CLUB_CARD_CLICKED, {
      type: type.id,
      clubName: club.name,
      src,
    });
    navigate(`/clubDetail/@${encodeURIComponent(club.name)}`);
  };

  const handleRetry = () => {
    trackEvent(USER_EVENT.PEACE_RETRY_CLICKED, { type: type.id, src });
    navigate(withParams('/peace'), { replace: true });
  };

  const handleStudentToggle = () => {
    if (!isStudentOpen) {
      trackEvent(USER_EVENT.PEACE_STUDENT_TOGGLE_OPENED, {
        type: type.id,
        src,
      });
    }
    setIsStudentOpen((prev) => !prev);
  };

  const handleShareClick = () => {
    const url = buildResultUrl(type.id, sub?.id, 'share');
    trackEvent(USER_EVENT.PEACE_SHARE_CLICKED, { type: type.id, src });
    handleShare({
      title: PEACE_PAGE_TITLE,
      text: `나는 ${type.name}! ${type.catchphrase} ${url}`,
      url,
    });
  };

  return (
    <PeaceLayout>
      <Styled.CardSection>
        <Styled.Lead>당신의 평화 유형은</Styled.Lead>
        <ResultCard type={type} />
        {sub && (
          <Styled.SubLine>
            {`당신 안에는 ${sub.name}도 있어요 ${sub.symbol}`}
          </Styled.SubLine>
        )}
      </Styled.CardSection>

      <Styled.Detail $back={palette.back}>
        <div>
          <Styled.SectionTitle>{`${type.name}는 이런 사람이에요`}</Styled.SectionTitle>
          <Styled.Body>{type.description}</Styled.Body>
          <Styled.ChipList>
            {type.strengths.map((word) => (
              <Styled.Chip key={word} $main={palette.main}>
                {`#${word}`}
              </Styled.Chip>
            ))}
          </Styled.ChipList>
        </div>
        <div>
          <Styled.SectionTitle>이럴 때 빛나요</Styled.SectionTitle>
          <Styled.Body>{type.shinesWhen}</Styled.Body>
        </div>
        <div>
          <Styled.SectionTitle>가끔은 이런 면도</Styled.SectionTitle>
          <Styled.Body>{type.caution}</Styled.Body>
        </div>
        <div>
          <Styled.SectionTitle>오늘의 작은 평화 행동</Styled.SectionTitle>
          <Styled.ActionList>
            {type.smallActions.map((action) => (
              <Styled.ActionItem key={action}>{action}</Styled.ActionItem>
            ))}
          </Styled.ActionList>
        </div>
        <div>
          <Styled.SectionTitle>{`잘 맞는 평화 파트너 · ${partner.name} ${partner.symbol}`}</Styled.SectionTitle>
          <Styled.Body>{type.partnerReason}</Styled.Body>
        </div>
      </Styled.Detail>

      <Styled.StudentToggle
        type='button'
        onClick={handleStudentToggle}
        aria-expanded={isStudentOpen}
      >
        {`부경대 학생이라면? ${isStudentOpen ? '▲' : '▼'}`}
      </Styled.StudentToggle>
      {isStudentOpen && (
        <Styled.StudentPanel $back={palette.back}>
          <div>
            <Styled.SectionTitle>{`${type.category} 분과 동아리에서는`}</Styled.SectionTitle>
            <Styled.Body>{type.divisionIntro}</Styled.Body>
          </div>
          <div>
            <Styled.SectionTitle>이런 동아리는 어때요</Styled.SectionTitle>
            <RecommendedClubs
              category={type.category}
              accent={palette.main}
              onClubClick={handleClubClick}
            />
          </div>
        </Styled.StudentPanel>
      )}

      {isKiosk && (
        <Styled.QrBlock>
          <QRCodeSVG
            value={buildResultUrl(type.id, sub?.id, 'qr')}
            size={168}
          />
          <Styled.QrCaption>
            내 폰 카메라로 찍으면 이 결과를 가져갈 수 있어요
          </Styled.QrCaption>
        </Styled.QrBlock>
      )}
      <Styled.ShareButton type='button' onClick={handleShareClick}>
        공유하기
      </Styled.ShareButton>

      <Styled.RetryButton type='button' onClick={handleRetry}>
        다시하기
      </Styled.RetryButton>

      {/* 카드 심볼 SVG(Twemoji, CC BY 4.0) 저작자 표기 */}
      <Styled.Credit>
        아이콘:{' '}
        <a
          href='https://github.com/jdecked/twemoji'
          target='_blank'
          rel='noopener noreferrer'
        >
          Twemoji
        </a>{' '}
        © Twitter, Inc. (
        <a
          href='https://creativecommons.org/licenses/by/4.0/'
          target='_blank'
          rel='noopener noreferrer'
        >
          CC BY 4.0
        </a>
        )
      </Styled.Credit>
    </PeaceLayout>
  );
};

export default PeaceResultPage;
