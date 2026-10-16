import { useState } from 'react';
import ResponsiveSheet from '@/components/common/ResponsiveSheet/ResponsiveSheet';
import type { DeleteScope } from '@/types/club';
import * as Styled from './DeleteScopeSheet.styles';

const SCOPE_OPTIONS: { value: DeleteScope; label: string }[] = [
  { value: 'THIS', label: '이 일정' },
  { value: 'THIS_AND_FOLLOWING', label: '이 일정과 이후 일정' },
  { value: 'ALL', label: '모든 반복 일정' },
];

interface DeleteScopeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scope: DeleteScope) => void;
  isDeleting?: boolean;
  /** 반복 일정만 삭제 범위를 고른다. 그 외에는 확인만 받는다. */
  showScopeOptions?: boolean;
  /**
   * 연동 일정은 원본을 남기고 캘린더에서 숨기기만 한다.
   * 숨김 요청에는 범위 개념이 없어 showScopeOptions보다 우선한다.
   */
  isHiding?: boolean;
}

const DeleteScopeSheet = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  showScopeOptions = true,
  isHiding = false,
}: DeleteScopeSheetProps) => {
  /** 실수로 시리즈 전체를 지우지 않도록 가장 좁은 범위를 기본으로 둔다 */
  const [scope, setScope] = useState<DeleteScope>('THIS');

  const confirmMessage = isHiding
    ? '이 일정을 캘린더에서 숨길까요?'
    : '이 일정을 삭제할까요?';
  const submitLabel = isHiding ? '캘린더에서 숨기기' : '일정 삭제하기';
  const pendingLabel = isHiding ? '숨기는 중…' : '삭제 중…';

  return (
    <ResponsiveSheet isOpen={isOpen} onClose={onClose}>
      <Styled.Body>
        {(!showScopeOptions || isHiding) && (
          <Styled.ConfirmMessage>{confirmMessage}</Styled.ConfirmMessage>
        )}
        {showScopeOptions &&
          !isHiding &&
          SCOPE_OPTIONS.map((option) => (
            <Styled.OptionRow key={option.value}>
              <Styled.HiddenRadio
                type='radio'
                name='delete-scope'
                value={option.value}
                checked={scope === option.value}
                onChange={() => setScope(option.value)}
              />
              <Styled.Checkbox
                $checked={scope === option.value}
                aria-hidden='true'
              >
                {scope === option.value && (
                  <svg width='14' height='14' viewBox='0 0 14 14'>
                    <path
                      d='M2.5 7.5L5.5 10.5L11.5 4'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      fill='none'
                    />
                  </svg>
                )}
              </Styled.Checkbox>
              <Styled.OptionLabel>{option.label}</Styled.OptionLabel>
            </Styled.OptionRow>
          ))}

        <Styled.Actions>
          <Styled.CancelButton type='button' onClick={onClose}>
            취소
          </Styled.CancelButton>
          <Styled.DeleteButton
            type='button'
            disabled={isDeleting}
            onClick={() => onConfirm(scope)}
          >
            {isDeleting ? pendingLabel : submitLabel}
          </Styled.DeleteButton>
        </Styled.Actions>
      </Styled.Body>
    </ResponsiveSheet>
  );
};

export default DeleteScopeSheet;
