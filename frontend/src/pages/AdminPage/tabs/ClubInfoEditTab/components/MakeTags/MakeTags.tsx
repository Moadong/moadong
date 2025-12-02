import * as Styled from './MakeTags.styles';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { ADMIN_EVENT } from '@/constants/eventName';

interface MakeTagsProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const MakeTags = ({ value, onChange }: MakeTagsProps) => {
  const trackEvent = useMixpanelTrack();

  const updateTag = (index: number, newValue: string) => {
    const updatedTags = value.map((tag, i) => {
      if (i === index) {
        return newValue;
      }
      return tag;
    });

    onChange(updatedTags);
  };

  // 특정 인덱스의 태그를 초기화하는 함수
  const clearTag = (index: number) => {
    const updatedTags = value.map((tag, i) => {
      if (i === index) {
        return '';
      }
      return tag;
    });
    
    trackEvent(ADMIN_EVENT.CLUB_TAG_CLEAR_BUTTON_CLICKED, {
      tagIndex: index + 1,
    });

    onChange(updatedTags);
  };

  return (
    <div>
      <Styled.Label>자유태그 (5자 이내)</Styled.Label>
      <Styled.TagsContainer>
        {value.map((tag, index) => (
          <Styled.TagItem key={index}>
            <Styled.Hashtag>#</Styled.Hashtag>
            <Styled.TagTextInput
              value={tag}
              maxLength={5}
              onChange={(e) => updateTag(index, e.target.value)}
            />
            {tag.length > 0 && (
              <Styled.RemoveButton onClick={() => clearTag(index)} />
            )}
          </Styled.TagItem>
        ))}
      </Styled.TagsContainer>
    </div>
  );
};

export default MakeTags;
