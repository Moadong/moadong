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
    const assignments = safeReadAssignments();
    const definedKeys = new Set(experiments.map((e) => e.key));

    // 정의에서 사라진 실험은 Mixpanel super property 및 로컬 배정 정리.
    // 누락 시 종료된 실험 key가 모든 이벤트에 계속 따라붙어 데이터가 오염됨.
    Object.keys(assignments).forEach((key) => {
      if (definedKeys.has(key)) return;
      mixpanel.unregister(key);
      delete assignments[key];
    });

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
