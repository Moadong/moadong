import { useState } from 'react';
import TriangleDown from '@/assets/images/icons/triangle_down.svg?react';
import { AVAILABLE_STATUSES } from '@/constants/status';
import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './BulkActionBar.styles';

interface BulkActionBarProps {
  enabled: boolean;
  onStatusChange: (status: ApplicationStatus) => void;
  onDelete: () => void;
}

const BulkActionBar = ({ enabled, onStatusChange, onDelete }: BulkActionBarProps) => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const handleStatusButtonClick = () => {
    if (!enabled) return;
    setIsStatusMenuOpen((prev) => !prev);
  };

  const handleStatusSelect = (status: ApplicationStatus) => {
    onStatusChange(status);
    setIsStatusMenuOpen(false);
  };

  return (
    <Styled.Container>
      <Styled.StatusButtonWrapper>
        <Styled.StatusButton $enabled={enabled} onClick={handleStatusButtonClick}>
          <span>상태변경</span>
          <Styled.TriangleIcon $enabled={enabled} as={TriangleDown} />
        </Styled.StatusButton>
        {isStatusMenuOpen && (
          <Styled.StatusMenu>
            {AVAILABLE_STATUSES.map((status) => (
              <Styled.StatusMenuItem
                key={status}
                onClick={() => handleStatusSelect(status)}
              >
                {mapStatusToGroup(status).label}
              </Styled.StatusMenuItem>
            ))}
          </Styled.StatusMenu>
        )}
      </Styled.StatusButtonWrapper>

      <Styled.DeleteButton $enabled={enabled} onClick={enabled ? onDelete : undefined}>
        삭제
      </Styled.DeleteButton>
    </Styled.Container>
  );
};

export default BulkActionBar;
