import { create } from 'zustand';
import { createApplicantSSE } from '@/apis/clubSSE';
import {
  ApplicantsInfo,
  ApplicantStatusEvent,
  ApplicationStatus,
} from '@/types/applicants';

interface AdminClubState {
  clubId: string | null;
  applicantsData: ApplicantsInfo | null;
  applicationFormId: string | null;
  hasConsented: boolean;
  eventSource: EventSource | null;
  reconnectTimeout: number | null;
}

interface AdminClubActions {
  setClubId: (id: string | null) => void;
  setApplicantsData: (data: ApplicantsInfo | null) => void;
  setApplicationFormId: (id: string | null) => void;
  setHasConsented: (value: boolean) => void;
  handleApplicantStatusChange: (event: ApplicantStatusEvent) => void;
  connectSSE: () => void;
  disconnectSSE: () => void;
}

export const useAdminClubStore = create<AdminClubState & AdminClubActions>(
  (set, get) => ({
    clubId: null,
    applicantsData: null,
    applicationFormId: null,
    hasConsented: true,
    eventSource: null,
    reconnectTimeout: null,

    setClubId: (id) => set({ clubId: id }),
    setApplicantsData: (data) => set({ applicantsData: data }),
    setApplicationFormId: (id) => {
      set({ applicationFormId: id });
      get().connectSSE();
    },
    setHasConsented: (value) => set({ hasConsented: value }),

    handleApplicantStatusChange: (event) => {
      set((state) => {
        if (!state.applicantsData) return {};

        const updatedApplicants = state.applicantsData.applicants.map(
          (applicant) =>
            applicant.id === event.applicantId
              ? { ...applicant, status: event.status, memo: event.memo }
              : applicant,
        );

        return {
          applicantsData: {
            ...state.applicantsData,
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
          },
        };
      });
    },

    connectSSE: () => {
      const { applicationFormId, disconnectSSE, handleApplicantStatusChange } =
        get();
      if (!applicationFormId) return;

      disconnectSSE();

      const eventSource = createApplicantSSE(applicationFormId, {
        onStatusChange: handleApplicantStatusChange,
        onError: () => {
          if (get().reconnectTimeout) return;

          const timeout = window.setTimeout(() => {
            set({ reconnectTimeout: null });
            get().connectSSE();
          }, 2000);
          set({ reconnectTimeout: timeout });
        },
      });

      set({ eventSource });
    },

    disconnectSSE: () => {
      const { eventSource, reconnectTimeout } = get();
      if (reconnectTimeout) {
        window.clearTimeout(reconnectTimeout);
      }
      eventSource?.close();
      set({ eventSource: null, reconnectTimeout: null });
    },
  }),
);
