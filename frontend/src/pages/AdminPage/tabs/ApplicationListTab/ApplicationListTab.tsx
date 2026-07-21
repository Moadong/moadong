import { useNavigate } from 'react-router-dom';
import ApplicationFormList from '@/pages/AdminPage/components/ApplicationFormList/ApplicationFormList';

const ApplicationListTab = () => {
  const navigate = useNavigate();

  return (
    <ApplicationFormList
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
