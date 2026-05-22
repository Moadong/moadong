import { ALL_EXPERIMENTS } from './definitions';
import { experimentRepository } from './ExperimentRepository';

export const initializeExperiments = () => {
  experimentRepository.fetchAndAssignExperiments(ALL_EXPERIMENTS);
};
