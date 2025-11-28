import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';

interface ApplicationFormStore {
  applicationFormId: string | null;
  setApplicationFormId: (id: string | null) => void;
}

export const useApplicationFormStore = create<ApplicationFormStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        applicationFormId: '',
        setApplicationFormId: (id: string | null) =>
          set({ applicationFormId: id }),
      }),
      {
        name: 'application-form-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export const useApplicationFormId = () => {
  const applicationFormId = useApplicationFormStore(
    (state) => state.applicationFormId,
  );
  const setApplicationFormId = useApplicationFormStore(
    (state) => state.setApplicationFormId,
  );
  return { applicationFormId, setApplicationFormId };
};
