import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getServerErrorMessage } from '@/apis/utils/getServerErrorMessage';
import AttachErrorIcon from '@/assets/images/icons/feedback/feedback_image_attach_error.svg?react';
import AttachMaxIcon from '@/assets/images/icons/feedback/feedback_image_attach_max.svg?react';
import AttachIcon from '@/assets/images/icons/feedback/feedback_image_attach.svg?react';
import Button from '@/components/common/Button/Button';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import Toast from '@/components/common/Toast/Toast';
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
import FeedbackImageGrid from './components/FeedbackImageGrid';
import FeedbackTag from './components/FeedbackTag';
import * as Styled from './FeedbackWritePage.styles';

/** 시안 11366:20088 */
const EXIT_MODAL = {
  title: '질문을 삭제할까요?',
  description: '삭제된 질문은 복구할 수 없습니다.',
  confirmLabel: '삭제',
};

const SAVE_MODAL = {
  title: '편지를 전송하시겠습니까?',
  description: '전송된 편지는 수정하거나 삭제할 수 없습니다.',
  confirmLabel: '확인',
};

const parseFeedbackType = (value?: string): FeedbackType | undefined =>
  FEEDBACK_TYPE_ORDER.find((type) => type.toLowerCase() === value);

type AttachError = 'count' | 'size' | 'type' | null;

/** File.type은 string이라 리터럴 튜플 그대로는 비교할 수 없다 */
const ALLOWED_TYPES: readonly string[] = ALLOWED_IMAGE_TYPES;

const SUBMIT_ERROR_FALLBACK = '전송에 실패했어요. 잠시 후 다시 시도해주세요.';

const ATTACH_ERROR_LABEL: Record<NonNullable<AttachError>, string> = {
  count: `최대 ${FEEDBACK_IMAGE_MAX_COUNT}장까지 첨부할 수 있어요.`,
  size: '10MB 이하 이미지만 첨부할 수 있어요.',
  type: '이미지 파일만 첨부할 수 있어요.',
};

/**
 * 미리보기 URL을 파일과 함께 들고 있는다.
 * 렌더 중에 만들면 매 렌더마다 새 URL이 생기고, 이펙트에서 만들면 setState가 연쇄 렌더를 부른다.
 * 선택하는 순간 한 번만 만들고 목록에서 빠질 때 해제한다.
 */
interface PickedImage {
  file: File;
  preview: string;
}

/**
 * 시안 Component 13(11435:18202)의 4가지 상태.
 * 용량 초과는 시안에 없지만 에러 상태 슬롯을 그대로 쓴다 — 문구는 임시다.
 */
const getAttachState = (imageCount: number, attachError: AttachError) => {
  if (attachError) {
    return {
      Icon: AttachErrorIcon,
      label: ATTACH_ERROR_LABEL[attachError],
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
  const [images, setImages] = useState<PickedImage[]>([]);
  const [attachError, setAttachError] = useState<AttachError>(null);
  const [openedModal, setOpenedModal] = useState<'exit' | 'save' | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * unmount 시 해제하려면 만들어 둔 URL 전부를 알아야 하는데 images 클로저로는 첫 렌더 값만 잡힌다.
   * 이미 해제된 URL을 다시 해제해도 아무 일도 일어나지 않아 중복 해제는 문제되지 않는다.
   */
  const createdPreviewsRef = useRef<string[]>([]);
  useEffect(
    () => () =>
      createdPreviewsRef.current.forEach((preview) =>
        URL.revokeObjectURL(preview),
      ),
    [],
  );

  /** isPending은 렌더 결과라, 렌더 전에 두 번 눌리면 두 호출 모두 false를 읽고 전송된다 */
  const submittingRef = useRef(false);

  const feedbackType = parseFeedbackType(typeParam);
  // React Compiler가 프로퍼티 접근을 조기 반환 위로 끌어올려도 안전하도록 구조분해를 피한다.
  const meta = feedbackType ? FEEDBACK_TYPE_META[feedbackType] : null;
  if (!feedbackType || !meta) return <Navigate to='/feedback/write' replace />;

  const canSubmit = content.trim().length >= FEEDBACK_CONTENT_MIN_LENGTH;
  const attachState = getAttachState(images.length, attachError);
  const isAttachFull = images.length >= FEEDBACK_IMAGE_MAX_COUNT;

  const handleBack = () => {
    if (content.length === 0) {
      navigate(-1);
      return;
    }
    setOpenedModal('exit');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    // 같은 파일을 다시 고를 수 있도록 비운다. 안 그러면 change 이벤트가 안 난다.
    event.target.value = '';

    // accept는 파일 선택 UI의 힌트일 뿐이라 허용하지 않은 형식도 넘어온다.
    // 서버가 저장 시점에 막지만, 그전에 걸러야 사용자가 이유를 안다.
    if (files.some((file) => !ALLOWED_TYPES.includes(file.type))) {
      setAttachError('type');
      return;
    }

    // 용량 초과가 하나라도 있으면 선택을 반영하지 않는다
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      setAttachError('size');
      return;
    }

    // 시안의 (2/4) → (4/4) 흐름대로 여러 번 나눠 골라도 쌓인다
    const picked = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    createdPreviewsRef.current.push(...picked.map((image) => image.preview));

    const merged = [...images, ...picked];
    const kept = merged.slice(0, FEEDBACK_IMAGE_MAX_COUNT);

    merged
      .slice(FEEDBACK_IMAGE_MAX_COUNT)
      .forEach((image) => URL.revokeObjectURL(image.preview));

    setAttachError(merged.length > FEEDBACK_IMAGE_MAX_COUNT ? 'count' : null);
    setImages(kept);
  };

  const handleImageRemove = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setAttachError(null);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // 확인 모달은 전송 중에도 떠 있어서 다시 누를 수 있다. 중복 전송을 막는다.
    if (submittingRef.current) return;
    submittingRef.current = true;

    createFeedback(
      {
        type: feedbackType,
        content: content.trim(),
        files: images.map((image) => image.file),
      },
      {
        onSuccess: () => {
          trackEvent(USER_EVENT.FEEDBACK_SUBMITTED, {
            type: feedbackType,
            contentLength: content.trim().length,
            imageCount: images.length,
          });
          navigate('/feedback/complete', { replace: true });
        },
        // 이미지가 R2에 없거나(601-2) 길이 검증에 걸리면 조용히 막힌다.
        onError: (error) => {
          submittingRef.current = false;
          trackEvent(USER_EVENT.FEEDBACK_SUBMIT_FAILED, {
            type: feedbackType,
            imageCount: images.length,
            message: error instanceof Error ? error.message : 'unknown',
          });

          // 모달을 닫아 토스트가 보이게 한다. 작성한 내용과 사진은 그대로 남아 다시 시도할 수 있다.
          setOpenedModal(null);
          setSubmitError(getServerErrorMessage(error, SUBMIT_ERROR_FALLBACK));
        },
      },
    );
  };

  /** 작성 화면까지 와서 보내지 않고 나간 경우. 퍼널에서 제일 큰 누수 지점이다 */
  const handleExitConfirm = () => {
    trackEvent(USER_EVENT.FEEDBACK_WRITE_ABANDONED, {
      type: feedbackType,
      contentLength: content.trim().length,
      imageCount: images.length,
    });
    navigate(-1);
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
            <Styled.CharCountValue $active={content.length > 0}>
              {content.length}
            </Styled.CharCountValue>
            /{FEEDBACK_CONTENT_MAX_LENGTH}
          </Styled.CharCount>
        </Styled.ContentField>

        <Styled.AttachButton $disabled={isAttachFull}>
          <Styled.AttachIconBox>
            <attachState.Icon width={36} height={28} aria-hidden />
          </Styled.AttachIconBox>
          <Styled.AttachLabel $variant={attachState.variant}>
            {attachState.label}
          </Styled.AttachLabel>
          <Styled.HiddenFileInput
            type='file'
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            multiple
            disabled={isAttachFull}
            onChange={handleImageChange}
          />
        </Styled.AttachButton>

        <FeedbackImageGrid
          srcs={images.map((image) => image.preview)}
          onRemove={handleImageRemove}
        />
      </Styled.Content>

      <Styled.BottomArea>
        <Button
          onClick={() => setOpenedModal('save')}
          disabled={!canSubmit || isPending}
        >
          저장하기
        </Button>
      </Styled.BottomArea>

      <ConfirmModal
        isOpen={openedModal === 'exit'}
        {...EXIT_MODAL}
        onConfirm={handleExitConfirm}
        onClose={() => setOpenedModal(null)}
      />
      <ConfirmModal
        isOpen={openedModal === 'save'}
        {...SAVE_MODAL}
        onConfirm={handleSubmit}
        onClose={() => setOpenedModal(null)}
      />

      <Toast
        isOpen={submitError !== null}
        onClose={() => setSubmitError(null)}
        message={submitError ?? ''}
      />
    </Styled.Container>
  );
};

export default FeedbackWritePage;
