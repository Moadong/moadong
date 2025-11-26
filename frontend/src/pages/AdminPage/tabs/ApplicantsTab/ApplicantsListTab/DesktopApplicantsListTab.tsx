import React from 'react';
import * as Styled from './ApplicantsListTab.styles';
import Plus from '@/assets/images/icons/Plus.svg';
import Morebutton from '@/assets/images/icons/Morebutton.svg';
import ApplicationMenu from '../../ApplicationListTab/ApplicationMenu';
import { ApplicationFormItem, SemesterGroup } from '@/types/application';

interface ApplicantsListTabProps {
  semesterGroups: SemesterGroup[];
  handleGoToNewForm: () => void;
  handleGoToDetailForm: (id: string) => void;
  openMenuId: string | null;
  handleMoreButtonClick: (e: React.MouseEvent, id: string) => void;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  formatDateTime: (dateTimeString: string) => string;
}

const DesktopApplicantsListTab = ({
  semesterGroups,
  handleGoToNewForm,
  handleGoToDetailForm,
  openMenuId,
  handleMoreButtonClick,
  menuRef,
  formatDateTime,
}: ApplicantsListTabProps) => {
  return (
    <Styled.Container>
      <Styled.Title>지원서 목록</Styled.Title>
      <Styled.Header>
        <Styled.AddButton onClick={handleGoToNewForm}>
          새 양식 만들기 <Styled.PlusIcon src={Plus} />{' '}
        </Styled.AddButton>
      </Styled.Header>
      {semesterGroups.map((group: SemesterGroup) => {
        const semesterTermLabel =
          group.semesterTerm === 'FIRST' ? '1학기' : '2학기';
        const semesterTitle = `${group.semesterYear}년 ${semesterTermLabel}`;
        return (
          <Styled.ApplicationList key={semesterTitle}>
            <Styled.ListHeader>
              <Styled.SemesterTitle>{semesterTitle}</Styled.SemesterTitle>
              <Styled.DateHeader>
                <Styled.Separation_Bar />
                최종 수정 날짜
              </Styled.DateHeader>
            </Styled.ListHeader>
            {group.forms.map((application: ApplicationFormItem) => {
              const isActive = application.status === 'ACTIVE';
              return (
                <Styled.ApplicationRow key={application.id}>
                  <Styled.ApplicationTitle
                    $active={isActive}
                    onClick={() => handleGoToDetailForm(application.id)}
                  >
                    {application.title}
                  </Styled.ApplicationTitle>
                  <Styled.ApplicationDatetable>
                    <Styled.ApplicationDate>
                      {formatDateTime(application.editedAt)}
                    </Styled.ApplicationDate>
                    <Styled.MoreButtonContainer
                      ref={openMenuId === application.id ? menuRef : null}
                    >
                      <Styled.MoreButton
                        onClick={(e) =>
                          handleMoreButtonClick(e, application.id)
                        }
                      >
                        <Styled.MoreButtonIcon src={Morebutton} />
                      </Styled.MoreButton>
                      {openMenuId === application.id && (
                        <ApplicationMenu
                          isActive={isActive}
                          // onDelete={() => handleDeleteApplication(application.id)}
                        />
                      )}
                    </Styled.MoreButtonContainer>
                  </Styled.ApplicationDatetable>
                </Styled.ApplicationRow>
              );
            })}
          </Styled.ApplicationList>
        );
      })}
    </Styled.Container>
  );
};

export default DesktopApplicantsListTab;
