import type {
  ExperimentAssignments,
  ExperimentDefinition,
  ExperimentVariant,
} from './types';

const ASSIGNMENT_STORAGE_KEY = 'moadong_experiment_assignments';

const safeReadAssignments = (): ExperimentAssignments => {
  try {
    const raw = localStorage.getItem(ASSIGNMENT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ExperimentAssignments) : {};
  } catch {
    return {};
  }
};

const writeAssignments = (assignments: ExperimentAssignments) => {
  localStorage.setItem(ASSIGNMENT_STORAGE_KEY, JSON.stringify(assignments));
};

const pickWeightedVariant = <V extends ExperimentVariant>(
  experiment: ExperimentDefinition<V>,
): V => {
  if (experiment.variants.length === 0) return experiment.defaultVariant;
  if (experiment.variants.length === 1) return experiment.variants[0];

  const { variants, weights } = experiment;
  if (!weights) {
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  }

  const totalWeight = variants.reduce(
    (sum, variant) => sum + (weights[variant] ?? 0),
    0,
  );

  if (totalWeight <= 0) return experiment.defaultVariant;

  let randomPointer = Math.random() * totalWeight;
  for (const variant of variants) {
    randomPointer -= weights[variant] ?? 0;
    if (randomPointer <= 0) return variant;
  }

  return experiment.defaultVariant;
};

class ExperimentRepository {
  fetchAndAssignExperiments(experiments: readonly ExperimentDefinition<any>[]) {
    if (experiments.length === 0) return;

    const assignments = safeReadAssignments();

    experiments.forEach((experiment) => {
      const existing = assignments[experiment.key];
      const isValidExisting =
        !!existing && experiment.variants.includes(existing);

      if (isValidExisting) return;

      assignments[experiment.key] = pickWeightedVariant(experiment);
    });

    writeAssignments(assignments);
  }

  getVariant<V extends ExperimentVariant>(
    experiment: ExperimentDefinition<V>,
  ): V {
    const assignments = safeReadAssignments();
    const assignedVariant = assignments[experiment.key];

    if (assignedVariant && experiment.variants.includes(assignedVariant as V)) {
      return assignedVariant as V;
    }

    return experiment.defaultVariant;
  }

  resetAssignments() {
    localStorage.removeItem(ASSIGNMENT_STORAGE_KEY);
  }
}

export const experimentRepository = new ExperimentRepository();
