import mixpanel from 'mixpanel-browser';
import { USER_EVENT } from '@/constants/eventName';
import type {
  ExperimentAssignments,
  ExperimentDefinition,
  ExperimentVariant,
} from './types';

const ASSIGNMENT_STORAGE_KEY = 'moadong_experiments';

// 배정을 믿을 수 없는 방문을 표시해 분석에서 걸러내기 위한 super property.
// 실험 결과 해석 시 오염된 표본의 비율을 알아야 차이가 진짜인지 판단할 수 있다.
const STORAGE_BLOCKED_PROPERTY = 'experiment_storage_blocked';
const DEFINITION_CHANGED_PROPERTY = 'experiment_definition_changed';

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

const writeAssignments = (assignments: ExperimentAssignments): boolean => {
  try {
    localStorage.setItem(ASSIGNMENT_STORAGE_KEY, JSON.stringify(assignments));
    return true;
  } catch {
    // 쓰기 실패(용량 초과, 권한 거부 등)해도 이번 방문은 메모리 배정으로 진행한다.
    // 다만 다음 방문에 다시 추첨되므로 배정이 고정되지 않는다.
    return false;
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

let assignments: ExperimentAssignments = safeReadAssignments();

export const fetchAndAssignExperiments = (
  experiments: readonly ExperimentDefinition<ExperimentVariant>[],
) => {
  const definedKeys = new Set(experiments.map((e) => e.key));

  // 정의에서 사라진 실험은 Mixpanel super property 및 로컬 배정 정리.
  // 누락 시 종료된 실험 key가 모든 이벤트에 계속 따라붙어 데이터가 오염됨.
  Object.keys(assignments).forEach((key) => {
    if (definedKeys.has(key)) return;
    mixpanel.unregister(key);
    delete assignments[key];
  });

  let definitionChanged = false;

  experiments.forEach((experiment) => {
    const existing = assignments[experiment.key];
    const isValidExisting =
      !!existing && experiment.variants.includes(existing);

    if (isValidExisting) {
      mixpanel.register({ [experiment.key]: existing });
      return;
    }

    // 기존 배정이 현재 variants에 없다 = 정의가 바뀌어 그룹이 갈렸다.
    // 배정이 아예 없던 첫 방문은 오염이 아니므로 구분한다.
    if (existing) definitionChanged = true;

    const variant = pickWeightedVariant(experiment);
    assignments[experiment.key] = variant;
    mixpanel.register({ [experiment.key]: variant });
  });

  const stored = writeAssignments(assignments);

  mixpanel.register({
    [STORAGE_BLOCKED_PROPERTY]: !stored,
    [DEFINITION_CHANGED_PROPERTY]: definitionChanged,
  });
};

export const getVariant = <V extends ExperimentVariant>(
  experiment: ExperimentDefinition<V>,
): V => {
  const assignedVariant = assignments[experiment.key];

  if (assignedVariant && experiment.variants.includes(assignedVariant as V)) {
    return assignedVariant as V;
  }

  return experiment.defaultVariant;
};

const exposedKeys = new Set<string>();

/**
 * Mixpanel 실험 분석용 노출 이벤트. 배정 시점이 아니라 변형이 실제로 화면에
 * 그려지는 시점에 호출해야 한다. 부팅 때 일괄로 보내면 그 화면을 보지 않는
 * 사용자까지 분석 모집단에 들어와 효과가 희석된다.
 */
export const trackExperimentExposure = <V extends ExperimentVariant>(
  experiment: ExperimentDefinition<V>,
) => {
  if (exposedKeys.has(experiment.key)) return;
  exposedKeys.add(experiment.key);

  mixpanel.track(USER_EVENT.EXPERIMENT_STARTED, {
    'Experiment name': experiment.key,
    'Variant name': getVariant(experiment),
  });
};

export const resetAssignments = () => {
  assignments = {};
  exposedKeys.clear();
  localStorage.removeItem(ASSIGNMENT_STORAGE_KEY);
};
