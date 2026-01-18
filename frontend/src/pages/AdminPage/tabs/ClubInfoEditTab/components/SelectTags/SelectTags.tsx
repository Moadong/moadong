import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import * as Styled from './SelectTags.styles';

export interface TagOption {
  value: string;
  label: string;
  color?: string;
}

interface SelectTagsProps {
  label: string;
  tags: TagOption[];
  selected: string;
  onChange: (tag: string) => void;
}

const SelectTags = ({ label, tags, selected, onChange }: SelectTagsProps) => {
  const trackEvent = useMixpanelTrack();

  return (
    <div>
      <Styled.Label>{label}</Styled.Label>
      <Styled.Container>
        {tags.map((tag, index) => (
          <Styled.Button
            key={index}
            onClick={() => {
              trackEvent(ADMIN_EVENT.CLUB_TAG_SELECT_BUTTON_CLICKED, {
                tagName: tag.value,
                category: label,
              });
              onChange(tag.value);
            }}
            selected={selected === tag.value}
            color={tag.color}
          >
            #{tag.label}
          </Styled.Button>
        ))}
      </Styled.Container>
    </div>
  );
};

export default SelectTags;
