import API_BASE_URL from '@/constants/api';
import { UpdateApplicantParams } from '@/types/applicants';
import { AnswerItem, ApplicationFormData } from '@/types/application';
import { secureFetch } from './auth/secureFetch';
import { handleResponse, withErrorHandling } from './utils/apiHelpers';

export const applyToClub = async (
  clubId: string,
  applicationFormId: string,
  answers: AnswerItem[],
) => {
  return withErrorHandling(async () => {
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
  }, '답변 제출 중 오류 발생:');
};

export const createApplication = async (data: ApplicationFormData) => {
  return withErrorHandling(async () => {
    const response = await secureFetch(`${API_BASE_URL}/api/club/application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response, '지원서 제출에 실패했습니다.');
  }, '지원서 제출 중 오류 발생:');
};

export const deleteApplication = async (applicationFormId: string) => {
  return withErrorHandling(async () => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/application/${applicationFormId}`,
      {
        method: 'DELETE',
      },
    );
    return handleResponse(response);
  }, 'Error fetching delete application');
};

export const duplicateApplication = async (applicationFormId: string) => {
  return withErrorHandling(async () => {
    const response = await secureFetch(
      `${API_BASE_URL}/api/club/application/${applicationFormId}/duplicate`,
      {
        method: 'POST',
      },
    );
    return handleResponse(response, '지원서 복제에 실패했습니다.');
  }, '지원서 복제 중 오류 발생:');
};

export const getActiveApplications = async (clubId: string) => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/apply`);
    return handleResponse(response);
  }, '활성화된 지원서 목록 조회 중 오류 발생:');
};

export const getAllApplicationForms = async () => {
  return withErrorHandling(async () => {
    const response = await secureFetch(`${API_BASE_URL}/api/club/application`);
    return handleResponse(response);
  }, '모든 지원서 양식 조회 중 오류 발생:');
};

export const getApplication = async (
  clubId: string,
  applicationFormId: string,
): Promise<ApplicationFormData | undefined> => {
  return withErrorHandling(async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/club/${clubId}/apply/${applicationFormId}`,
    );
    return handleResponse<ApplicationFormData>(response);
  }, '지원서 조회 중 오류가 발생했습니다');
};

export const getApplicationOptions = async (clubId: string) => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/apply`);
    const data = await handleResponse<{
      forms: Array<{ id: string; title: string }>;
    }>(response);

    let forms: Array<{ id: string; title: string }> = [];
    if (data && Array.isArray(data.forms)) {
      forms = data.forms;
    }
    return forms;
  }, '지원서 옵션 조회 중 오류가 발생했습니다.');
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

  return withErrorHandling(async () => {
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
    return handleResponse(
      response,
      '지원자의 지원서 정보 수정에 실패했습니다.',
    );
  }, '지원자의 지원서 정보 수정 중 오류 발생:');
};

export const updateApplication = async (
  data: ApplicationFormData,
  applicationFormId: string,
) => {
  return withErrorHandling(async () => {
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
  }, '지원서 수정 중 오류 발생:');
};

export const updateApplicationStatus = async (
  applicationFormId: string,
  currentStatus: string,
) => {
  const newStatus = currentStatus === 'ACTIVE' ? false : true;

  return withErrorHandling(async () => {
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
  }, '지원서 상태 수정 중 오류 발생:');
};
