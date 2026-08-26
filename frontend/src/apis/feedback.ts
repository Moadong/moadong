import API_BASE_URL from '@/constants/api';
import {
  CreateFeedbackRequest,
  CreateFeedbackResponse,
  LetterCategory,
  ReceivedLetter,
  ReceivedLetterDetail,
  SentFeedback,
} from '@/types/feedback';
import { studentFetch } from './auth/studentFetch';
import { uploadToStorage } from './image';
import { handleResponse } from './utils/apiHelpers';

/** 우체통 API는 학생 토큰 기반이라 /api/student 아래에 있다 */
const FEEDBACK_BASE_URL = `${API_BASE_URL}/api/student/feedback`;

export const createFeedback = async (payload: CreateFeedbackRequest) => {
  const response = await studentFetch(FEEDBACK_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<CreateFeedbackResponse>(
    response,
    '피드백 전송에 실패했습니다.',
  );
};

interface FeedbackImagePresigned {
  presignedUrl: string;
  finalUrl: string;
  success: boolean;
  failureReason: string | null;
}

/**
 * 첨부 사진을 R2에 올리고 저장에 쓸 finalUrl 배열을 돌려준다.
 * 기존 활동사진과 같은 presigned 방식이라 uploadToStorage를 그대로 재사용한다.
 */
export const uploadFeedbackImages = async (files: File[]) => {
  const response = await studentFetch(
    `${FEEDBACK_BASE_URL}/images/upload-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        files.map((file) => ({ fileName: file.name, contentType: file.type })),
      ),
    },
  );

  const presigned = await handleResponse<FeedbackImagePresigned[]>(
    response,
    '이미지 업로드 준비에 실패했습니다.',
  );

  // 항목별 부분 실패가 가능하고, 4장을 넘기면 TOO_MANY_FILES 항목이 덧붙어
  // 응답 길이가 요청 수와 달라질 수 있다. 하나라도 실패면 전송을 멈춘다.
  const failed = presigned?.find((item) => !item.success);
  if (failed) {
    throw new Error(
      failed.failureReason ?? '이미지 업로드 준비에 실패했습니다.',
    );
  }

  if (presigned?.length !== files.length) {
    throw new Error('이미지 업로드 준비에 실패했습니다.');
  }

  // 저장 시점에 서버가 R2에 파일이 있는지 확인하므로 업로드를 모두 끝낸 뒤 반환한다
  await Promise.all(
    files.map((file, index) =>
      uploadToStorage(presigned[index].presignedUrl, file, file.type),
    ),
  );

  return presigned.map((item) => item.finalUrl);
};

export const getReceivedLetters = async (category?: LetterCategory) => {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const response = await studentFetch(`${FEEDBACK_BASE_URL}/received${query}`);

  const data = await handleResponse<{ letters: ReceivedLetter[] }>(
    response,
    '받은 편지를 불러오지 못했습니다.',
  );

  return data?.letters ?? [];
};

export const getReceivedLetter = async (letterId: string) => {
  const response = await studentFetch(
    `${FEEDBACK_BASE_URL}/received/${encodeURIComponent(letterId)}`,
  );

  return handleResponse<ReceivedLetterDetail>(
    response,
    '편지를 불러오지 못했습니다.',
  );
};

export const markReceivedLetterAsRead = async (letterId: string) => {
  const response = await studentFetch(
    `${FEEDBACK_BASE_URL}/received/${encodeURIComponent(letterId)}/read`,
    { method: 'PATCH' },
  );

  return handleResponse(response, '편지 읽음 처리에 실패했습니다.');
};

export const getSentFeedback = async (feedbackId: string) => {
  const response = await studentFetch(
    `${FEEDBACK_BASE_URL}/sent/${encodeURIComponent(feedbackId)}`,
  );

  return handleResponse<SentFeedback>(
    response,
    '보낸 편지를 불러오지 못했습니다.',
  );
};

export const getSentFeedbacks = async () => {
  const response = await studentFetch(`${FEEDBACK_BASE_URL}/sent`);

  const data = await handleResponse<{ feedbacks: SentFeedback[] }>(
    response,
    '보낸 편지를 불러오지 못했습니다.',
  );

  return data?.feedbacks ?? [];
};
