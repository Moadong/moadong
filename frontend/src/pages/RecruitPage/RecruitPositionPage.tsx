import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ChevronRightIcon from '@/assets/images/icons/chevron_right_small.svg?react';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
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
  const navigate = useNavigate();
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

  // 공유 링크로 바로 들어와 이전 화면이 없으면 상단바 뒤로가기가 '/' 대신 목록으로 간다
  return (
    <RecruitLayout backFallbackPath='/recruit' hasFixedBottomButton>
      <Styled.BackLink to='/recruit'>
        <ChevronRightIcon aria-hidden />
        전체 포지션
      </Styled.BackLink>
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

      {/* 동아리 상세의 지원하기와 같은 하단 고정 버튼을 쓴다 */}
      <FixedBottomButtonArea
        onClick={() => applicationPath && navigate(applicationPath)}
        disabled={!applicationPath}
      >
        {applicationPath ? '지원하기' : '모집 준비 중이에요'}
      </FixedBottomButtonArea>
    </RecruitLayout>
  );
};

export default RecruitPositionPage;
