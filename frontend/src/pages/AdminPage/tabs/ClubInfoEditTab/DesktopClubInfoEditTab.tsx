import React from 'react';
import * as Styled from './ClubInfoEditTab.styles';
import Button from '@/components/common/Button/Button';
import InputField from '@/components/common/InputField/InputField';
import SelectTags from './components/SelectTags/SelectTags';
import MakeTags from './components/MakeTags/MakeTags';
import { SNS_CONFIG } from '@/constants/snsConfig';
import { SNSPlatform } from '@/types/club';
import { ADMIN_EVENT } from '@/constants/eventName';

interface ClubInfoEditTabProps {
  clubName: string;
  setClubName: (value: string) => void;
  clubPresidentName: string;
  setClubPresidentName: (value: string) => void;
  telephoneNumber: string;
  setTelephoneNumber: (value: string) => void;
  introduction: string;
  setIntroduction: (value: string) => void;
  selectedDivision: string;
  setSelectedDivision: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  clubTags: string[];
  setClubTags: (value: string[]) => void;
  socialLinks: Record<SNSPlatform, string>;
  handleSocialLinkChange: (key: SNSPlatform, value: string) => void;
  setSocialLinks: React.Dispatch<
    React.SetStateAction<Record<SNSPlatform, string>>
  >;
  snsErrors: Record<SNSPlatform, string>;
  setSnsErrors: React.Dispatch<
    React.SetStateAction<Record<SNSPlatform, string>>
  >;
  handleUpdateClub: () => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  divisions: string[];
  categories: string[];
}

const DesktopClubInfoEditTab = ({
  clubName,
  setClubName,
  clubPresidentName,
  setClubPresidentName,
  telephoneNumber,
  setTelephoneNumber,
  introduction,
  setIntroduction,
  selectedDivision,
  setSelectedDivision,
  selectedCategory,
  setSelectedCategory,
  clubTags,
  setClubTags,
  socialLinks,
  handleSocialLinkChange,
  setSocialLinks,
  snsErrors,
  setSnsErrors,
  handleUpdateClub,
  trackEvent,
  divisions,
  categories,
}: ClubInfoEditTabProps) => {
  return (
    <>
      <Styled.TitleButtonContainer>
        <Styled.InfoTitle>동아리 기본 정보 수정</Styled.InfoTitle>
        <Button width={'150px'} animated onClick={handleUpdateClub}>
          수정하기
        </Button>
      </Styled.TitleButtonContainer>

      <Styled.InfoGroup>
        <InputField
          label='동아리 명'
          placeholder='동아리 명을 입력해주세요'
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          onClear={() => {
            trackEvent(ADMIN_EVENT.CLUB_NAME_CLEAR_BUTTON_CLICKED);
            setClubName('');
          }}
          width='40%'
          maxLength={10}
          showMaxChar={true}
        />

        <Styled.PresidentContainer>
          <InputField
            label='회장 정보'
            placeholder='동아리 대표의 이름을 입력해주세요'
            type='text'
            value={clubPresidentName}
            onChange={(e) => setClubPresidentName(e.target.value)}
            onClear={() => {
              trackEvent(ADMIN_EVENT.CLUB_PRESIDENT_CLEAR_BUTTON_CLICKED);
              setClubPresidentName('');
            }}
            maxLength={5}
          />

          <InputField
            label=''
            placeholder='전화번호를 입력해주세요'
            type='text'
            maxLength={13}
            value={telephoneNumber}
            onChange={(e) => setTelephoneNumber(e.target.value)}
            onClear={() => {
              trackEvent(ADMIN_EVENT.TELEPHONE_NUMBER_CLEAR_BUTTON_CLICKED);
              setTelephoneNumber('');
            }}
          />
        </Styled.PresidentContainer>
      </Styled.InfoGroup>

      <Styled.InfoTitle>동아리 태그 수정</Styled.InfoTitle>
      <Styled.TagEditGroup>
        <InputField
          label='한줄소개'
          placeholder='한줄소개를 입력해주세요'
          type='text'
          maxLength={20}
          showMaxChar={true}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          onClear={() => {
            trackEvent(ADMIN_EVENT.CLUB_INTRODUCTION_CLEAR_BUTTON_CLICKED);
            setIntroduction('');
          }}
        />

        <SelectTags
          label='분류'
          tags={divisions}
          selected={selectedDivision}
          onChange={setSelectedDivision}
        />

        <SelectTags
          label='분과'
          tags={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        <MakeTags value={clubTags} onChange={setClubTags} />
      </Styled.TagEditGroup>

      <Styled.InfoTitle>동아리 SNS 링크</Styled.InfoTitle>
      <Styled.SNSInputGroup>
        {Object.entries(SNS_CONFIG).map(([rawKey, { label, placeholder }]) => {
          const key = rawKey as SNSPlatform;

          return (
            <Styled.SNSRow key={key}>
              <Styled.SNSCheckboxLabel>{label}</Styled.SNSCheckboxLabel>
              <InputField
                placeholder={placeholder}
                value={socialLinks[key]}
                onChange={(e) => handleSocialLinkChange(key, e.target.value)}
                onClear={() => {
                  trackEvent(ADMIN_EVENT.CLUB_SNS_LINK_CLEAR_BUTTON_CLICKED, {
                    snsPlatform: label,
                  });
                  setSocialLinks((prev) => ({ ...prev, [key]: '' }));
                  setSnsErrors((prev) => ({ ...prev, [key]: '' }));
                }}
                isError={snsErrors[key] !== ''}
                helperText={snsErrors[key]}
              />
            </Styled.SNSRow>
          );
        })}
      </Styled.SNSInputGroup>
    </>
  );
};

export default DesktopClubInfoEditTab;
