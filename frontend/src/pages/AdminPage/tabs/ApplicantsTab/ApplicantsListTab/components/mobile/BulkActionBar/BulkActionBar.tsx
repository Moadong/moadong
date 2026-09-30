import { AVAILABLE_STATUSES } from '@/constants/status';
import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './BulkActionBar.styles';

interface BulkActionBarProps {
  enabled: boolean;
  onStatusChange: (status: ApplicationStatus) => void;
  onDelete: () => void;
  onExport: () => void;
  exportEnabled: boolean;
  isStatusMenuOpen: boolean;
  onToggleStatusMenu: () => void;
}

const BulkActionBar = ({
  enabled,
  onStatusChange,
  onDelete,
  onExport,
  exportEnabled,
  isStatusMenuOpen,
  onToggleStatusMenu,
}: BulkActionBarProps) => {
  const handleStatusButtonClick = () => {
    if (!enabled) return;
    onToggleStatusMenu();
  };

  const handleStatusSelect = (status: ApplicationStatus) => {
    onStatusChange(status);
    onToggleStatusMenu();
  };

  return (
    <Styled.Container>
      <Styled.StatusButtonWrapper>
        <Styled.StatusButton
          $enabled={enabled}
          onClick={handleStatusButtonClick}
        >
          <span>상태변경</span>
          <Styled.TriangleIcon $enabled={enabled} $isOpen={isStatusMenuOpen} />
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

      <Styled.ExportButton
        $enabled={exportEnabled}
        onClick={exportEnabled ? onExport : undefined}
      >
        <Styled.CsvIcon $enabled={exportEnabled} />
        내보내기
      </Styled.ExportButton>

      <Styled.DeleteButton
        $enabled={enabled}
        onClick={enabled ? onDelete : undefined}
      >
        삭제
      </Styled.DeleteButton>
    </Styled.Container>
  );
};

export default BulkActionBar;
