// 소개 페이지 상단에 붙어 학생/운영진 소개를 전환하는 토글
import { Emoji } from '@/pages/IntroducePage/components/Tossface/Tossface';
import {
  Audience,
  AUDIENCE_TABS,
} from '@/pages/IntroducePage/constants/audience';
import * as Styled from './AudienceToggle.styles';

export const AUDIENCE_PANEL_ID = 'introduce-audience-panel';

interface AudienceToggleProps {
  value: Audience;
  onChange: (next: Audience) => void;
}

const AudienceToggle = ({ value, onChange }: AudienceToggleProps) => {
  return (
    <Styled.Bar>
      <Styled.Track role='tablist' aria-label='소개 대상 선택'>
        {AUDIENCE_TABS.map((tab) => {
          const selected = tab.value === value;
          return (
            <Styled.Tab
              key={tab.value}
              type='button'
              role='tab'
              aria-selected={selected}
              aria-controls={AUDIENCE_PANEL_ID}
              $selected={selected}
              onClick={() => !selected && onChange(tab.value)}
            >
              {selected && (
                <Styled.Indicator
                  layoutId='introduce-audience-indicator'
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <Styled.Label>
                <Emoji aria-hidden='true'>{tab.emoji}</Emoji>
                <Styled.LongText>{tab.label}</Styled.LongText>
                <Styled.ShortText>{tab.shortLabel}</Styled.ShortText>
              </Styled.Label>
            </Styled.Tab>
          );
        })}
      </Styled.Track>
    </Styled.Bar>
  );
};

export default AudienceToggle;
