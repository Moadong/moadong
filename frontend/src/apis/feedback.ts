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

export interface FeedbackImageUploadResult {
  urlByFile: Map<File, string>;
  failedFiles: File[];
}

/**
 * 첨부 사진을 R2에 올리고 파일별 결과를 돌려준다.
 * 기존 활동사진과 같은 presigned 방식이라 uploadToStorage를 그대로 재사용한다.
 *
 * 한 장이 실패해도 나머지 결과를 버리지 않는다. 버리면 이미 R2에 올라간 사진이
 * 어디에도 등록되지 않은 채 남고, 다시 보낼 때 전부 새로 올려야 한다.
 */
export const uploadFeedbackImages = async (
  files: File[],
): Promise<FeedbackImageUploadResult> => {
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
  // 응답 길이가 요청 수와 달라질 수 있다. 짝이 없거나 실패한 항목은 그 파일만 실패로 둔다.
  // 저장 시점에 서버가 R2에 파일이 있는지 확인하므로 업로드를 모두 끝낸 뒤 반환한다.
  const results = await Promise.allSettled(
    files.map(async (file, index) => {
      const item = presigned?.[index];
      if (!item?.success || !item.presignedUrl || !item.finalUrl) {
        throw new Error(
          item?.failureReason ?? '이미지 업로드 준비에 실패했습니다.',
        );
      }
      await uploadToStorage(item.presignedUrl, file, file.type);
      return item.finalUrl;
    }),
  );

  const urlByFile = new Map<File, string>();
  const failedFiles: File[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      urlByFile.set(files[index], result.value);
    } else {
      failedFiles.push(files[index]);
    }
  });

  return { urlByFile, failedFiles };
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
