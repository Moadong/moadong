import React, { createContext, useContext, useState } from 'react';

interface ClubContextType {
  clubId: string | null;
  setClubId: (id: string | null) => void;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const ClubProvider = ({ children }: { children: React.ReactNode }) => {
  const [clubId, setClubId] = useState<string | null>(null);

  return (
    <ClubContext.Provider value={{ clubId, setClubId }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClubContext = () => {
  const context = useContext(ClubContext);
  if (!context)
    throw new Error(
      'useClubContext는 ClubProvider 내부에서만 사용할 수 있습니다',
    );
  return context;
};
