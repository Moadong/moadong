import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import isInAppWebView from '@/utils/isInAppWebView';
import {
  PRIVACY_POLICY_DATES,
  PRIVACY_POLICY_INTRO,
  PRIVACY_POLICY_SECTIONS,
  type PolicyBlock,
} from './constants/privacyPolicy';
import * as Styled from './PrivacyPolicyPage.styles';

const renderBlock = (block: PolicyBlock, index: number) => {
  const key = `${block.type}-${index}`;

  if (block.type === 'subtitle') {
    return <Styled.Subtitle key={key}>{block.text}</Styled.Subtitle>;
  }

  if (block.type === 'list') {
    return (
      <Styled.List key={key}>
        {block.items.map((item) => (
          <Styled.ListItem key={item}>{item}</Styled.ListItem>
        ))}
      </Styled.List>
    );
  }

  return <Styled.Paragraph key={key}>{block.text}</Styled.Paragraph>;
};

const PrivacyPolicyPage = () => {
  const isWebView = isInAppWebView();

  return (
    <>
      {isWebView ? <WebviewTopBar title='개인정보 처리방침' /> : <Header />}
      <Styled.Main $hasFixedHeader={!isWebView}>
        <Styled.Title>개인정보 처리방침</Styled.Title>
        <Styled.Intro>{PRIVACY_POLICY_INTRO}</Styled.Intro>

        {PRIVACY_POLICY_SECTIONS.map((section) => (
          <Styled.Section key={section.title}>
            <Styled.SectionTitle>{section.title}</Styled.SectionTitle>
            {section.blocks.map(renderBlock)}
          </Styled.Section>
        ))}

        <Styled.Dates>
          <span>공고일자: {PRIVACY_POLICY_DATES.announcedAt}</span>
          <span>시행일자: {PRIVACY_POLICY_DATES.effectiveAt}</span>
        </Styled.Dates>
      </Styled.Main>
      {!isWebView && <Footer />}
    </>
  );
};

export default PrivacyPolicyPage;
