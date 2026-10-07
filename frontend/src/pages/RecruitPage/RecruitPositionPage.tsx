import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import isInAppWebView from '@/utils/isInAppWebView';
import RecruitLayout from './components/RecruitLayout/RecruitLayout';
import { MOADONG_CLUB_ID, RECRUIT_POSITIONS } from './constants/recruit';
import type { RecruitPosition } from './constants/recruit';
import * as Styled from './RecruitPositionPage.styles';

const RecruitPositionPage = () => {
  const { position: positionId } = useParams<{ position: string }>();
  const position = RECRUIT_POSITIONS.find(({ id }) => id === positionId);

  useTrackPageView(PAGE_VIEW.RECRUIT_POSITION_PAGE, { skip: !position });

  if (!position) return <Navigate to='/recruit' replace />;
  return <RecruitPositionContent position={position} />;
};

/**
 * 조회·리다이렉트와 렌더를 나눈다. React Compiler가 프로퍼티 읽기를 가드 위로 끌어올려도
 * 여기서는 position이 항상 있다
 */
const RecruitPositionContent = ({
  position,
}: {
  position: RecruitPosition;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 공유 링크로 바로 들어오면 이전 화면이 없어 상단바가 '/'로 보낸다. 목록으로 돌려보낸다.
  // 앱 웹뷰는 뒤로가기를 앱이 처리하므로 건드리지 않는다
  const hasNoPreviousPage = location.key === 'default';
  const handleBackToList =
    hasNoPreviousPage && !isInAppWebView()
      ? () => navigate('/recruit', { replace: true })
      : undefined;

  // 동아리·지원서가 아직 없으면 지원서 페이지가 오류를 띄우고 튕겨 내므로 버튼을 막는다
  const applicationPath =
    MOADONG_CLUB_ID && position.applicationFormId
      ? `/application/${MOADONG_CLUB_ID}/${position.applicationFormId}`
      : null;

  const sections = [
    { title: '이런 일을 해요', items: position.responsibilities },
    { title: '자격요건', items: position.qualifications },
    { title: '우대사항', items: position.preferred },
  ];

  return (
    <RecruitLayout onBack={handleBackToList}>
      <Styled.BackLink to='/recruit'>← 전체 포지션</Styled.BackLink>
      <Styled.Header>
        <Styled.Title>{position.title}</Styled.Title>
        <Styled.Summary>{position.summary}</Styled.Summary>
      </Styled.Header>

      {sections.map((section) => (
        <Styled.Section key={section.title}>
          <Styled.SectionTitle>{section.title}</Styled.SectionTitle>
          <Styled.ItemList>
            {section.items.map((item) => (
              <Styled.Item key={item}>{item}</Styled.Item>
            ))}
          </Styled.ItemList>
        </Styled.Section>
      ))}

      <Styled.ApplyArea>
        {applicationPath ? (
          <Styled.ApplyLink to={applicationPath}>지원하기</Styled.ApplyLink>
        ) : (
          <Styled.ApplyButton type='button' disabled>
            모집 준비 중이에요
          </Styled.ApplyButton>
        )}
      </Styled.ApplyArea>
    </RecruitLayout>
  );
};

export default RecruitPositionPage;
