export type ExperimentVariant = string;

export type ExperimentDefinition<V extends ExperimentVariant> = {
  key: string;
  variants: readonly V[];
  defaultVariant: V;
  weights?: Partial<Record<V, number>>;
};

export type ExperimentAssignments = Record<string, ExperimentVariant>;
