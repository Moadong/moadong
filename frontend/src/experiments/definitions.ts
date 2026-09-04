import type { ExperimentDefinition } from './types';

export type MainRedesignVariant = 'control' | 'treatment';

/**
 * 메인 개편(홈 허브) 가드레일 실험.
 *
 * 개선을 증명하는 실험이 아니다. 7일 창·팔당 약 270명이라 잡히는 건
 * 메인→동아리 상세 퍼널(baseline 89.8%)의 8%p 이상 하락뿐이므로,
 * "크게 망가지지 않았는지"만 확인한다.
 * 노출은 개편 UI가 실제로 보이는 모바일·앱에서만 집계한다.
 */
export const mainRedesignExperiment: ExperimentDefinition<MainRedesignVariant> =
  {
    key: 'main_redesign',
    variants: ['control', 'treatment'],
    defaultVariant: 'control',
    weights: { control: 50, treatment: 50 },
  };

export const ALL_EXPERIMENTS = [mainRedesignExperiment];
