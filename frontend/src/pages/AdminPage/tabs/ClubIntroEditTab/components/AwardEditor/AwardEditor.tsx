import { useEffect, useRef, useState } from 'react';
import deleteButton from '@/assets/images/icons/delete_button_icon.svg';
import selectIcon from '@/assets/images/icons/selectArrow.svg';
import { CustomDropDown } from '@/components/common/CustomDropDown/CustomDropDown';
import { Award, SemesterTerm, SemesterTermType } from '@/types/club';
import * as Styled from './AwardEditor.styles';

interface AwardEditorProps {
  awards: Award[];
  onChange: (awards: Award[]) => void;
}

const START_YEAR = 2020;

const getSemesterSortValue = (award: Award): number => {
  const semesterValue = award.semester === SemesterTerm.FIRST ? 1 : 2;
  return award.year * 10 + semesterValue;
};

const formatSemesterLabel = (award: Award): string => {
  const semesterLabel = award.semester === SemesterTerm.FIRST ? '1학기' : '2학기';
  return `${award.year} ${semesterLabel}`;
};

const generateYearOptions = (currentYear: number) => {
  const years = Array.from(
    { length: currentYear - START_YEAR + 2 },
    (_, yearIndex) => START_YEAR + yearIndex,
  );
  return years.map((year) => ({
    value: year.toString(),
    label: `${year}년`,
  }));
};

const SEMESTER_OPTIONS = [
  { value: SemesterTerm.FIRST, label: '1학기' },
  { value: SemesterTerm.SECOND, label: '2학기' },
] as const;

const AwardEditor = ({ awards, onChange }: AwardEditorProps) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedSemester, setSelectedSemester] =
    useState<SemesterTermType>(SemesterTerm.FIRST);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const yearOptions = generateYearOptions(currentYear);

  const sortedAwards = [...awards].sort(
    (awardA, awardB) =>
      getSemesterSortValue(awardB) - getSemesterSortValue(awardA),
  );

  const getAwardKey = (award: Award): string =>
    `${award.year}-${award.semester}`;

  const handleAddSemester = () => {
    const year = parseInt(selectedYear, 10);

    const isDuplicate = awards.some(
      (award) => award.year === year && award.semester === selectedSemester,
    );
    if (isDuplicate) {
      alert('이미 추가된 학기입니다.');
      return;
    }

    const newAward: Award = {
      year,
      semester: selectedSemester,
      achievements: [''],
    };

    onChange([...awards, newAward]);
    setLastAddedKey(getAwardKey(newAward));
  };

  const handleRemoveSemester = (semesterIndex: number) => {
    onChange(awards.filter((_, index) => index !== semesterIndex));
  };

  const handleAddAchievement = (semesterIndex: number) => {
    const updatedAwards = awards.map((award, index) =>
      index === semesterIndex
        ? { ...award, achievements: [...award.achievements, ''] }
        : award,
    );
    onChange(updatedAwards);
    setLastAddedKey(getAwardKey(awards[semesterIndex]));
  };

  const handleRemoveAchievement = (
    semesterIndex: number,
    achievementIndex: number,
  ) => {
    const updatedAwards = awards.map((award, index) =>
      index === semesterIndex
        ? {
            ...award,
            achievements: award.achievements.filter(
              (_, achvIndex) => achvIndex !== achievementIndex,
            ),
          }
        : award,
    );
    onChange(updatedAwards);
  };

  const handleUpdateAchievement = (
    semesterIndex: number,
    achievementIndex: number,
    value: string,
  ) => {
    const updatedAwards = awards.map((award, index) =>
      index === semesterIndex
        ? {
            ...award,
            achievements: award.achievements.map((achievement, achvIndex) =>
              achvIndex === achievementIndex ? value : achievement,
            ),
          }
        : award,
    );
    onChange(updatedAwards);
  };

  useEffect(() => {
    if (lastAddedKey) {
      const award = awards.find((award) => getAwardKey(award) === lastAddedKey);
      if (award) {
        const lastIndex = award.achievements.length - 1;
        const key = `${lastAddedKey}-${lastIndex}`;
        const inputRef = inputRefs.current[key];
        if (inputRef) {
          inputRef.focus();
        }
      }
      setLastAddedKey(null);
    }
  }, [awards, lastAddedKey]);

  return (
    <Styled.Container>
      <Styled.Label>이런 상을 받았어요</Styled.Label>

      <Styled.AddSemesterSection>
        <CustomDropDown
          options={yearOptions}
          selected={selectedYear}
          onSelect={setSelectedYear}
          open={isYearDropdownOpen}
          onToggle={(isOpen) => setIsYearDropdownOpen(!isOpen)}
          style={{ width: '120px' }}
        >
          <CustomDropDown.Trigger>
            <Styled.DropdownTrigger>
              <span>
                {
                  yearOptions.find((option) => option.value === selectedYear)
                    ?.label
                }
              </span>
              <img src={selectIcon} alt='선택' />
            </Styled.DropdownTrigger>
          </CustomDropDown.Trigger>
          <CustomDropDown.Menu>
            {yearOptions.map((option) => (
              <CustomDropDown.Item key={option.value} value={option.value}>
                {option.label}
              </CustomDropDown.Item>
            ))}
          </CustomDropDown.Menu>
        </CustomDropDown>

        <CustomDropDown
          options={SEMESTER_OPTIONS}
          selected={selectedSemester}
          onSelect={(value) => setSelectedSemester(value as SemesterTermType)}
          open={isSemesterDropdownOpen}
          onToggle={(isOpen) => setIsSemesterDropdownOpen(!isOpen)}
          style={{ width: '100px' }}
        >
          <CustomDropDown.Trigger>
            <Styled.DropdownTrigger>
              <span>
                {
                  SEMESTER_OPTIONS.find(
                    (option) => option.value === selectedSemester,
                  )?.label
                }
              </span>
              <img src={selectIcon} alt='선택' />
            </Styled.DropdownTrigger>
          </CustomDropDown.Trigger>
          <CustomDropDown.Menu>
            {SEMESTER_OPTIONS.map((option) => (
              <CustomDropDown.Item key={option.value} value={option.value}>
                {option.label}
              </CustomDropDown.Item>
            ))}
          </CustomDropDown.Menu>
        </CustomDropDown>

        <Styled.AddButton onClick={handleAddSemester}>
          학기 추가
        </Styled.AddButton>
      </Styled.AddSemesterSection>

      <Styled.AwardsList>
        {sortedAwards.map((award) => {
          const awardKey = getAwardKey(award);
          const originalIndex = awards.findIndex(
            (originalAward) => getAwardKey(originalAward) === awardKey,
          );
          return (
            <Styled.AwardItem key={awardKey}>
              <Styled.SemesterHeader>
                <Styled.SemesterTitle>
                  {formatSemesterLabel(award)}
                </Styled.SemesterTitle>
                <Styled.RemoveButton
                  onClick={() => handleRemoveSemester(originalIndex)}
                >
                  <img src={deleteButton} alt='삭제' />
                </Styled.RemoveButton>
              </Styled.SemesterHeader>

              <Styled.AchievementsList>
                {award.achievements.map((achievement, achievementIndex) => (
                  <Styled.AchievementItem key={achievementIndex}>
                    <Styled.AchievementInput
                      ref={(element) => {
                        const key = `${awardKey}-${achievementIndex}`;
                        inputRefs.current[key] = element;
                      }}
                      placeholder='수상 내역을 입력하세요'
                      value={achievement}
                      onChange={(event) =>
                        handleUpdateAchievement(
                          originalIndex,
                          achievementIndex,
                          event.target.value,
                        )
                      }
                    />
                    {award.achievements.length > 1 && (
                      <Styled.AchievementRemoveButton
                        onClick={() =>
                          handleRemoveAchievement(
                            originalIndex,
                            achievementIndex,
                          )
                        }
                      >
                        <img src={deleteButton} alt='삭제' />
                      </Styled.AchievementRemoveButton>
                    )}
                  </Styled.AchievementItem>
                ))}
              </Styled.AchievementsList>

              <Styled.AddAchievementButton
                onClick={() => handleAddAchievement(originalIndex)}
              >
                + 수상 내역 추가
              </Styled.AddAchievementButton>
            </Styled.AwardItem>
          );
        })}
      </Styled.AwardsList>
    </Styled.Container>
  );
};

export default AwardEditor;
