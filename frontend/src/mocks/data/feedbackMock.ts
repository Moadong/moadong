import type {
  ReceivedLetter,
  ReceivedLetterDetail,
  SentFeedback,
} from '@/types/feedback';

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const receivedLettersMock: ReceivedLetter[] = [
  {
    id: 'letter-reply-1',
    category: 'REPLY',
    title: '즐겨찾기한 동아리 알림, 이렇게 준비 중이에요',
    preview:
      '보내주신 요청 잘 받았어요. 다음 업데이트에 넣을 수 있을 것 같아요.',
    createdAt: daysAgo(5),
    isRead: false,
  },
  {
    id: 'letter-update-1',
    category: 'UPDATE',
    title: 'v1.4 — 모아동 우체통이 생겼어요',
    preview:
      '이제 모아동 팀에게 직접 편지를 보낼 수 있어요. 무엇이 바뀌었는지 알려드릴게요.',
    createdAt: daysAgo(5),
    isRead: false,
  },
  {
    id: 'letter-story-1',
    category: 'STORY',
    title: '우리가 모아동을 만든 이유',
    preview: '동아리 하나 찾는 데 왜 이렇게 오래 걸릴까. 거기서 시작했어요.',
    createdAt: daysAgo(5),
    isRead: true,
  },
];

export const receivedLetterDetailsMock: Record<string, ReceivedLetterDetail> = {
  'letter-reply-1': {
    id: 'letter-reply-1',
    category: 'REPLY',
    title: '즐겨찾기한 동아리 알림, 이렇게 준비 중이에요',
    createdAt: daysAgo(5),
    body: `안녕하세요, 모아동 팀이에요.

보내주신 편지 잘 읽었어요. 사실 같은 이야기를 하신 분이 이번 주에만 여섯 분이었어요. 그만큼 놓치기 쉬웠다는 뜻이겠죠.

지금은 구독한 동아리의 모집이 열리면 푸시로 알려주는 기능을 만들고 있어요. 8월 첫째 주 업데이트에 담을게요. 나오면 이 우체통으로 다시 알려드릴게요.`,
    myFeedback: {
      id: 'feedback-1',
      type: 'FEATURE',
      content:
        '지원서 작성 중에 새로고침하면 쓰던 내용이 다 날아가요. 그리고 어쩌고 저쩌고',
      createdAt: daysAgo(5),
    },
  },
  'letter-update-1': {
    id: 'letter-update-1',
    category: 'UPDATE',
    title: 'v1.4 — 모아동 우체통이 생겼어요',
    createdAt: daysAgo(5),
    body: `안녕하세요, 모아동 팀이에요.

이번 업데이트로 모아동 팀과 편지를 주고받을 수 있게 됐어요. 무엇이 달라졌는지 정리했어요.

**모아동 우체통**\\
만든 이유, 업데이트 소식, 그리고 여러분이 보낸 편지의 답장이 이곳에 쌓여요.

**피드백 보내기**\\
문제 신고, 기능 요청, 문의, 응원 네 가지로 나눠서 보낼 수 있어요.

**답장 알림**\\
모아동 팀이 답장을 쓰면 푸시로 바로 알려드려요.`,
  },
  'letter-story-1': {
    id: 'letter-story-1',
    category: 'STORY',
    title: '우리가 모아동을 만든 이유',
    createdAt: daysAgo(5),
    // 어드민 에디터가 제공하는 마크다운 요소를 모두 확인하려고 일부러 섞어 뒀다
    body: `동아리 하나 찾는 데 왜 이렇게 오래 걸릴까.

## 시작은 불편함이었어요

학교 커뮤니티, 인스타그램, 대자보를 전부 뒤져야 겨우 모집 공고 하나를 찾을 수 있었거든요.

> 정보가 없어서가 아니라, 흩어져 있어서였어요.

### 그래서 모은 것

- 동아리 소개와 모집 공고
- 지원서 작성과 제출
- 모집 알림

지금은 *한 화면*에서 끝나요. 더 궁금하면 [서비스 소개](/introduce)를 봐주세요.

---

앞으로도 이 우체통으로 소식을 전할게요.`,
  },
};

export const sentFeedbacksMock: SentFeedback[] = [
  {
    id: 'feedback-1',
    type: 'BUG',
    content:
      '지원서 작성 중에 새로고침하면 쓰던 내용이 다 날아가요. 그리고 어쩌고 저쩌고',
    images: ['/og_image.png', '/og_image.png', '/og_image.png', '/og_image.png'],
    status: 'PENDING',
    createdAt: daysAgo(5),
  },
  {
    id: 'feedback-2',
    type: 'FEATURE',
    content:
      '즐겨찾기한 동아리 모집이 열리면 알림을 받고 싶어요. 매번 들어와서 확인하기 번거로워요.',
    images: [],
    status: 'REPLIED',
    createdAt: daysAgo(5),
  },
  {
    id: 'feedback-3',
    type: 'CHEER',
    content: '덕분에 동아리 찾는 게 훨씬 편해졌어요. 앞으로도 응원할게요!',
    images: [],
    status: 'PENDING',
    createdAt: daysAgo(5),
  },
];
