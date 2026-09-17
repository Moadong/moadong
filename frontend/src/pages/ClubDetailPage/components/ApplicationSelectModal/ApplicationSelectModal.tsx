import { useRef, useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import { ApplicationForm } from '@/types/application';
import * as Styled from './ApplicationSelectModal.styles';

export interface ApplicationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationOptions: ApplicationForm[];
  onOptionSelect: (application: ApplicationForm) => void;
}

const TRACK_HEIGHT = 164;
const THUMB_HEIGHT = 60;

const ApplicationSelectModal = ({
  isOpen,
  onClose,
  applicationOptions,
  onOptionSelect,
}: ApplicationSelectModalProps) => {
  const [thumbOffset, setThumbOffset] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const hasScroll = applicationOptions.length > 3;

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const maxOffset = TRACK_HEIGHT - THUMB_HEIGHT;
    setThumbOffset(maxScroll > 0 ? (scrollTop / maxScroll) * maxOffset : 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Styled.Dialog role='dialog' aria-modal='true'>
        <Styled.Header>
          <Styled.Title>지원서 선택</Styled.Title>
          <Styled.CloseButton
            aria-label='close'
            type='button'
            onClick={onClose}
          >
            ✕
          </Styled.CloseButton>
        </Styled.Header>
        <Styled.Body>
          {applicationOptions.length === 0 ? (
            <Styled.EmptyMessage>
              지원 가능한 분야가 없습니다.
            </Styled.EmptyMessage>
          ) : (
            <>
              <Styled.ListWrapper ref={listRef} onScroll={handleScroll}>
                <Styled.List>
                  {applicationOptions.map((application) => (
                    <Styled.OptionButton
                      key={application.id}
                      onClick={() => onOptionSelect(application)}
                    >
                      {application.title}
                    </Styled.OptionButton>
                  ))}
                </Styled.List>
              </Styled.ListWrapper>
              {hasScroll && (
                <Styled.ScrollbarTrack>
                  <Styled.ScrollbarThumb $offset={thumbOffset} />
                </Styled.ScrollbarTrack>
              )}
            </>
          )}
        </Styled.Body>
      </Styled.Dialog>
    </Modal>
  );
};

export default ApplicationSelectModal;
