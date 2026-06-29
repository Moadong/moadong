import { useState } from 'react';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import EditField from '@/pages/AdminPage/components/editFields/EditField/EditField';
import MobileSaveButtonArea from '@/pages/AdminPage/components/MobileSaveButtonArea/MobileSaveButtonArea';
import * as Styled from './FreeTagEditPage.styles';

interface FreeTagEditPageProps {
  initialTags: string[];
  onSave: (tags: string[]) => void;
  onSaveToServer: (tags: string[]) => void;
  onBack: () => void;
}

const FreeTagEditPage = ({
  initialTags,
  onSave,
  onSaveToServer,
  onBack,
}: FreeTagEditPageProps) => {
  const [tags, setTags] = useState(initialTags);

  const isDirty = tags.join(',') !== initialTags.join(',');

  const updateTag = (index: number, value: string) => {
    setTags((prev) => prev.map((t, i) => (i === index ? value : t)));
  };

  const handleSave = () => {
    onSave(tags);
    onSaveToServer(tags);
    onBack();
  };

  return (
    <>
      <Styled.Container>
        <WebviewTopBar title='자유태그' onBack={onBack} />
        <Styled.Content>
          {tags.map((tag, index) => (
            <EditField key={index} label={`태그${index + 1}`}>
              <Styled.TagInputRow $hasValue={tag.length > 0}>
                {tag.length === 0 && (
                  <Styled.DashedBgSvg preserveAspectRatio='none' />
                )}
                <Styled.HashSymbol $hasValue={tag.length > 0}>
                  #
                </Styled.HashSymbol>
                <Styled.TagInput
                  value={tag}
                  maxLength={5}
                  placeholder='태그추가'
                  onChange={(e) => updateTag(index, e.target.value)}
                />
              </Styled.TagInputRow>
            </EditField>
          ))}
        </Styled.Content>
      </Styled.Container>
      <MobileSaveButtonArea onClick={handleSave} disabled={!isDirty} />
    </>
  );
};

export default FreeTagEditPage;
