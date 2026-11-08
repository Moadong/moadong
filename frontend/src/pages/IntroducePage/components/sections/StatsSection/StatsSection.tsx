// 첫 화면 바로 아래에서 대상별 실제 수치를 세어 올라가며 보여주는 띠 (학생: 고를 수 있는 동아리, 운영진: 모아동으로 오는 학생)
import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useGetCardList } from '@/hooks/Queries/useClub';
import type { Audience } from '@/pages/IntroducePage/constants/audience';
import * as Styled from './StatsSection.styles';

/**
 * Mixpanel 기준 실제 값을 내림해 "+"를 붙인다(부풀리지 않는다). 모두 2026년 1학기 모집 기간(02-01 ~ 04-30) 값이다.
 * 총합은 와닿지 않아 운영진에게는 동아리별 평균, 학생에게는 1명당 평균으로 바꿔 보여 준다.
 * 다음 모집 시즌이 끝나면 같은 기준으로 다시 뽑아 갱신한다.
 * - 전체 이벤트 순사용자 9,443명 → 9,400+
 * - "ClubDetailPage Visited" 85,792회 ÷ 등록 동아리 69곳 ≈ 1,243 → 평균 1,200+
 * - "Club Apply Button Clicked" 9,826회 ÷ 69곳 ≈ 142 → 평균 140+
 * - 85,792회 ÷ 9,443명 ≈ 9.1 → 1명이 평균 9개
 */
const VISITORS = 9400;
const PAGE_VIEWS_PER_CLUB = 1200;
const APPLY_CLICKS_PER_CLUB = 140;
const CLUBS_VIEWED_PER_VISITOR = 9;

const HEADLINES: Record<Audience, string> = {
  student: '이미 많은 학생들이\n모아동에서 동아리를 찾고 있어요',
  club: '지난 모집 기간,\n동아리마다 페이지가 평균 1,200번 넘게 열렸어요',
};

/** 동아리 수는 지금 등록된 수라 따로 적지 않는다 */
const SOURCE_NOTE = '2026년 1학기 모집 기간 기준';

interface StatItem {
  label: string;
  value: number;
  unit: string;
  /** 내림한 숫자라 뒤에 +를 붙인다 */
  plus?: boolean;
}

/**
 * 화면에 들어오면 1.4초 동안 0에서 목표까지 감속하며 올라간다.
 * 큰 수는 끝자리가 계속 바뀌면 읽기 어려워서 100 단위로 올린다.
 */
const CountUp = ({ value, start }: { value: number; start: boolean }) => {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const step = value >= 1000 ? 100 : 1;

  useEffect(() => {
    if (!start || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest / step) * step),
    });
    return () => controls.stop();
  }, [start, value, reduceMotion, step]);

  return <>{(reduceMotion ? value : display).toLocaleString('ko-KR')}</>;
};

interface StatsSectionProps {
  audience: Audience;
}

const StatsSection = ({ audience }: StatsSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // 메인 화면과 같은 조회라 캐시를 함께 쓴다
  const { data } = useGetCardList({
    keyword: '',
    recruitmentStatus: 'all',
    category: 'all',
    division: 'all',
  });
  const clubCount = data?.totalCount ?? data?.clubs.length ?? 0;

  const visitors: StatItem = {
    label: '모집 기간 방문자',
    value: VISITORS,
    unit: '명',
    plus: true,
  };

  // 학생: 고를 수 있는 폭과 다른 학생들이 얼마나 둘러보는지, 운영진: 우리 동아리 한 곳이 받는 관심
  // 실시간 동아리 수는 불러오지 못했으면 빼고 보여준다
  const items: StatItem[] =
    audience === 'student'
      ? [
          ...(clubCount
            ? [
                {
                  label: '모아동에 모인 중앙동아리',
                  value: clubCount,
                  unit: '개',
                },
              ]
            : []),
          visitors,
          {
            label: '1명이 평균 둘러본 동아리',
            value: CLUBS_VIEWED_PER_VISITOR,
            unit: '개',
          },
        ]
      : [
          visitors,
          {
            label: '동아리별 평균 페이지 조회',
            value: PAGE_VIEWS_PER_CLUB,
            unit: '번',
            plus: true,
          },
          {
            label: '동아리별 평균 지원하기 클릭',
            value: APPLY_CLICKS_PER_CLUB,
            unit: '번',
            plus: true,
          },
        ];

  return (
    <Styled.Section ref={ref} aria-label='모아동 숫자로 보기'>
      <Styled.Headline>{HEADLINES[audience]}</Styled.Headline>
      <Styled.Grid $count={items.length}>
        {items.map((item) => (
          <Styled.Item key={item.label}>
            <Styled.Label>{item.label}</Styled.Label>
            <Styled.Value>
              <CountUp value={item.value} start={inView} />
              {item.plus && '+'}
              <Styled.Unit>{item.unit}</Styled.Unit>
            </Styled.Value>
          </Styled.Item>
        ))}
      </Styled.Grid>
      <Styled.SourceNote>{SOURCE_NOTE}</Styled.SourceNote>
    </Styled.Section>
  );
};

export default StatsSection;
