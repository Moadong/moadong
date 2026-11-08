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

      <Styled.Recruit>
        <Styled.RecruitText>
          모아동을 함께 만들 디자이너와 개발자를 찾고 있어요.
        </Styled.RecruitText>
        <Styled.RecruitLink as={Link} to='/recruit'>
          팀원 모집 보러 가기
        </Styled.RecruitLink>
      </Styled.Recruit>

      <Styled.Contact>
        <Styled.ContactStrong>궁금한 점이 있으신가요?</Styled.ContactStrong>
        <Styled.ContactSoft>
          아래 이메일로 편하게 연락 주세요 :)
        </Styled.ContactSoft>
        <Styled.ContactMail href={`mailto:${TEAM_CONTACT_EMAIL}`}>
          {TEAM_CONTACT_EMAIL}
        </Styled.ContactMail>
      </Styled.Contact>
    </SubpageLayout>
  );
};

export default TeamPage;
