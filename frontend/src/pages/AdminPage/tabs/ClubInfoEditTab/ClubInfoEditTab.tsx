import React, { useState, useEffect } from 'react';
import InputField from '@/components/common/InputField/InputField';
import SelectTags from '@/pages/AdminPage/components/SelectTags/SelectTags';
import MakeTags from '@/pages/AdminPage/components/MakeTags/MakeTags';
import * as Styled from './ClubInfoEditTab.styles';

const ClubInfoEditTab = () => {
  //TODO: 추후 API 연동 시, 기존 정보 불러와서 초기화
  const [clubName, setClubName] = useState('');
  const [clubPresidentName, setClubPresidentName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [selectedClassification, setSelectedClassification] =
    useState<string>('중등');
  const [selectedDivision, setSelectedDivision] = useState<string>('학술');
  const [clubTags, setClubTags] = useState<string[]>(() => ['', '']);

  const categories = ['중등', '과동'];
  const tags = ['봉사', '종교', '취미교양', '학술', '운동', '공연'];

  useEffect(() => {
    if (clubTags.length < 2) {
      setClubTags((prevTags) => [...prevTags, ''].slice(0, 2));
    }
  }, [clubTags]);

  return (
    <>
      <Styled.InfoTitle>동아리 정보 수정</Styled.InfoTitle>
      <Styled.InfoGroup>
        <InputField
          label='동아리 명'
          placeholder='동아리 명을 입력해주세요'
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          onClear={() => setClubName('')}
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
            onClear={() => setClubPresidentName('')}
            maxLength={5}
          />

          <InputField
            label=''
            placeholder='전화번호를 입력해주세요'
            type='text'
            maxLength={13}
            value={telephoneNumber}
            onChange={(e) => setTelephoneNumber(e.target.value)}
            onClear={() => setTelephoneNumber('')}
          />
        </Styled.PresidentContainer>
      </Styled.InfoGroup>

      <Styled.InfoTitle>동아리 태그 수정</Styled.InfoTitle>
      <Styled.TagEditGroup>
        <InputField
          label='한줄소개'
          placeholder='한줄소개를 입력해주세요'
          type='text'
          maxLength={40}
          showMaxChar={true}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          onClear={() => setIntroduction('')}
        />

        <SelectTags
          label='분류'
          tags={categories}
          selected={selectedClassification}
          onChange={setSelectedClassification}
        />

        <SelectTags
          label='분과'
          tags={tags}
          selected={selectedDivision}
          onChange={setSelectedDivision}
        />

        <MakeTags value={clubTags} onChange={setClubTags} />
      </Styled.TagEditGroup>
    </>
  );
};

export default ClubInfoEditTab;
