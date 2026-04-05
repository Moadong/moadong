import type { ExperimentDefinition } from './types';

export const mainBannerExperiment = {
  key: 'main_banner_v1',
  variants: ['A', 'B'] as const,
  defaultVariant: 'A',
  weights: {
    A: 50,
    B: 50,
  },
} satisfies ExperimentDefinition<'A' | 'B'>;

export const applyButtonCopyExperiment = {
  key: 'apply_button_copy_v1',
  variants: ['A', 'B'] as const,
  defaultVariant: 'A',
  weights: {
    A: 50,
    B: 50,
  },
} satisfies ExperimentDefinition<'A' | 'B'>;

export const ALL_EXPERIMENTS = [
  mainBannerExperiment,
  applyButtonCopyExperiment,
] as const;
