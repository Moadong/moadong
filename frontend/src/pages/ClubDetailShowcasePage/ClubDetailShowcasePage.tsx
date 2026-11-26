// 새 동아리 상세페이지 시안을 팀에 공유하려고 분과별 2개 동아리를 모아 둔 임시 목록 페이지
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import { SHOWCASE_CLUBS } from '@/mocks/data/clubInsightsShowcaseMock';
import {
  Emoji,
  TossfaceStylesheet,
} from '@/pages/IntroducePage/components/Tossface/Tossface';
import * as Styled from './ClubDetailShowcasePage.styles';

const CATEGORY_EMOJI: Record<string, string> = {
  공연: '🎤',
  운동: '⚾',
  학술: '📚',
  취미교양: '🎨',
  봉사: '🤝',
  종교: '🕊️',
};

const ClubDetailShowcasePage = () => (
  <>
    <TossfaceStylesheet />
    <Header hideOn={['mobile', 'tablet']} />
    <Styled.Page>
      <Styled.Hero>
        <Styled.Badge>시안 미리보기</Styled.Badge>
        <Styled.Title>새 동아리 상세페이지</Styled.Title>
        <Styled.Lead>
          신입생이 &ldquo;나랑 맞을까?&rdquo;를 바로 판단할 수 있게 다시 짠
          상세페이지예요. 분과마다 두 동아리씩 골라 두었어요.
        </Styled.Lead>
        <Styled.Notice>
          동아리 이름·소개·사진·FAQ·일정과 지원 방법은 실제 데이터예요.
          <br />
          한눈에 보기·부원 키워드·나랑 맞을까·1년 활동·부원 한마디는 실제
          소개글을 바탕으로 만든 <strong>예시 데이터</strong>예요.
        </Styled.Notice>
      </Styled.Hero>

      <Styled.CategoryList>
        {SHOWCASE_CLUBS.map(({ category, clubs }) => (
          <Styled.Category key={category}>
            <Styled.CategoryTitle>
              <Emoji aria-hidden>{CATEGORY_EMOJI[category] ?? '✨'}</Emoji>
              {category}
            </Styled.CategoryTitle>
            <Styled.ClubGrid>
              {clubs.map((club) => (
                <Styled.ClubCard key={club.id}>
                  <Link to={`/clubDetail/${club.id}`}>
                    <Styled.ClubName>{club.name}</Styled.ClubName>
                    <Styled.ClubSummary>{club.summary}</Styled.ClubSummary>
                    <Styled.Go aria-hidden>보러 가기 →</Styled.Go>
                  </Link>
                </Styled.ClubCard>
              ))}
            </Styled.ClubGrid>
          </Styled.Category>
        ))}
      </Styled.CategoryList>
    </Styled.Page>
  </>
);

export default ClubDetailShowcasePage;
