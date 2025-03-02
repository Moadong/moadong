import React from "react";
import * as Styled from "./SelectTags.styles";

interface SelectTagsProps {
    label: string;
    tags: string[];
    selected: string;
    onChange: (tag: string) => void;
}

const SelectTags = ({ label, tags, selected, onChange }: SelectTagsProps) => {
    return (
        <div>
            <Styled.Label>{label}</Styled.Label>
            <Styled.Container>
                {tags.map((tag, index) => (
                    <Styled.Button
                        key={index}
                        onClick={() => onChange(tag)}
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
