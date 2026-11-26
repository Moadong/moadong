// 동아리가 실제로 어떻게 지원을 받는지(모아동 지원서·외부 폼·여러 지원서·직접 연락)를 지원서 설정에서 읽어오는 훅
import { useQuery } from '@tanstack/react-query';
import { getApplication, getApplicationOptions } from '@/apis/application';
import { ApplicationFormMode } from '@/types/application';

export type ApplyMethod =
  | { kind: 'MOADONG' }
  | { kind: 'EXTERNAL'; platform: string }
  | { kind: 'MULTIPLE'; count: number }
  | { kind: 'CONTACT' };

const PLATFORM_BY_HOST: { match: RegExp; label: string }[] = [
  { match: /(^|\.)form\.naver\.com$|(^|\.)naver\.me$/, label: '네이버 폼' },
  { match: /(^|\.)forms\.gle$|(^|\.)docs\.google\.com$/, label: '구글 폼' },
  { match: /(^|\.)everytime\.kr$/, label: '에브리타임' },
];

export const getExternalPlatform = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return (
      PLATFORM_BY_HOST.find(({ match }) => match.test(hostname))?.label ??
      '외부 지원서'
    );
  } catch {
    return '외부 지원서';
  }
};

const fetchApplyMethod = async (clubId: string): Promise<ApplyMethod> => {
  const forms = await getApplicationOptions(clubId);
  if (forms.length === 0) return { kind: 'CONTACT' };
  if (forms.length > 1) return { kind: 'MULTIPLE', count: forms.length };

  const form = await getApplication(clubId, forms[0].id);
  const externalUrl = form?.externalApplicationUrl?.trim();
  if (form?.formMode === ApplicationFormMode.EXTERNAL && externalUrl) {
    return { kind: 'EXTERNAL', platform: getExternalPlatform(externalUrl) };
  }
  return { kind: 'MOADONG' };
};

const useApplyMethod = (clubId?: string) =>
  useQuery({
    queryKey: ['club', 'applyMethod', clubId],
    queryFn: () => fetchApplyMethod(clubId as string),
    enabled: !!clubId,
    staleTime: 5 * 60 * 1000,
  });

export default useApplyMethod;
