import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoEditIcon from '@/assets/images/icons/logo_edit_icon.svg?react';
import RefreshIcon from '@/assets/images/icons/refresh_icon.svg?react';
import defaultProfileImage from '@/assets/images/logos/default_profile_image.svg';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import Header from '@/components/common/Header/Header';
import InputField from '@/components/common/InputField/InputField';
import Spinner from '@/components/common/Spinner/Spinner';
import Toast from '@/components/common/Toast/Toast';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import {
  useStudentProfile,
  useUpdateStudentProfile,
} from '@/hooks/Queries/useStudentProfile';
import useDevice from '@/hooks/useDevice';
import generateNickname from './generateNickname';
import * as Styled from './ProfileSetupPage.styles';

const MAX_NICKNAME_LENGTH = 12;

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDevice();
  const isMobileOrTablet = isMobile || isTablet;

  const [localNickname, setLocalNickname] = useState<string | undefined>(
    undefined,
  );
  const [suggestions, setSuggestions] = useState(() =>
    Array.from({ length: 3 }, generateNickname),
  );
  const [errorToast, setErrorToast] = useState('');

  const { data: profile, isLoading } = useStudentProfile();
  const { mutateAsync: updateProfile, isPending: isSaving } =
    useUpdateStudentProfile();

  const nickname = localNickname ?? profile?.nickname ?? '';

  const handleRegenerate = () => {
    setLocalNickname(generateNickname());
    setSuggestions(Array.from({ length: 3 }, generateNickname));
  };

  const handleSave = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    try {
      await updateProfile(trimmed);
      navigate('/', { replace: true });
    } catch {
      setErrorToast('저장에 실패했어요. 다시 시도해 주세요.');
    }
  };

  if (isLoading) return <Spinner />;

  const profileImageContent = (
    <Styled.ProfileSection>
      <Styled.ProfileImageWrapper>
        <Styled.ProfileImageBox>
          <img src={defaultProfileImage} alt='' />
        </Styled.ProfileImageBox>
        <Styled.ProfileImageEditButton
          type='button'
          aria-label='프로필 사진 수정'
        >
          <LogoEditIcon aria-hidden='true' />
        </Styled.ProfileImageEditButton>
      </Styled.ProfileImageWrapper>
      <Styled.ProfileImageCaption>
        사진은 나중에 올려도 괜찮아요
      </Styled.ProfileImageCaption>
    </Styled.ProfileSection>
  );

  const nicknameContent = (
    <Styled.NicknameSection>
      <Styled.NicknameLabelRow>
        <Styled.NicknameLabel>닉네임</Styled.NicknameLabel>
        <Styled.NicknameCharCount>
          {nickname.length}/{MAX_NICKNAME_LENGTH}
        </Styled.NicknameCharCount>
      </Styled.NicknameLabelRow>
      <Styled.NicknameInputWrapper>
        <InputField
          value={nickname}
          onChange={(e) =>
            setLocalNickname(e.target.value.slice(0, MAX_NICKNAME_LENGTH))
          }
          placeholder='닉네임을 입력하세요'
          ariaLabel='닉네임'
          showClearButton={false}
        />
        <Styled.RegenerateButton
          type='button'
          onClick={handleRegenerate}
          aria-label='닉네임 재생성'
        >
          <RefreshIcon aria-hidden='true' />
          랜덤
        </Styled.RegenerateButton>
      </Styled.NicknameInputWrapper>
      <Styled.HintSection>
        <Styled.HintText>
          랜덤 버튼을 누르면 새 닉네임을 받을 수 있어요
        </Styled.HintText>
        <Styled.HintText>닉네임은 나중에 언제든 바꿀 수 있어요</Styled.HintText>
      </Styled.HintSection>

      <Styled.SuggestionSection>
        <Styled.SuggestionTitle>이런 닉네임은 어때요?</Styled.SuggestionTitle>
        <Styled.SuggestionPillList>
          {suggestions.map((s) => (
            <Styled.SuggestionPill
              key={s}
              type='button'
              onClick={() => setLocalNickname(s)}
            >
              {s}
            </Styled.SuggestionPill>
          ))}
        </Styled.SuggestionPillList>
      </Styled.SuggestionSection>
    </Styled.NicknameSection>
  );

  return (
    <>
      {isMobileOrTablet ? (
        <>
          <WebviewTopBar
            title='프로필 설정'
            onBack={() => navigate('/', { replace: true })}
          />
          <Styled.MobileContainer>
            <Styled.DescriptionSection>
              <Styled.PageTitle>
                <Styled.PageTitleHighlight>모아동</Styled.PageTitleHighlight>에
                오신 걸 환영합니다!
              </Styled.PageTitle>
              <Styled.PageSubtitleGroup>
                <Styled.PageSubtitle>
                  프로필 사진과 닉네임을 설정해보세요!
                </Styled.PageSubtitle>
              </Styled.PageSubtitleGroup>
            </Styled.DescriptionSection>
            {profileImageContent}
            {nicknameContent}
          </Styled.MobileContainer>
          <FixedBottomButtonArea
            onClick={handleSave}
            disabled={!nickname.trim() || isSaving}
          >
            완료
          </FixedBottomButtonArea>
        </>
      ) : (
        <>
          <Header />
          <Styled.DesktopWrapper>
            <Styled.DesktopCard>
              <Styled.DesktopTitle>
                <Styled.PageTitleHighlight>모아동</Styled.PageTitleHighlight>에
                오신 걸 환영합니다!
              </Styled.DesktopTitle>
              <Styled.DesktopSubtitle>
                프로필 사진과 닉네임을 설정해보세요.
              </Styled.DesktopSubtitle>
              {profileImageContent}
              {nicknameContent}
              <Styled.DesktopSaveButton
                onClick={handleSave}
                disabled={!nickname.trim() || isSaving}
              >
                완료
              </Styled.DesktopSaveButton>
            </Styled.DesktopCard>
          </Styled.DesktopWrapper>
        </>
      )}
      <Toast
        isOpen={!!errorToast}
        onClose={() => setErrorToast('')}
        message={errorToast}
      />
    </>
  );
};

export default ProfileSetupPage;
