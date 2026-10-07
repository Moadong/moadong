import type { ComponentType } from 'react';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import PaintIllustration from './components/PositionIllustration/PaintIllustration';
import SpaceIllustration from './components/PositionIllustration/SpaceIllustration';
import RecruitLayout from './components/RecruitLayout/RecruitLayout';
import {
  RECRUIT_PERIOD,
  RECRUIT_POSITIONS,
  RECRUIT_SCHEDULE,
  RECRUIT_VALUES,
} from './constants/recruit';
import type { RecruitPositionId } from './constants/recruit';
import * as Styled from './RecruitPage.styles';

const POSITION_ILLUSTRATIONS: Record<RecruitPositionId, ComponentType> = {
  designer: PaintIllustration,
  developer: SpaceIllustration,
};

const RecruitPage = () => {
  useTrackPageView(PAGE_VIEW.RECRUIT_PAGE);

  return (
    <RecruitLayout>
      <Styled.Hero>
        <Styled.Eyebrow>MOADONG RECRUIT</Styled.Eyebrow>
        <Styled.HeroTitle>
          {'모아동을 함께 만들\n팀원을 찾아요'}
        </Styled.HeroTitle>
        <Styled.HeroDescription>
          {
            '동아리를 찾고, 지원하고, 소식을 받는 모든 과정을 모아동에서.\n학생들의 동아리 생활을 더 쉽게 만들 디자이너와 개발자를 모집해요.'
          }
        </Styled.HeroDescription>
        <Styled.Period>{RECRUIT_PERIOD}</Styled.Period>
      </Styled.Hero>

      <Styled.Section aria-labelledby='recruit-positions'>
        <Styled.SectionTitle id='recruit-positions'>
          모집 포지션
        </Styled.SectionTitle>
        <Styled.PositionGrid>
          {RECRUIT_POSITIONS.map((position) => {
            const Illustration = POSITION_ILLUSTRATIONS[position.id];
            return (
              <li key={position.id}>
                <Styled.PositionCard
                  to={`/recruit/${position.id}`}
                  $variant={position.id}
                >
                  <Styled.PositionText>
                    <Styled.PositionTitle>
                      {position.title}
                    </Styled.PositionTitle>
                    <Styled.PositionSummary>
                      {position.summary}
                    </Styled.PositionSummary>
                    <Styled.PositionMore aria-hidden>
                      자세히 보기 →
                    </Styled.PositionMore>
                  </Styled.PositionText>
                  <Styled.PositionArt>
                    <Illustration />
                  </Styled.PositionArt>
                </Styled.PositionCard>
              </li>
            );
          })}
        </Styled.PositionGrid>
      </Styled.Section>

      <Styled.Section aria-labelledby='recruit-values'>
        <Styled.SectionTitle id='recruit-values'>
          이런 분과 함께하고 싶어요
        </Styled.SectionTitle>
        <Styled.ValueList>
          {RECRUIT_VALUES.map((value) => (
            <Styled.ValueItem key={value.title}>
              <Styled.ValueTitle>{value.title}</Styled.ValueTitle>
              <Styled.ValueDescription>
                {value.description}
              </Styled.ValueDescription>
            </Styled.ValueItem>
          ))}
        </Styled.ValueList>
      </Styled.Section>

      <Styled.Section aria-labelledby='recruit-schedule'>
        <Styled.SectionTitle id='recruit-schedule'>
          모집 일정
        </Styled.SectionTitle>
        <Styled.ScheduleList>
          {RECRUIT_SCHEDULE.map((item, index) => (
            <Styled.ScheduleItem key={item.step}>
              <Styled.ScheduleIndex>
                {String(index + 1).padStart(2, '0')}
              </Styled.ScheduleIndex>
              <Styled.ScheduleStep>{item.step}</Styled.ScheduleStep>
              <Styled.ScheduleDate>{item.date}</Styled.ScheduleDate>
            </Styled.ScheduleItem>
          ))}
        </Styled.ScheduleList>
      </Styled.Section>
    </RecruitLayout>
  );
};

export default RecruitPage;
