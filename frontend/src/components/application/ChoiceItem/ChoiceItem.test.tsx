import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ChoiceItem from './ChoiceItem';

describe('ChoiceItem', () => {
  it('내용이 없는 선택지에만 hint text 표시를 붙인다', () => {
    const { rerender } = render(
      <ChoiceItem label='' selected={false} onClick={() => {}} />,
    );

    expect(screen.getByText('(빈 항목)')).toHaveAttribute('data-empty', 'true');

    rerender(<ChoiceItem label='운동' selected={false} onClick={() => {}} />);

    expect(screen.queryByText('(빈 항목)')).not.toBeInTheDocument();
    expect(screen.getByText('운동')).not.toHaveAttribute('data-empty');
  });
});
