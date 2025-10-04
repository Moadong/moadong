import * as Styled from './InfoBox.styles';
import { ClubDetail } from '@/types/club';
import { INFOTABS_SCROLL_INDEX } from '@/constants/scrollSections';
import SnsLinkIcons from '@/pages/ClubDetailPage/components/SnsLinkIcons/SnsLinkIcons';
import { parseRecruitmentPeriod } from '@/utils/recruitmentPeriodParser';

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

const FAR_FUTURE_YEAR = 2999;

const InfoBox = ({ sectionRefs, clubDetail }: InfoBoxProps) => {
  const recruitmentPeriodDisplay = (() => {
    const { recruitmentEnd } = parseRecruitmentPeriod(clubDetail.recruitmentPeriod ?? '');
    const isAlways = !!recruitmentEnd && recruitmentEnd.getFullYear() === FAR_FUTURE_YEAR;
    return isAlways ? '상시모집' : clubDetail.recruitmentPeriod;  
  })();
  
  const infoData: ClubInfoSectionWithRef[] = [
    {
      title: '모집정보',
      descriptions: [
        { label: '모집기간', value: recruitmentPeriodDisplay },
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
          render: (
            <SnsLinkIcons
              apiSocialLinks={clubDetail.socialLinks}
              clubName={clubDetail.name}
            />
          ),
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
