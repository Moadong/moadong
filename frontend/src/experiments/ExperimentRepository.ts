import mixpanel from 'mixpanel-browser';
import type {
  ExperimentAssignments,
  ExperimentDefinition,
  ExperimentVariant,
} from './types';

const ASSIGNMENT_STORAGE_KEY = 'moadong_experiments';

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const safeReadAssignments = (): ExperimentAssignments => {
  try {
    const raw = localStorage.getItem(ASSIGNMENT_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isObjectRecord(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => typeof value === 'string'),
    ) as ExperimentAssignments;
  } catch {
    return {};
  }
};

const writeAssignments = (assignments: ExperimentAssignments) => {
  try {
    localStorage.setItem(ASSIGNMENT_STORAGE_KEY, JSON.stringify(assignments));
  } catch {
    // localStorage 쓰기 실패(용량 초과, 권한 거부 등)는 무시하고 진행한다.
    // 실패해도 배정값은 메모리에서 유효하며, 다음 새로고침 시 재배정된다.
  }
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

      if (isValidExisting) {
        mixpanel.register({ [experiment.key]: existing });
        return;
      }

      const variant = pickWeightedVariant(experiment);
      assignments[experiment.key] = variant;
      mixpanel.register({ [experiment.key]: variant });
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
