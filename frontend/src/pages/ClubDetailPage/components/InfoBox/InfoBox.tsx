import React from 'react';
import * as Styled from './InfoBox.styles';
import { ClubDetail } from '@/types/club';
import { INFOTABS_SCROLL_INDEX } from '@/constants/scrollSections';
import SnsLinkIcons from '@/pages/ClubDetailPage/components/SnsLinkIcons/SnsLinkIcons';

interface ClubInfoItem {
  label: string;
  value?: string;
  render?: React.ReactNode;
}

interface ClubInfoSection {
  title: string;
  descriptions: ClubInfoItem[];
}

interface InfoBoxProps {
  sectionRefs: React.RefObject<(HTMLDivElement | null)[]>;
  clubDetail: ClubDetail;
}

interface ClubInfoSectionWithRef extends ClubInfoSection {
  refIndex: INFOTABS_SCROLL_INDEX;
}

const InfoBox = ({ sectionRefs, clubDetail }: InfoBoxProps) => {
  const infoData: ClubInfoSectionWithRef[] = [
    {
      title: '모집정보',
      descriptions: [
        { label: '모집기간', value: clubDetail.recruitmentPeriod },
        { label: '모집대상', value: clubDetail.recruitmentTarget },
      ],
      refIndex: INFOTABS_SCROLL_INDEX.INTRODUCE_INFO_TAB,
    },
    {
      title: '동아리정보',
      descriptions: [
        { label: '회장이름', value: clubDetail.presidentName },
        { label: '전화번호', value: clubDetail.presidentPhoneNumber },
        {
          label: 'SNS',
          render: <SnsLinkIcons links={clubDetail.socialLinks} />,
        },
      ],
      refIndex: INFOTABS_SCROLL_INDEX.CLUB_INFO_TAB,
    },
  ];

  return (
    <Styled.InfoBoxWrapper>
      {infoData.map((info) => (
        <Styled.InfoBox
          key={info.refIndex}
          ref={(el) => {
            sectionRefs.current[info.refIndex] = el;
          }}
        >
          <Styled.Title>{info.title}</Styled.Title>
          <Styled.DescriptionContainer>
            {info.descriptions.map((desc, idx) => (
              <Styled.DescriptionWrapper key={`${desc.label}-${idx}`}>
                <Styled.LeftText>{desc.label}</Styled.LeftText>
                <Styled.RightText>{desc.render ?? desc.value}</Styled.RightText>
              </Styled.DescriptionWrapper>
            ))}
          </Styled.DescriptionContainer>
        </Styled.InfoBox>
      ))}
    </Styled.InfoBoxWrapper>
  );
};

export default InfoBox;
