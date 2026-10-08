import { useEffect, useRef, useState } from 'react';
import * as Styled from './RecruitStats.styles';

export interface RecruitStat {
  label: string;
  value: number;
  unit: string;
  desc: string;
  /** "약 18,000번"처럼 근사값 앞에 붙일 말 */
  prefix?: string;
  /** 포인트 컬러(--accent)로 칠할 숫자. 섹션에 하나만 둔다 */
  highlight?: boolean;
}

interface RecruitStatsProps {
  title: string;
  caption: string;
  stats: readonly RecruitStat[];
  closing: string;
}

const COUNT_UP_MS = 1200;
const VISIBLE_THRESHOLD = 0.3;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const formatNumber = (value: number) => value.toLocaleString('ko-KR');

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** 목록이 처음 화면에 들어온 뒤 0→1로 가는 카운트업 진행도. 한 번만 돈다 */
const useCountUpProgress = (
  targetRef: React.RefObject<HTMLElement | null>,
  reduceMotion: boolean,
) => {
  // 관찰할 수 없는 환경이면 화면에 들어온 것으로 보고 바로 센다
  const [isVisible, setIsVisible] = useState(
    () => reduceMotion || typeof IntersectionObserver === 'undefined',
  );
  const [progress, setProgress] = useState(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (isVisible || !targetRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: VISIBLE_THRESHOLD },
    );
    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [targetRef, isVisible]);

  useEffect(() => {
    if (!isVisible || reduceMotion) return;
    let frameId = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const linear = Math.min((now - startedAt) / COUNT_UP_MS, 1);
      setProgress(easeOutCubic(linear));
      if (linear < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, reduceMotion]);

  return { isVisible, progress };
};

const RecruitStats = ({
  title,
  caption,
  stats,
  closing,
}: RecruitStatsProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [reduceMotion] = useState(prefersReducedMotion);
  const { isVisible, progress } = useCountUpProgress(listRef, reduceMotion);

  return (
    <Styled.Section aria-labelledby='recruit-stats-title'>
      <Styled.Heading id='recruit-stats-title'>
        {title} <Styled.Caption>{caption}</Styled.Caption>
      </Styled.Heading>

      <Styled.Grid ref={listRef}>
        {stats.map((stat, index) => {
          const prefix = stat.prefix ? `${stat.prefix} ` : '';
          const current = Math.round(stat.value * progress);
          return (
            <Styled.Card
              key={stat.label}
              $index={index}
              $isVisible={isVisible}
              $animate={!reduceMotion}
            >
              <Styled.Label>{stat.label}</Styled.Label>
              <Styled.Value $highlight={!!stat.highlight}>
                {/* 카운트업 중에도 스크린리더는 최종값만 읽는다 */}
                <Styled.ScreenReaderOnly>
                  {`${prefix}${formatNumber(stat.value)}${stat.unit}`}
                </Styled.ScreenReaderOnly>
                <span aria-hidden data-testid='stat-visual'>
                  {stat.prefix && <Styled.Small>{prefix}</Styled.Small>}
                  {formatNumber(current)}
                  <Styled.Small>{stat.unit}</Styled.Small>
                </span>
              </Styled.Value>
              <Styled.Desc>{stat.desc}</Styled.Desc>
            </Styled.Card>
          );
        })}
      </Styled.Grid>

      <Styled.Closing>{closing}</Styled.Closing>
    </Styled.Section>
  );
};

export default RecruitStats;
