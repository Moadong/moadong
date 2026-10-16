import { useNavigate } from 'react-router-dom';
import useDevice from '@/hooks/useDevice';
import ApplicationFormList from '@/pages/AdminPage/components/ApplicationFormList/ApplicationFormList';
import ApplicationListTabMobile from './ApplicationListTabMobile';

const ApplicationListTab = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDevice();

  if (isMobile || isTablet) {
    return <ApplicationListTabMobile />;
  }

  return (
    <ApplicationFormList
      onNavigate={(applicationFormId) =>
        navigate(`/admin/application-list/${applicationFormId}/edit`)
      }
      onEdit={(applicationFormId) =>
        navigate(`/admin/application-list/${applicationFormId}/edit`)
      }
      rowHoverColor='#f2f2f2'
      deleteErrorMessage='지원서 삭제에 실패했습니다.'
      duplicateSuccessMessage='지원서가 성공적으로 복제되었습니다.'
    />
  );
};

export default ApplicationListTab;
