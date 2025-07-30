import { createContext, useContext, useState } from 'react';
import { ApplicantsInfo } from '@/types/applicants';

interface AdminClubContextType {
  clubId: string | null;
  setClubId: (id: string | null) => void;
  applicantsData: ApplicantsInfo | null;
  setApplicantsData: (data: ApplicantsInfo | null) => void;
}

const AdminClubContext = createContext<AdminClubContextType | undefined>(
  undefined
);

export const AdminClubProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [clubId, setClubId] = useState<string | null>(null);
  const [applicantsData, setApplicantsData] = useState<ApplicantsInfo | null>(null);

  return (
    <AdminClubContext.Provider value={{ clubId, setClubId, applicantsData, setApplicantsData }}>
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
