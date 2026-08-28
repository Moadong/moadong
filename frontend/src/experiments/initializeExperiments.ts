import { ALL_EXPERIMENTS } from './definitions';
import { fetchAndAssignExperiments } from './experimentAssignments';

export const initializeExperiments = () => {
  fetchAndAssignExperiments(ALL_EXPERIMENTS);
};
