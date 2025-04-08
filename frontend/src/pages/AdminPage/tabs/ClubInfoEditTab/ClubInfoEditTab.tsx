import React, { useState, useEffect } from 'react';
import * as Styled from './ClubInfoEditTab.styles';
import InputField from '@/components/common/InputField/InputField';
import SelectTags from '@/pages/AdminPage/components/SelectTags/SelectTags';
import MakeTags from '@/pages/AdminPage/components/MakeTags/MakeTags';
import Button from '@/components/common/Button/Button';
import { useOutletContext } from 'react-router-dom';
import { ClubDetail } from '@/types/club';
import { useUpdateClubDetail } from '@/hooks/queries/club/useUpdateClubDetail';
import { useQueryClient } from '@tanstack/react-query';

const ClubInfoEditTab = () => {
  const clubDetail = useOutletContext<ClubDetail | null>();
  const { mutate: updateClub } = useUpdateClubDetail();

  const [clubName, setClubName] = useState('');
  const [clubPresidentName, setClubPresidentName] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [clubTags, setClubTags] = useState<string[]>(() => ['', '']);
  const [recruitmentForm] = useState<string>('');
  const queryClient = useQueryClient();
  const divisions = ['중동', '과동'];
  const categories = ['봉사', '종교', '취미교양', '학술', '운동', '공연'];

  useEffect(() => {
    if (clubDetail) {
      setClubName(clubDetail.name);
      setClubPresidentName(clubDetail.presidentName);
      setTelephoneNumber(clubDetail.presidentPhoneNumber);
      setIntroduction(clubDetail.introduction);
      setSelectedDivision(clubDetail.division);
      setSelectedCategory(clubDetail.category);
      setClubTags(
        clubDetail.tags.length >= 2
          ? clubDetail.tags
          : [...clubDetail.tags, ''],
      );
    }
  }, [clubDetail]);

  const handleUpdateClub = () => {
    if (!clubDetail || !clubDetail.id) {
      alert('클럽 정보가 로드되지 않았습니다.');
      console.error(
        '[ERROR] clubDetail or clubDetail.id is undefined:',
        clubDetail,
      );
      return;
    }

    const updatedData = {
      id: clubDetail.id,
      name: clubName,
      category: selectedCategory,
      division: selectedDivision,
      tags: clubTags,
      introduction: introduction,
      presidentName: clubPresidentName,
      presidentPhoneNumber: telephoneNumber,
      recruitmentForm: recruitmentForm,
    };

    updateClub(updatedData, {
      onSuccess: () => {
        alert('동아리 정보가 성공적으로 수정되었습니다.');
        queryClient.invalidateQueries({
          queryKey: ['clubDetail', clubDetail.id],
        });
      },
      onError: (error) => {
        alert(`동아리 정보 수정에 실패했습니다: ${error.message}`);
      },
    });
  };

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
          maxLength={20}
          showMaxChar={true}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          onClear={() => setIntroduction('')}
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
    </>
  );
};

export default ClubInfoEditTab;
