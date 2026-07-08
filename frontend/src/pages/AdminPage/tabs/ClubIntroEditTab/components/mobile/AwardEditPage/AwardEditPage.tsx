import { useEffect, useMemo, useState } from 'react';
import addIcon from '@/assets/images/icons/add_icon.svg';
import addLargeIcon from '@/assets/images/icons/add_large_icon.svg';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { SCROLL_TO_TOP_HIDDEN_FLAG } from '@/hooks/Scroll/useScrollTrigger';
import AddItemButton from '@/pages/AdminPage/components/AddItemButton/AddItemButton';
import MobileSaveButtonArea from '@/pages/AdminPage/components/MobileSaveButtonArea/MobileSaveButtonArea';
import { Award, SemesterTerm, SemesterTermType } from '@/types/club';
import * as Styled from './AwardEditPage.styles';
import AwardSemesterCard from './AwardSemesterCard';
import SemesterPickerSheet from './SemesterPickerSheet';

interface AwardEditPageProps {
  initialAwards: Award[];
  onSave: (awards: Award[]) => void;
  onSaveToServer: (awards: Award[]) => void;
  onBack: () => void;
}

const getSortValue = (award: Award): number => {
  const termValue = award.semesterTerm === SemesterTerm.FIRST ? 1 : 2;
  return award.year * 10 + termValue;
};

const AwardEditPage = ({
  initialAwards,
  onSave,
  onSaveToServer,
  onBack,
}: AwardEditPageProps) => {
  const [awards, setAwards] = useState<Award[]>(initialAwards);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    document.body.dataset[SCROLL_TO_TOP_HIDDEN_FLAG] = 'true';
    return () => {
      delete document.body.dataset[SCROLL_TO_TOP_HIDDEN_FLAG];
    };
  }, []);

  const isDirty = JSON.stringify(awards) !== JSON.stringify(initialAwards);

  const sortedAwards = useMemo(
    () => [...awards].sort((a, b) => getSortValue(a) - getSortValue(b)),
    [awards],
  );

  const handleAddSemester = (year: number, semesterTerm: SemesterTermType) => {
    setAwards((prev) => [...prev, { year, semesterTerm, achievements: [''] }]);
    setIsPickerOpen(false);
  };

  const handleUpdateAward = (
    year: number,
    semesterTerm: SemesterTermType,
    updated: Award,
  ) => {
    setAwards((prev) =>
      prev.map((a) =>
        a.year === year && a.semesterTerm === semesterTerm ? updated : a,
      ),
    );
  };

  const handleDeleteAward = (year: number, semesterTerm: SemesterTermType) => {
    setAwards((prev) =>
      prev.filter((a) => !(a.year === year && a.semesterTerm === semesterTerm)),
    );
  };

  const handleSave = () => {
    onSave(awards);
    onSaveToServer(awards);
    onBack();
  };

  return (
    <>
      <Styled.Container>
        <WebviewTopBar title='이런 상을 받았어요' onBack={onBack} />
        <Styled.Content>
          <Styled.PageHeader>
            <Styled.PageTitle>
              수상 내역으로 동아리의 강점을 보여주세요
            </Styled.PageTitle>
            <Styled.PageSubtitle>
              등록하면 지원자들이 볼 수 있어요
            </Styled.PageSubtitle>
          </Styled.PageHeader>

          {awards.length === 0 ? (
            <Styled.EmptyCard>
              <Styled.EmptyText>등록된 수상내역이 없습니다</Styled.EmptyText>
              <AddItemButton onClick={() => setIsPickerOpen(true)}>
                <img src={addIcon} alt='' width={16} height={16} />
                <span>학기 추가</span>
              </AddItemButton>
            </Styled.EmptyCard>
          ) : (
            <Styled.AwardList>
              {sortedAwards.map((award) => (
                <AwardSemesterCard
                  key={`${award.year}-${award.semesterTerm}`}
                  award={award}
                  onChange={(updated) =>
                    handleUpdateAward(award.year, award.semesterTerm, updated)
                  }
                  onDelete={() =>
                    handleDeleteAward(award.year, award.semesterTerm)
                  }
                />
              ))}
            </Styled.AwardList>
          )}
        </Styled.Content>
      </Styled.Container>

      <Styled.SemesterAddButton
        type='button'
        onClick={() => setIsPickerOpen(true)}
        aria-label='학기 추가'
      >
        <img src={addLargeIcon} alt='' width={20} height={20} />
      </Styled.SemesterAddButton>

      <MobileSaveButtonArea onClick={handleSave} disabled={!isDirty} />

      {isPickerOpen && (
        <SemesterPickerSheet
          existingAwards={awards}
          onAdd={handleAddSemester}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </>
  );
};

export default AwardEditPage;
