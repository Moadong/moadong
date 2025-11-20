import * as Styled from './SelectTags.styles';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { ADMIN_EVENT } from '@/constants/eventName';

interface SelectTagsProps {
  label: string;
  tags: string[];
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
                tagName: tag,
                category: label,
              });
              onChange(tag);
            }}
            selected={selected === tag}
          >
            #{tag}
          </Styled.Button>
        ))}
      </Styled.Container>
    </div>
  );
};

export default SelectTags;
