import { useState } from 'react';
import { changePassword } from '@/apis/auth/changePassword';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/useTrackPageView';
import useIsMobileView from '@/hooks/useIsMobileView';
import DesktopAccountEditTab from './DesktopAccountEditTab';
import MobileAccountEditTab from './MobileAccountEditTab';

const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^])(?!.*\s).{8,20}$/;

const AccountEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.ADMIN_ACCOUNT_EDIT_PAGE);
  const isMobile = useIsMobileView();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 1. 로딩 상태 추가

  const isPasswordValid =
    newPassword.length > 0 && !PASSWORD_REGEX.test(newPassword);

  const isPasswordMatching =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleChangePassword = async () => {
    if (isLoading) return;

    setSuccessMessage('');

    if (!newPassword || !confirmPassword) {
      alert('새 비밀번호와 확인 필드를 모두 입력해주세요.');
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      alert(
        '비밀번호가 정책에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~20자)',
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({ password: newPassword });

      trackEvent(ADMIN_EVENT.PASSWORD_CHANGE_BUTTON_CLICKED, {
        newPasswordLength: newPassword.length,
        confirmPasswordLength: confirmPassword.length,
      });

      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const props = {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    successMessage,
    isLoading,
    isPasswordValid,
    isPasswordMatching,
    handleChangePassword,
    trackEvent,
  };

  return isMobile ? (
    <MobileAccountEditTab {...props} />
  ) : (
    <DesktopAccountEditTab {...props} />
  );
};

export default AccountEditTab;
