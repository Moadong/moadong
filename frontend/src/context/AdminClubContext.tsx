import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createApplicantSSE } from '@/apis/club';
import {
  ApplicantsInfo,
  ApplicantStatusEvent,
  ApplicationStatus,
} from '@/types/applicants';

interface AdminClubContextType {
  clubId: string | null;
  setClubId: (id: string | null) => void;
  applicantsData: ApplicantsInfo | null;
  setApplicantsData: (data: ApplicantsInfo | null) => void;
  applicationFormId: string | null;
  setApplicationFormId: (id: string | null) => void;
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
  const [applicantsData, setApplicantsData] = useState<ApplicantsInfo | null>(
    null,
  );
  const [applicationFormId, setApplicationFormId] = useState<string | null>(
    null,
  );

  // SSE 이벤트 핸들러
  const handleApplicantStatusChange = useCallback(
    (event: ApplicantStatusEvent) => {
      setApplicantsData((prevData) => {
        if (!prevData) return null;

        const updatedApplicants = prevData.applicants.map((applicant) =>
          applicant.id === event.applicantId
            ? { ...applicant, status: event.status, memo: event.memo }
            : applicant,
        );

        return {
          ...prevData,
          applicants: updatedApplicants,
          reviewRequired: updatedApplicants.filter(
            (a) => a.status === ApplicationStatus.SUBMITTED,
          ).length,
          scheduledInterview: updatedApplicants.filter(
            (a) => a.status === ApplicationStatus.INTERVIEW_SCHEDULED,
          ).length,
          accepted: updatedApplicants.filter(
            (a) => a.status === ApplicationStatus.ACCEPTED,
          ).length,
        };
      });
    },
    [],
  );

  useEffect(() => {
    if (!applicationFormId) return;

    let eventSource: EventSource | null = null;

    const sseConnect = () => {
      eventSource = createApplicantSSE(applicationFormId, {
        onStatusChange: handleApplicantStatusChange,
        onError: (error) => {
          console.error('SSE connection error:', error);
          setTimeout(() => {
            sseConnect();
          }, 2000);
        },
      });
    };

    sseConnect();

    return () => {
      eventSource?.close();
    };
  }, [applicationFormId, handleApplicantStatusChange]);

  return (
    <AdminClubContext.Provider
      value={{
        clubId,
        setClubId,
        applicantsData,
        setApplicantsData,
        applicationFormId,
        setApplicationFormId,
      }}
    >
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
