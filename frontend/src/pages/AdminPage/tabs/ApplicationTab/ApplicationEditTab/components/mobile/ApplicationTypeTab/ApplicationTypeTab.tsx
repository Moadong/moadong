import { ApplicationFormMode } from '@/types/application';
import * as Styled from './ApplicationTypeTab.styles';

const TAB_LABELS: Record<ApplicationFormMode, string> = {
  [ApplicationFormMode.INTERNAL]: '모아동 지원서',
  [ApplicationFormMode.EXTERNAL]: '외부 지원서',
};

interface ApplicationTypeTabProps {
  activeMode: ApplicationFormMode;
  onChange: (mode: ApplicationFormMode) => void;
}

const ApplicationTypeTab = ({
  activeMode,
  onChange,
}: ApplicationTypeTabProps) => {
  return (
    <Styled.TabContainer>
      {(Object.values(ApplicationFormMode) as ApplicationFormMode[]).map(
        (mode) => (
          <Styled.Tab
            key={mode}
            $active={activeMode === mode}
            onClick={() => onChange(mode)}
          >
            {TAB_LABELS[mode]}
          </Styled.Tab>
        ),
      )}
    </Styled.TabContainer>
  );
};

export default ApplicationTypeTab;
