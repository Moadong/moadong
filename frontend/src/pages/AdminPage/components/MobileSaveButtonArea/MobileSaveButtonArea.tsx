import Button from '@/components/common/Button/Button';
import * as Styled from './MobileSaveButtonArea.styles';

interface MobileSaveButtonAreaProps {
  onClick: () => void;
  disabled?: boolean;
}

const MobileSaveButtonArea = ({
  onClick,
  disabled,
}: MobileSaveButtonAreaProps) => (
  <Styled.SaveButtonArea>
    <Button onClick={onClick} disabled={disabled}>
      저장하기
    </Button>
  </Styled.SaveButtonArea>
);

export default MobileSaveButtonArea;
