// 학생/운영진 소개를 전환하는 토글. 첫 화면 위 큰 토글과 스크롤 뒤 헤더 속 작은 토글 두 모양이 있다
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
  /** 헤더 안에 들어가는 작은 모양 (짧은 이름만 보인다) */
  compact?: boolean;
}

const AudienceToggle = ({
  value,
  onChange,
  compact = false,
}: AudienceToggleProps) => {
  return (
    <Styled.Bar $compact={compact}>
      <Styled.Track
        role='tablist'
        aria-label='소개 대상 선택'
        $compact={compact}
      >
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
              $compact={compact}
              onClick={() => !selected && onChange(tab.value)}
            >
              {selected && (
                <Styled.Indicator
                  layoutId={`introduce-audience-indicator${compact ? '-compact' : ''}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <Styled.Label>
                <Emoji aria-hidden='true'>{tab.emoji}</Emoji>
                {compact ? (
                  <span>{tab.shortLabel}</span>
                ) : (
                  <>
                    <Styled.LongText>{tab.label}</Styled.LongText>
                    <Styled.ShortText>{tab.shortLabel}</Styled.ShortText>
                  </>
                )}
              </Styled.Label>
            </Styled.Tab>
          );
        })}
      </Styled.Track>
    </Styled.Bar>
  );
};

export default AudienceToggle;
