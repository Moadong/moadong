import { getVariant } from '@/experiments/experimentAssignments';
import type {
  ExperimentDefinition,
  ExperimentVariant,
} from '@/experiments/types';

export const useExperimentVariant = <V extends ExperimentVariant>(
  experiment: ExperimentDefinition<V>,
): V => {
  return getVariant(experiment);
};
