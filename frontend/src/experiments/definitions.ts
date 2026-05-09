import type { ExperimentDefinition } from './types';

export const festivalTimetableNavExperiment = {
  key: 'festival_timetable_nav_v1',
  variants: ['tabs', 'arrows'] as const,
  defaultVariant: 'tabs',
  weights: {
    tabs: 50,
    arrows: 50,
  },
} satisfies ExperimentDefinition<'tabs' | 'arrows'>;

export const ALL_EXPERIMENTS = [festivalTimetableNavExperiment] as const;
