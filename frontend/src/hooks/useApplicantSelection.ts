import { useState } from 'react';

const storageKey = (formId: string) => `applicant-selection-${formId}`;

const readFromStorage = (formId: string): Set<string> => {
  if (!formId) return new Set();
  try {
    const stored = sessionStorage.getItem(storageKey(formId));
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  } catch {
    return new Set();
  }
};

const writeToStorage = (formId: string, ids: Set<string>) => {
  if (!formId) return;
  if (ids.size === 0) {
    sessionStorage.removeItem(storageKey(formId));
  } else {
    sessionStorage.setItem(storageKey(formId), JSON.stringify([...ids]));
  }
};

export const useApplicantSelection = (formId: string) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() =>
    readFromStorage(formId),
  );

  const update = (next: Set<string>) => {
    setCheckedIds(next);
    writeToStorage(formId, next);
  };

  return {
    checkedIds,
    toggleId: (id: string) => {
      const next = new Set(checkedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      update(next);
    },
    setCheckedIds: (ids: Set<string>) => update(ids),
    clearSelection: () => update(new Set()),
  };
};
