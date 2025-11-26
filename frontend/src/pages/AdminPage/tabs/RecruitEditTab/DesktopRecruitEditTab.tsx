import React from 'react';
import * as Styled from './RecruitEditTab.styles';
import Calendar from './components/Calendar/Calendar';
import Button from '@/components/common/Button/Button';
import InputField from '@/components/common/InputField/InputField';
import MarkdownEditor from './components/MarkdownEditor/MarkdownEditor';
import { ADMIN_EVENT } from '@/constants/eventName';

interface RecruitEditTabProps {
  recruitmentStart: Date | null;
  setRecruitmentStart: (date: Date | null) => void;
  recruitmentEnd: Date | null;
  setRecruitmentEnd: (date: Date | null) => void;
  recruitmentTarget: string;
  setRecruitmentTarget: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  always: boolean;
  toggleAlways: () => void;
  handleUpdateClub: () => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

const DesktopRecruitEditTab = ({
  recruitmentStart,
  setRecruitmentStart,
  recruitmentEnd,
  setRecruitmentEnd,
  recruitmentTarget,
  setRecruitmentTarget,
  description,
  setDescription,
  always,
  toggleAlways,
  handleUpdateClub,
  trackEvent,
}: RecruitEditTabProps) => {
  return (
    <Styled.RecruitEditorContainer>
      <Styled.TitleButtonContainer>
        <Styled.InfoTitle>동아리 모집 정보 수정</Styled.InfoTitle>
        <Button width={'150px'} animated onClick={handleUpdateClub}>
          수정하기
        </Button>
      </Styled.TitleButtonContainer>
      <Styled.InfoGroup>
        <div>
          <Styled.Label>모집 기간 설정</Styled.Label>
          <Styled.RecruitPeriodContainer>
            <Calendar
              recruitmentStart={recruitmentStart}
              recruitmentEnd={recruitmentEnd}
              onChangeStart={setRecruitmentStart}
              onChangeEnd={setRecruitmentEnd}
              disabledEnd={always}
            />
            <Styled.AlwaysRecruitButton
              type='button'
              $active={always}
              onClick={toggleAlways}
              aria-pressed={always}
            >
              상시모집
            </Styled.AlwaysRecruitButton>
          </Styled.RecruitPeriodContainer>
        </div>
        <InputField
          label='모집 대상'
          placeholder='모집 대상을 입력해주세요.'
          type='text'
          value={recruitmentTarget}
          onChange={(e) => setRecruitmentTarget(e.target.value)}
          onClear={() => {
            trackEvent(ADMIN_EVENT.RECRUITMENT_TARGET_CLEAR_BUTTON_CLICKED);
            setRecruitmentTarget('');
          }}
          maxLength={10}
        />

        <div>
          <Styled.Label>소개글 수정</Styled.Label>
          <MarkdownEditor value={description} onChange={setDescription} />
        </div>
      </Styled.InfoGroup>
    </Styled.RecruitEditorContainer>
  );
};

export default DesktopRecruitEditTab;
