import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AdminClubStore {
  clubId: string | null;
  setClubId: (id: string | null) => void;
}

export const useAdminClubStore = create<AdminClubStore>()(
  subscribeWithSelector((set) => ({
    clubId: null,
    setClubId: (id) => set({ clubId: id }),
  })),
);

export const useAdminClubId = () => {
  const clubId = useAdminClubStore((state) => state.clubId);
  const setClubId = useAdminClubStore((state) => state.setClubId);
  return { clubId, setClubId };
};
