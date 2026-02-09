import API_BASE_URL from '@/constants/api';
import { UpdateApplicantParams } from '@/types/applicants';
import {
  AnswerItem,
  ApplicationFormData,
  SemesterGroup,
} from '@/types/application';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

export const applyToClub = async (
  clubId: string,
  applicationFormId: string,
  answers: AnswerItem[],
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/club/${clubId}/apply/${applicationFormId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questions: [...answers],
      }),
    },
  );
  return handleResponse(response, '답변 제출에 실패했습니다.');
};

export const createApplication = async (data: ApplicationFormData) => {
  const response = await secureFetch(`${API_BASE_URL}/api/club/application`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response, '지원서 제출에 실패했습니다.');
};

export const deleteApplication = async (applicationFormId: string) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/club/application/${applicationFormId}`,
    {
      method: 'DELETE',
    },
  );
  return handleResponse(response);
};

export const duplicateApplication = async (applicationFormId: string) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/club/application/${applicationFormId}/duplicate`,
    {
      method: 'POST',
    },
  );
  return handleResponse(response, '지원서 복제에 실패했습니다.');
};

export const getActiveApplications = async (clubId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/apply`);
  return handleResponse(response);
};

interface ApplicationListResponse {
  forms: SemesterGroup[];
}

export const getAllApplicationForms = async (): Promise<
  ApplicationListResponse | undefined
> => {
  const response = await secureFetch(`${API_BASE_URL}/api/club/application`);
  return handleResponse<ApplicationListResponse>(response);
};

export const getApplication = async (
  clubId: string,
  applicationFormId: string,
): Promise<ApplicationFormData | undefined> => {
  const response = await fetch(
    `${API_BASE_URL}/api/club/${clubId}/apply/${applicationFormId}`,
  );
  return handleResponse<ApplicationFormData>(response);
};

export const getApplicationOptions = async (clubId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/apply`);
  const data = await handleResponse<{
    forms: Array<{ id: string; title: string }>;
  }>(response);

  let forms: Array<{ id: string; title: string }> = [];
  if (data && Array.isArray(data.forms)) {
    forms = data.forms;
  }
  return forms;
};

export const updateApplicantDetail = async (
  applicant: UpdateApplicantParams[],
  applicationFormId: string | undefined,
) => {
  if (!applicationFormId) {
    throw new Error(
      'applicationFormId가 존재하지 않아 지원자 정보를 수정할 수 없습니다.',
    );
  }

  const response = await secureFetch(
    `${API_BASE_URL}/api/club/applicant/${applicationFormId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicant),
    },
  );
  return handleResponse(response, '지원자의 지원서 정보 수정에 실패했습니다.');
};

export const updateApplication = async (
  data: ApplicationFormData,
  applicationFormId: string,
) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/club/application/${applicationFormId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
  return handleResponse(response, '지원서 수정에 실패했습니다.');
};

export const updateApplicationStatus = async (
  applicationFormId: string,
  currentStatus: string,
) => {
  const newStatus = currentStatus === 'ACTIVE' ? false : true;

  const response = await secureFetch(
    `${API_BASE_URL}/api/club/application/${applicationFormId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active: newStatus }),
    },
  );
  return handleResponse(response, '지원서 상태 수정에 실패했습니다.');
};
