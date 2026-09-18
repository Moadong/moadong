import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/storageKeys';

interface AdminClubStore {
  clubId: string | null;
  setClubId: (id: string | null) => void;
}

export const useAdminClubStore = create<AdminClubStore>()(
  persist(
    (set) => ({
      clubId: null,
      setClubId: (id) => set({ clubId: id }),
    }),
    {
      name: STORAGE_KEYS.ADMIN_CLUB_ID,
      partialize: (state) => ({ clubId: state.clubId }),
      onRehydrateStorage: () => (state) => {
        if (!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)) {
          state?.setClubId(null);
        }
      },
    },
  ),
);

export const useAdminClubId = () => {
  const clubId = useAdminClubStore((state) => state.clubId);
  const setClubId = useAdminClubStore((state) => state.setClubId);
  return { clubId, setClubId };
};
