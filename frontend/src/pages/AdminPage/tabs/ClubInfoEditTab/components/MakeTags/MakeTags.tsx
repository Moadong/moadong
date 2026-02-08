import clearButton from '@/assets/images/icons/input_clear_button_icon.svg';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import * as Styled from './MakeTags.styles';

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
              placeholder={`자유 태그 ${index + 1}`}
              aria-label={`자유 태그 ${index + 1}`}
            />
            {tag.length > 0 && (
              <Styled.RemoveButton
                onClick={() => clearTag(index)}
                aria-label={`자유 태그 ${index + 1} 삭제`}
                type='button'
              >
                <img src={clearButton} alt='' />
              </Styled.RemoveButton>
            )}
          </Styled.TagItem>
        ))}
      </Styled.TagsContainer>
    </div>
  );
};

export default MakeTags;
