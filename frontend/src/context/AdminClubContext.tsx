import React, { createContext, useContext, useState } from 'react';

interface AdminClubContextType {
  clubId: string | null;
  setClubId: (id: string | null) => void;
}

const AdminClubContext = createContext<AdminClubContextType | undefined>(
  undefined,
);

export const AdminClubProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [clubId, setClubId] = useState<string | null>(null);

  return (
    <AdminClubContext.Provider value={{ clubId, setClubId }}>
      {children}
    </AdminClubContext.Provider>
  );
};

export const useAdminClubContext = () => {
  const context = useContext(AdminClubContext);
  if (!context)
    throw new Error(
      'useAdminClubContext는 AdminClubProvider 내부에서만 사용할 수 있습니다',
    );
  return context;
};
