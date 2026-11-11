import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import BulkActionBar from './BulkActionBar';

const baseProps = {
  enabled: true,
  onStatusChange: () => {},
  onDelete: () => {},
  exportEnabled: true,
  isStatusMenuOpen: false,
  onToggleStatusMenu: () => {},
};

describe('BulkActionBar', () => {
  it('onExport를 넘기면 내보내기 버튼을 그린다', () => {
    render(<BulkActionBar {...baseProps} onExport={() => {}} />);

    expect(screen.getByText('내보내기')).toBeInTheDocument();
  });

  it('onExport를 넘기지 않으면(폰 폭) 내보내기 버튼을 그리지 않는다', () => {
    render(<BulkActionBar {...baseProps} />);

    expect(screen.queryByText('내보내기')).not.toBeInTheDocument();
    expect(screen.getByText('상태변경')).toBeInTheDocument();
    expect(screen.getByText('삭제')).toBeInTheDocument();
  });
});
