import { useState } from 'react';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { SNS_CONFIG } from '@/constants/snsConfig';
import LinkField from '@/pages/AdminPage/components/editFields/LinkField/LinkField';
import MobileSaveButtonArea from '@/pages/AdminPage/components/MobileSaveButtonArea/MobileSaveButtonArea';
import { validateSocialLink } from '@/utils/validateSocialLink';
import * as Styled from './LinkEditPage.styles';

interface LinkEditPageLinks {
  instagram: string;
  youtube: string;
}

interface LinkEditPageProps {
  initialLinks: LinkEditPageLinks;
  onSave: (links: LinkEditPageLinks) => void;
  onBack: () => void;
}

const LinkEditPage = ({ initialLinks, onSave, onBack }: LinkEditPageProps) => {
  const [links, setLinks] = useState(initialLinks);
  const [errors, setErrors] = useState({ instagram: '', youtube: '' });

  const isDirty =
    links.instagram !== initialLinks.instagram ||
    links.youtube !== initialLinks.youtube;

  const handleChange = (key: keyof LinkEditPageLinks, value: string) => {
    setLinks((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({
      ...prev,
      [key]: validateSocialLink(key, value),
    }));
  };

  const handleSave = () => {
    const hasErrors = Object.values(errors).some((e) => e !== '');
    if (hasErrors) {
      alert('링크에 오류가 있어요. 수정 후 다시 시도해주세요!');
      return;
    }
    onSave(links);
    onBack();
  };

  return (
    <>
      <Styled.Container>
        <WebviewTopBar title='링크 추가' onBack={onBack} />
        <Styled.Content>
          <LinkField
            label={SNS_CONFIG.instagram.label}
            placeholder={SNS_CONFIG.instagram.placeholder}
            value={links.instagram}
            onChange={(v) => handleChange('instagram', v)}
            onClear={() => handleChange('instagram', '')}
            error={errors.instagram}
          />
          <LinkField
            label={SNS_CONFIG.youtube.label}
            placeholder={SNS_CONFIG.youtube.placeholder}
            value={links.youtube}
            onChange={(v) => handleChange('youtube', v)}
            onClear={() => handleChange('youtube', '')}
            error={errors.youtube}
          />
        </Styled.Content>
      </Styled.Container>
      <MobileSaveButtonArea onClick={handleSave} disabled={!isDirty} />
    </>
  );
};

export default LinkEditPage;
