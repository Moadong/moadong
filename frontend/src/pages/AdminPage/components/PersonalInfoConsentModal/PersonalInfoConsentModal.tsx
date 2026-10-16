import { useState } from 'react';
import { allowPersonalInformation } from '@/apis/auth';
import Button from '@/components/common/Button/Button';
import Modal from '@/components/common/Modal/Modal';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import * as Styled from './PersonalInfoConsentModal.styles';

const GUIDE_ITEMS = [
  {
    icon: '✏️',
    text: '동아리 소개, 활동 사진, 모집 일정 등을 자유롭게 등록하고 관리할 수 있어요.',
  },
  {
    icon: '📋',
    text: '모아동 지원서를 직접 만들거나, 외부 폼(구글폼 등) 링크를 연결하여 모집할 수 있어요.',
  },
  { icon: '🌐', text: '등록한 정보는 모아동 홈페이지에 바로 반영돼요.' },
];

interface PersonalInfoConsentModalProps {
  clubName: string;
  onConsent: () => void;
}

const PersonalInfoConsentModal = ({
  clubName,
  onConsent,
}: PersonalInfoConsentModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleConsent = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await allowPersonalInformation();
      localStorage.setItem(STORAGE_KEYS.HAS_CONSENTED_PERSONAL_INFO, 'true');
      onConsent();
    } catch (error) {
      console.error('서비스 동의 실패:', error);
      alert('동의 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={() => {}} closeOnBackdrop={false}>
      <Styled.Container>
        <Styled.Title>{clubName}님, 환영합니다!</Styled.Title>
        <Styled.Subtitle>
          관리자 페이지에서 이런 것들을 할 수 있어요.
        </Styled.Subtitle>
        <Styled.GuideList>
          {GUIDE_ITEMS.map((item) => (
            <Styled.GuideItem key={item.text}>
              <Styled.GuideIcon>{item.icon}</Styled.GuideIcon>
              {item.text}
            </Styled.GuideItem>
          ))}
        </Styled.GuideList>
        <Styled.Footer>
          등록한 정보는 모아동 서비스에서 동아리를 소개하고 홍보하는 데 사용돼요
        </Styled.Footer>
        <Button width='100%' onClick={handleConsent} disabled={loading}>
          {loading ? '처리 중...' : '확인하고 시작하기'}
        </Button>
      </Styled.Container>
    </Modal>
  );
};

export default PersonalInfoConsentModal;
