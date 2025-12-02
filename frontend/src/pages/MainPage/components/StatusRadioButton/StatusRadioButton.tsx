import { useState } from 'react';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './StatusRadioButton.styles';
import { USER_EVENT } from '@/constants/eventName';

interface StatusRadioButtonProps {
  onChange: (selectedStatus: boolean) => void;
}

const StatusRadioButton = ({ onChange }: StatusRadioButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const trackEvent = useMixpanelTrack();

  const handleToggle = () => {
    setIsActive((prev) => {
      const newStatus = !prev;
      onChange(newStatus);

      trackEvent(USER_EVENT.STATUS_RADIO_BUTTON_CLICKED, {
        new_status: newStatus ? 'OPEN' : 'ALL',
      });

      return newStatus;
    });
  };

  return (
    <Styled.RadioLabel>
      <Styled.RadioInput
        type='checkbox'
        checked={isActive}
        onChange={handleToggle}
      />
      <Styled.CustomRadio $isActive={isActive} />
      <Styled.RadioText $isActive={isActive}>
        모집중/모집예정 보기
      </Styled.RadioText>
    </Styled.RadioLabel>
  );
};

export default StatusRadioButton;
