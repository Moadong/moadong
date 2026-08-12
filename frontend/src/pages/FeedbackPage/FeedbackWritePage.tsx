import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import AttachErrorIcon from '@/assets/images/icons/feedback/feedback_image_attach_error.svg?react';
import AttachMaxIcon from '@/assets/images/icons/feedback/feedback_image_attach_max.svg?react';
import AttachIcon from '@/assets/images/icons/feedback/feedback_image_attach.svg?react';
import Button from '@/components/common/Button/Button';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import {
  FEEDBACK_CONTENT_MAX_LENGTH,
  FEEDBACK_CONTENT_MIN_LENGTH,
  FEEDBACK_CONTENT_PLACEHOLDER,
  FEEDBACK_IMAGE_MAX_COUNT,
  FEEDBACK_TYPE_META,
  FEEDBACK_TYPE_ORDER,
} from '@/constants/feedback';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useCreateFeedback } from '@/hooks/Queries/useFeedback';
import type { FeedbackType } from '@/types/feedback';
import FeedbackConfirmModal from './components/FeedbackConfirmModal';
import FeedbackTag from './components/FeedbackTag';
import * as Styled from './FeedbackWritePage.styles';

// Todo: 시안(11366:19966)의 모달 카피가 지원서 질문 삭제 모달 텍스트라 그대로 쓸 수 없어 임시로 작성함.
// 디자이너 확정 후 교체할 것.
const EXIT_MODAL = {
  title: '작성을 그만둘까요?',
  description: '작성 중인 내용은 저장되지 않습니다.',
  confirmLabel: '나가기',
};

const SAVE_MODAL = {
  title: '이대로 보낼까요?',
  description: '보낸 편지함에서 다시 확인할 수 있어요.',
  confirmLabel: '보내기',
};

const parseFeedbackType = (value?: string): FeedbackType | undefined =>
  FEEDBACK_TYPE_ORDER.find((type) => type.toLowerCase() === value);

type AttachError = 'count' | 'size' | null;

/**
 * 시안 Component 13(11435:18202)의 4가지 상태.
 * 용량 초과는 시안에 없지만 에러 상태 슬롯을 그대로 쓴다 — 문구는 임시다.
 */
const getAttachState = (imageCount: number, attachError: AttachError) => {
  if (attachError) {
    return {
      Icon: AttachErrorIcon,
      label:
        attachError === 'size'
          ? '10MB 이하 이미지만 첨부할 수 있어요.'
          : `최대 ${FEEDBACK_IMAGE_MAX_COUNT}장까지 첨부할 수 있어요.`,
      variant: 'error' as const,
    };
  }
  if (imageCount >= FEEDBACK_IMAGE_MAX_COUNT) {
    return {
      Icon: AttachMaxIcon,
      label: `(${imageCount}/${FEEDBACK_IMAGE_MAX_COUNT})`,
      variant: 'max' as const,
    };
  }
  if (imageCount > 0) {
    return {
      Icon: AttachIcon,
      label: `(${imageCount}/${FEEDBACK_IMAGE_MAX_COUNT})`,
      variant: 'default' as const,
    };
  }
  return {
    Icon: AttachIcon,
    label: '화면 캡처 첨부 (선택)',
    variant: 'default' as const,
  };
};

const FeedbackWritePage = () => {
  useTrackPageView(PAGE_VIEW.FEEDBACK_WRITE_PAGE);
  const trackEvent = useMixpanelTrack();
  const { type: typeParam } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { mutate: createFeedback, isPending } = useCreateFeedback();

  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [attachError, setAttachError] = useState<AttachError>(null);
  const [openedModal, setOpenedModal] = useState<'exit' | 'save' | null>(null);

  const feedbackType = parseFeedbackType(typeParam);
  // React Compiler가 프로퍼티 접근을 조기 반환 위로 끌어올려도 안전하도록 구조분해를 피한다.
  const meta = feedbackType ? FEEDBACK_TYPE_META[feedbackType] : null;
  if (!feedbackType || !meta) return <Navigate to='/feedback/write' replace />;

  const canSubmit = content.trim().length >= FEEDBACK_CONTENT_MIN_LENGTH;
  const attachState = getAttachState(images.length, attachError);

  const handleBack = () => {
    if (content.length === 0) {
      navigate(-1);
      return;
    }
    setOpenedModal('exit');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    // 용량 초과가 하나라도 있으면 선택을 반영하지 않는다
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      setAttachError('size');
      return;
    }

    setAttachError(files.length > FEEDBACK_IMAGE_MAX_COUNT ? 'count' : null);
    setImages(files.slice(0, FEEDBACK_IMAGE_MAX_COUNT));
  };

  const handleSubmit = () => {
    createFeedback(
      { type: feedbackType, content: content.trim(), files: images },
      {
        onSuccess: () => {
          trackEvent(USER_EVENT.FEEDBACK_SUBMITTED, {
            type: feedbackType,
            contentLength: content.trim().length,
            imageCount: images.length,
          });
          navigate('/feedback/complete', { replace: true });
        },
      },
    );
  };

  return (
    <Styled.Container>
      <WebviewTopBar title='편지 작성' onBack={handleBack} />
      <Styled.Content>
        <Styled.Heading>
          <Styled.HeadingTop>
            <FeedbackTag
              label={meta.tagLabel}
              backgroundColor={meta.backgroundColor}
              color={meta.accentColor}
              Icon={meta.Icon}
            />
            <Styled.Title>{meta.title}</Styled.Title>
          </Styled.HeadingTop>
          <Styled.Description>{meta.description}</Styled.Description>
        </Styled.Heading>

        <Styled.ContentField>
          <Styled.TextArea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={FEEDBACK_CONTENT_MAX_LENGTH}
            placeholder={FEEDBACK_CONTENT_PLACEHOLDER}
            aria-label='피드백 내용'
          />
          <Styled.CharCount>
            {content.length}/{FEEDBACK_CONTENT_MAX_LENGTH}
          </Styled.CharCount>
        </Styled.ContentField>

        <Styled.AttachButton>
          <attachState.Icon width={40} height={40} aria-hidden />
          <Styled.AttachLabel $variant={attachState.variant}>
            {attachState.label}
          </Styled.AttachLabel>
          <Styled.HiddenFileInput
            type='file'
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            multiple
            onChange={handleImageChange}
          />
        </Styled.AttachButton>
      </Styled.Content>

      <Styled.BottomArea>
        <Button
          onClick={() => setOpenedModal('save')}
          disabled={!canSubmit || isPending}
        >
          저장하기
        </Button>
      </Styled.BottomArea>

      <FeedbackConfirmModal
        isOpen={openedModal === 'exit'}
        {...EXIT_MODAL}
        onConfirm={() => navigate(-1)}
        onClose={() => setOpenedModal(null)}
      />
      <FeedbackConfirmModal
        isOpen={openedModal === 'save'}
        {...SAVE_MODAL}
        onConfirm={handleSubmit}
        onClose={() => setOpenedModal(null)}
      />
    </Styled.Container>
  );
};

export default FeedbackWritePage;
