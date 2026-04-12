import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AdminClubStore {
  clubId: string | null;
  setClubId: (id: string | null) => void;
  hasConsented: boolean;
  setHasConsented: (value: boolean) => void;
}

export const useAdminClubStore = create<AdminClubStore>()(
  subscribeWithSelector((set) => ({
    clubId: null,
    setClubId: (id) => set({ clubId: id }),
    hasConsented: true,
    setHasConsented: (value) => set({ hasConsented: value }),
  })),
);

export const useAdminClubId = () => {
  const clubId = useAdminClubStore((state) => state.clubId);
  const setClubId = useAdminClubStore((state) => state.setClubId);
  return { clubId, setClubId };
};

export const useAdminHasConsented = () => {
  const hasConsented = useAdminClubStore((state) => state.hasConsented);
  const setHasConsented = useAdminClubStore((state) => state.setHasConsented);
  return { hasConsented, setHasConsented };
};
