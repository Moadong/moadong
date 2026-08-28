jest.mock('mixpanel-browser', () => ({
  __esModule: true,
  default: { register: jest.fn(), unregister: jest.fn() },
}));

type ExperimentAssignmentsModule =
  typeof import('@/experiments/experimentAssignments');

// 새 페이지 로드를 재현한다. 모듈이 다시 평가되며 메모리 캐시는 비워지고,
// localStorage는 그대로 남는다.
const openNewSession = (): ExperimentAssignmentsModule => {
  let module: ExperimentAssignmentsModule;
  jest.isolateModules(() => {
    module = require('@/experiments/experimentAssignments');
  });
  return module!;
};

const experiment = {
  key: 'test_experiment',
  variants: ['A', 'B'] as const,
  defaultVariant: 'A' as const,
  weights: { A: 3, B: 1 },
};

// 재배정 확률이 회당 37.5%라 200회에서 한 번도 안 바뀔 확률은 0.625^200 ≈ 10^-41.
// 확률적이지만 사실상 결정론적이다.
const SESSION_COUNT = 200;

const assignInNewSession = (
  definition: { key: string } & Record<string, unknown> = experiment,
) => {
  const session = openNewSession();
  session.fetchAndAssignExperiments([definition as never]);
  return session.getVariant(definition as never);
};

beforeEach(() => {
  localStorage.clear();
});

describe('가중치 추첨', () => {
  // 표본 4000은 허용오차 0.05 기준 실패율 0%(20만 회 시뮬레이션).
  // 1000이면 약 3200회에 1번 실패한다.
  it('weights 3:1이면 4000번 배정에서 대략 3:1이 나온다', () => {
    const session = openNewSession();
    const counts: Record<string, number> = { A: 0, B: 0 };

    for (let i = 0; i < 4000; i += 1) {
      session.resetAssignments();
      session.fetchAndAssignExperiments([experiment]);
      counts[session.getVariant(experiment)] += 1;
    }

    expect(counts.A / 4000).toBeCloseTo(0.75, 1);
  });
});

describe('배정 고정성', () => {
  it('다시 방문해도 같은 그룹에 남는다', () => {
    for (let i = 0; i < SESSION_COUNT; i += 1) {
      localStorage.clear();
      expect(assignInNewSession()).toBe(assignInNewSession());
    }
  });

  it('localStorage가 비워지면 다시 추첨된다', () => {
    // Safari ITP 7일 만료, 시크릿 모드 종료, 사용자의 사이트 데이터 삭제.
    let flipped = 0;
    for (let i = 0; i < SESSION_COUNT; i += 1) {
      localStorage.clear();
      const today = assignInNewSession();
      localStorage.clear();
      if (assignInNewSession() !== today) flipped += 1;
    }
    expect(flipped).toBeGreaterThan(0);
  });

  it('localStorage 쓰기가 막히면 매 방문마다 다시 추첨된다', () => {
    const setItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

    let flipped = 0;
    for (let i = 0; i < SESSION_COUNT; i += 1) {
      localStorage.clear();
      const today = assignInNewSession();
      if (assignInNewSession() !== today) flipped += 1;
    }

    setItem.mockRestore();
    expect(flipped).toBeGreaterThan(0);
  });

  it('배포로 variants 목록이 바뀌면 재배정된다', () => {
    const previous = assignInNewSession();
    const redefined = {
      ...experiment,
      variants: ['C', 'D'] as const,
      defaultVariant: 'C' as const,
    };

    const current = assignInNewSession(redefined);

    expect(['C', 'D']).toContain(current);
    expect(current).not.toBe(previous);
  });
});

describe('메모리 캐시', () => {
  it('getVariant는 localStorage를 읽지 않는다', () => {
    const session = openNewSession();
    session.fetchAndAssignExperiments([experiment]);

    const getItem = jest.spyOn(Storage.prototype, 'getItem');
    for (let i = 0; i < 50; i += 1) session.getVariant(experiment);
    const readCount = getItem.mock.calls.length;
    getItem.mockRestore();

    expect(readCount).toBe(0);
  });
});
