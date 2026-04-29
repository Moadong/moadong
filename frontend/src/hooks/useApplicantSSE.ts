import { useCallback, useEffect, useRef, useState } from 'react';
import { createApplicantSSE } from '@/apis/clubSSE';
import {
  ApplicantsInfo,
  ApplicantStatusEvent,
  ApplicationStatus,
} from '@/types/applicants';

export const useApplicantSSE = (applicationFormId: string | undefined) => {
  const [applicantsData, setApplicantsData] = useState<ApplicantsInfo | null>(
    null,
  );
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

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

    setApplicantsData(null);

    const sseConnect = () => {
      eventSourceRef.current?.close();

      eventSourceRef.current = createApplicantSSE(applicationFormId, {
        onStatusChange: handleApplicantStatusChange,
        onError: (error) => {
          console.error('SSE connection error:', error);

          if (reconnectTimeoutRef.current) return;

          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null;
            sseConnect();
          }, 2000);
        },
      });
    };

    sseConnect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [applicationFormId, handleApplicantStatusChange]);

  return { applicantsData, setApplicantsData };
};
