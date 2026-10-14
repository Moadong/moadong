import { Applicant } from '@/types/applicants';
import { Question } from '@/types/application';
import mapStatusToGroup from '@/utils/mapStatusToGroup';

const escapeCsvCell = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const exportApplicantsToCSV = (
  applicants: Applicant[],
  questions: Question[],
  filename: string,
) => {
  const headers = [
    '제출일시',
    '상태',
    ...questions.map((q) => q.title),
    '메모',
  ];

  const rows = applicants.map((applicant) => {
    const date = new Date(applicant.createdAt);
    const createdAt = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    const status = mapStatusToGroup(applicant.status).label;

    const answerMap = new Map(applicant.answers.map((a) => [a.id, a.value]));
    const answerCells = questions.map((q) => answerMap.get(q.id) ?? '');

    return [createdAt, status, ...answerCells, applicant.memo];
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');

  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
