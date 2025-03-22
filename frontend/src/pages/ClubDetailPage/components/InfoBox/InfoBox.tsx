import React from 'react';
import * as Styled from './InfoBox.styles';
import { InfoList } from '@/types/Info';
import { ClubDetail } from '@/types/club';

interface InfoBoxProps {
  sectionRefs: React.RefObject<(HTMLDivElement | null)[]>;
  clubDetail: ClubDetail;
}

const InfoBox = ({ sectionRefs, clubDetail }: InfoBoxProps) => {
  const infoData: InfoList[] = [
    {
      title: '모집정보',
      descriptions: [
        { label: '모집기간', value: clubDetail.recruitmentPeriod },
        { label: '모집대상', value: clubDetail.recruitmentTarget },
      ],
    },
    {
      title: '동아리정보',
      descriptions: [
        { label: '회장이름', value: clubDetail.presidentName },
        { label: '전화번호', value: clubDetail.presidentPhoneNumber },
      ],
    },
  ];

  return (
    <Styled.InfoBoxWrapper>
      {infoData.map((info, index) => (
        <Styled.InfoBox
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}>
          <Styled.Title>{info.title}</Styled.Title>
          <Styled.DescriptionContainer>
            {info.descriptions.map((desc, idx) => (
              <Styled.DescriptionWrapper key={`${desc.label}-${idx}`}>
                <Styled.LeftText>{desc.label}</Styled.LeftText>
                <Styled.RightText>{desc.value}</Styled.RightText>
              </Styled.DescriptionWrapper>
            ))}
          </Styled.DescriptionContainer>
        </Styled.InfoBox>
      ))}
    </Styled.InfoBoxWrapper>
  );
};

export default InfoBox;
