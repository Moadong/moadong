import { useMemo } from 'react';
import { experimentRepository } from '@/experiments/ExperimentRepository';
import type {
  ExperimentDefinition,
  ExperimentVariant,
} from '@/experiments/types';

export const useExperimentVariant = <V extends ExperimentVariant>(
  experiment: ExperimentDefinition<V>,
): V => {
  return useMemo(
    () => experimentRepository.getVariant(experiment),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [experiment.key],
  );
};
