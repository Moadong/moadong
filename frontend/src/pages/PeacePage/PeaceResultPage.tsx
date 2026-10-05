import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from 'styled-components';
import chevronIcon from '@/assets/images/icons/chevron_right_small.svg';
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
import { PEACE_QUESTIONS } from './data/questions';
import { useIdleReset } from './hooks/useIdleReset';
import { PeaceSource, usePeaceParams } from './hooks/usePeaceParams';
import * as Styled from './PeaceResultPage.styles';
import { rankPeaceTypes, scorePeaceTypes } from './utils/calculatePeaceType';

/** 방문객 폰에서 열 결과 링크. 부스 모드 플래그는 빼고 답과 유입 경로만 붙인다 */
const buildResultUrl = (
  type: PeaceTypeId,
  answersParam: string | null,
  source: PeaceSource,
) => {
  const params = new URLSearchParams({ type });
  if (answersParam) params.set('a', answersParam);
  params.set('src', source);
  return `${window.location.origin}/peace/result?${params.toString()}`;
};

/** a=01230123 형식(문항 수만큼의 0~3)만 답으로 인정한다 */
const ANSWERS_PATTERN = new RegExp(`^[0-3]{${PEACE_QUESTIONS.length}}$`);
const parseAnswers = (value: string | null): number[] | null =>
  value && ANSWERS_PATTERN.test(value) ? [...value].map(Number) : null;

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
  // 순위는 퀴즈와 같은 rankPeaceTypes로 정한다. 1위가 type과 다르면(손으로 고친 링크) 답을 버린다
  const parsedAnswers = parseAnswers(searchParams.get('a'));
  const ranked = parsedAnswers ? rankPeaceTypes(parsedAnswers) : null;
  const answers = ranked?.[0] === type.id ? parsedAnswers : null;
  const answersParam = answers ? searchParams.get('a') : null;
  const scores = answers ? scorePeaceTypes(answers) : null;
  const shares =
    ranked && scores
      ? ranked.map((id) => ({
          type: PEACE_TYPES[id],
          percent: Math.round((scores[id] / PEACE_QUESTIONS.length) * 100),
        }))
      : null;
  const partner = PEACE_TYPES[type.partner];
  const palette = theme.colors.secondary[type.colorIndex];

  const handleClubClick = (club: Club) => {
    trackEvent(USER_EVENT.PEACE_CLUB_CARD_CLICKED, {
      type: type.id,
      club_name: club.name,
      src,
    });
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
    const url = buildResultUrl(type.id, answersParam, 'share');
    trackEvent(USER_EVENT.PEACE_SHARE_CLICKED, { type: type.id, src });
    handleShare({
      title: PEACE_PAGE_TITLE,
      text: `나는 ${type.name}! ${type.catchphrase} ${url}`,
      url,
    });
  };

  return (
    <PeaceLayout tint={palette.back}>
      <Styled.CardSection>
        <Styled.Lead>당신의 평화 유형은</Styled.Lead>
        <ResultCard type={type} />
        {shares && (
          <Styled.ShareList aria-label='유형별 비율'>
            {shares.map(({ type: t, percent }) => (
              <Styled.ShareRow key={t.id}>
                <Styled.ShareName>{t.name}</Styled.ShareName>
                <Styled.ShareBar>
                  <Styled.ShareFill
                    $percent={percent}
                    $color={theme.colors.secondary[t.colorIndex].main}
                  />
                </Styled.ShareBar>
                <Styled.SharePercent>{`${percent}%`}</Styled.SharePercent>
              </Styled.ShareRow>
            ))}
          </Styled.ShareList>
        )}
      </Styled.CardSection>

      <Styled.Detail>
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
        부경대 학생이라면?
        <Styled.ToggleIcon src={chevronIcon} alt='' $open={isStudentOpen} />
      </Styled.StudentToggle>
      {isStudentOpen && (
        <Styled.StudentPanel>
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
            value={buildResultUrl(type.id, answersParam, 'qr')}
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
