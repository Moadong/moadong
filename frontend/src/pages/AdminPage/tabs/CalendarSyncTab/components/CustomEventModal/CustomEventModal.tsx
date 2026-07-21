import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Modal from '@/components/common/Modal/Modal';
import ModalLayout from '@/components/common/Modal/ModalLayout';
import {
  useCreateCustomCalendarEvent,
  useDeleteCustomCalendarEvent,
  useUpdateCustomCalendarEvent,
} from '@/hooks/Queries/useCustomCalendarEvents';
import { ApiError } from '@/errors';
import type { CustomCalendarEventInput } from '@/types/club';
import * as Styled from './CustomEventModal.styles';

interface CustomEventModalProps {
  mode: 'create' | 'edit';
  eventId?: string;
  initialValues: CustomCalendarEventInput;
  onClose: () => void;
}

const resolveErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    if (error.errorCode === '970-1') return '동아리 정보를 찾을 수 없습니다.';
    if (error.errorCode === '970-2') return '해당 일정을 찾을 수 없습니다.';
    return error.message || fallback;
  }
  return fallback;
};

const CustomEventModal = ({
  mode,
  eventId,
  initialValues,
  onClose,
}: CustomEventModalProps) => {
  const createMutation = useCreateCustomCalendarEvent();
  const updateMutation = useUpdateCustomCalendarEvent();
  const deleteMutation = useDeleteCustomCalendarEvent();

  const [form, setForm] = useState<CustomCalendarEventInput>(initialValues);
  const [errorMessage, setErrorMessage] = useState('');

  const isEdit = mode === 'edit';
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const updateField =
    (key: keyof CustomCalendarEventInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (!form.title.trim() || !form.start.trim()) {
      setErrorMessage('제목과 시작일은 필수입니다.');
      return;
    }

    const trimmedEnd = form.end?.trim();
    if (trimmedEnd && trimmedEnd < form.start) {
      setErrorMessage('종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }

    const payload: CustomCalendarEventInput = {
      title: form.title.trim(),
      start: form.start,
      end: trimmedEnd || undefined,
      url: form.url?.trim() ? form.url.trim() : undefined,
      description: form.description?.trim() ? form.description.trim() : undefined,
    };

    const onError = (error: unknown) =>
      setErrorMessage(resolveErrorMessage(error, '일정 저장에 실패했습니다.'));

    if (isEdit && eventId) {
      updateMutation.mutate(
        { eventId, input: payload },
        { onSuccess: onClose, onError },
      );
      return;
    }

    createMutation.mutate(payload, { onSuccess: onClose, onError });
  };

  const handleDelete = () => {
    if (!eventId) return;
    if (!window.confirm('이 일정을 삭제할까요?')) return;
    deleteMutation.mutate(eventId, {
      onSuccess: onClose,
      onError: (error) =>
        setErrorMessage(resolveErrorMessage(error, '일정 삭제에 실패했습니다.')),
    });
  };

  return (
    <Modal isOpen onClose={onClose}>
      <ModalLayout title={isEdit ? '일정 수정' : '일정 추가'} onClose={onClose}>
        <Styled.Form onSubmit={handleSubmit}>
          <Styled.Field>
            제목 *
            <Styled.Input
              type='text'
              value={form.title}
              onChange={updateField('title')}
              placeholder='예: 정기 모임'
              maxLength={100}
              autoFocus
            />
          </Styled.Field>
          <Styled.FieldRow>
            <Styled.Field>
              시작일 *
              <Styled.Input
                type='date'
                value={form.start}
                onChange={updateField('start')}
              />
            </Styled.Field>
            <Styled.Field>
              종료일
              <Styled.Input
                type='date'
                value={form.end}
                onChange={updateField('end')}
              />
            </Styled.Field>
          </Styled.FieldRow>
          <Styled.Field>
            링크
            <Styled.Input
              type='url'
              value={form.url}
              onChange={updateField('url')}
              placeholder='https://'
            />
          </Styled.Field>
          <Styled.Field>
            설명
            <Styled.TextArea
              value={form.description}
              onChange={updateField('description')}
              placeholder='일정에 대한 설명을 입력하세요.'
            />
          </Styled.Field>

          {errorMessage && <Styled.ErrorText>{errorMessage}</Styled.ErrorText>}

          <Styled.FormActions>
            {isEdit && (
              <Styled.DeleteButton
                type='button'
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                삭제
              </Styled.DeleteButton>
            )}
            <Styled.TextButton
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Styled.TextButton>
            <Button type='submit' width='120px' disabled={isSubmitting}>
              {isSubmitting ? '저장 중…' : '저장'}
            </Button>
          </Styled.FormActions>
        </Styled.Form>
      </ModalLayout>
    </Modal>
  );
};

export default CustomEventModal;
