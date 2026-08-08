import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MetricSummary from './MetricSummary';

describe('MetricSummary', () => {
  const overview = {
    clubId: 'club-1',
    clubName: '모아동',
    from: '2026-08-01',
    to: '2026-08-07',
    totalDetailViews: 1234,
    averageDetailDurationSeconds: 65,
    uniqueDetailVisitors: 98,
    averageDetailDurationSecondsPerVisitor: 143,
    totalApplicants: 12,
  };

  it('통계 요약 지표를 렌더링한다', () => {
    render(
      <MetricSummary
        data={overview}
        isLoading={false}
        isError={false}
        onRetry={jest.fn()}
      />,
    );

    expect(screen.getByText('상세 조회수')).toBeInTheDocument();
    expect(screen.getByText('평균 체류 시간')).toBeInTheDocument();
    expect(screen.getByText('고유 방문자')).toBeInTheDocument();
    expect(screen.getByText('인당 평균 체류 시간')).toBeInTheDocument();
    expect(screen.getByText('지원자 수')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('1분 5초')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
    expect(screen.getByText('2분 23초')).toBeInTheDocument();
  });
});
