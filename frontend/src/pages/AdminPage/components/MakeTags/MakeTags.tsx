import React from 'react';
import * as Styled from './MakeTags.styles';

interface MakeTagsProps {
    value: string[];
    onChange: (tags: string[]) => void;
}

const MakeTags = ({ value, onChange }: MakeTagsProps) => {
    const updateTag = (index: number, newValue: string) => {
        if (newValue.length > 5) {
            alert("태그는 최대 5자까지만 입력할 수 있습니다.");
            return;
        }
        const updatedTags = [...value];
        updatedTags[index] = newValue;
        onChange(updatedTags);
    };

    const clearTag = (index: number) => {
        const updatedTags = [...value];
        updatedTags[index] = '';
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
                        {tag.length > 0 && <Styled.RemoveButton onClick={() => clearTag(index)} />}
                    </Styled.TagItem>
                ))}
            </Styled.TagsContainer>
        </div>
    );
};

export default MakeTags;
