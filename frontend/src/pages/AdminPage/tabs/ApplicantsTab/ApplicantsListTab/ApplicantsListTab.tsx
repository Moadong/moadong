import { useNavigate } from 'react-router-dom';
import ApplicationFormList from '@/pages/AdminPage/components/ApplicationFormList/ApplicationFormList';

const ApplicantsListTab = () => {
  const navigate = useNavigate();

  return (
    <ApplicationFormList
      onEdit={(applicationFormId) =>
        navigate(`/admin/applicants-list/${applicationFormId}`)
      }
      rowHoverColor='#f8f9fa'
      deleteErrorMessage='삭제에 실패했습니다.'
      duplicateConfirmMessage='이 지원서 양식을 복제하시겠습니까?'
    />
  );
};

export default ApplicantsListTab;
