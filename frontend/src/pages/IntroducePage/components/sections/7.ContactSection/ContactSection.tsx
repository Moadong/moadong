import { ReactNode } from 'react';
import BrandDoodle from '@/pages/IntroducePage/components/BrandDoodle/BrandDoodle';
import * as Styled from './ContactSection.styles';

interface ContactSectionProps {
  title: string;
  /** 대상별 시작 버튼 */
  actions: ReactNode;
}

const ContactSection = ({ title, actions }: ContactSectionProps) => {
  return (
    <Styled.ContactSection>
      <BrandDoodle
        shape='twistRight'
        width='min(20vw, 240px)'
        position={{ top: '-30px', left: 'max(-60px, calc(50% - 600px))' }}
        rotate={160}
      />
      <BrandDoodle
        shape='mark'
        width='min(12vw, 120px)'
        position={{ bottom: '28px', right: 'max(16px, calc(50% - 540px))' }}
        rotate={12}
        fillOpacity={0.14}
        delay={0.4}
      />
      <Styled.ContactTitle>{title}</Styled.ContactTitle>
      {actions}
    </Styled.ContactSection>
  );
};

export default ContactSection;
