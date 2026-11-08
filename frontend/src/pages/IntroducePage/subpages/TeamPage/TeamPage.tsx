// 모아동을 만드는 팀의 이야기를 사진 없이 글로 들려주는 만드는 사람들 페이지
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import {
  TEAM_CONTACT_EMAIL,
  TEAM_INTRO,
  TEAM_STORIES,
} from '../../constants/team';
import SubpageLayout from '../SubpageLayout/SubpageLayout';
import * as Styled from './TeamPage.styles';

/** 문구 속 \n을 줄바꿈으로 그린다 */
const withLineBreaks = (text: string) =>
  text.split('\n').map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));

const TeamPage = () => {
  useTrackPageView(PAGE_VIEW.INTRODUCE_TEAM_PAGE);

  return (
    <SubpageLayout>
      <Styled.Intro>
        <Styled.Title>만드는 사람들</Styled.Title>
        {TEAM_INTRO.map((paragraph) => (
          <Styled.Lead key={paragraph}>{paragraph}</Styled.Lead>
        ))}
      </Styled.Intro>

      {TEAM_STORIES.map(({ title, paragraphs }) => (
        <Styled.Story key={title}>
          <Styled.StoryTitle>{withLineBreaks(title)}</Styled.StoryTitle>
          <Styled.StoryBody>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Styled.StoryBody>
        </Styled.Story>
      ))}

      {/* 엘스 소개 끝처럼 굵은 질문 · 옅은 안내 · 굵은 행동을 같은 큰 글씨로 잇는다 */}
      <Styled.Closing>
        <Styled.ClosingBlock
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Styled.ClosingStrong>
            모아동을 함께 만들어 볼래요?
          </Styled.ClosingStrong>
          <Styled.ClosingSoft>
            디자이너와 개발자를 찾고 있어요
          </Styled.ClosingSoft>
          <Styled.ClosingAction as={Link} to='/recruit'>
            팀원 모집 보러 가기
            <Styled.Arrow aria-hidden='true'>→</Styled.Arrow>
          </Styled.ClosingAction>
        </Styled.ClosingBlock>
        <Styled.ClosingBlock
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Styled.ClosingStrong>궁금한 점이 있으신가요?</Styled.ClosingStrong>
          <Styled.ClosingSoft>메일로 편하게 연락 주세요 :)</Styled.ClosingSoft>
          <Styled.ClosingAction href={`mailto:${TEAM_CONTACT_EMAIL}`}>
            {TEAM_CONTACT_EMAIL}
          </Styled.ClosingAction>
        </Styled.ClosingBlock>
      </Styled.Closing>
    </SubpageLayout>
  );
};

export default TeamPage;
