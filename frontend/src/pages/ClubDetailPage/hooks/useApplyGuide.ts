// 동아리가 실제로 어떻게 지원을 받는지(모아동 지원서·외부 폼·여러 지원서·직접 연락)와 지원서 내용을 지원서 설정에서 읽어오는 훅
import { useQuery } from '@tanstack/react-query';
import { getApplication, getApplicationOptions } from '@/apis/application';
import { getShowcaseApplyGuide } from '@/mocks/showcaseOverride';
import { ApplicationFormData, ApplicationFormMode } from '@/types/application';

export type ApplyMethod =
  | { kind: 'MOADONG' }
  | { kind: 'EXTERNAL'; platform: string }
  | { kind: 'MULTIPLE'; count: number }
  | { kind: 'CONTACT' };

export interface ApplyGuideData {
  method: ApplyMethod;
  /** 열려 있는 지원서들의 내용 (공고 글·질문). 외부 폼은 질문을 알 수 없다 */
  forms: ApplicationFormData[];
}

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

const isExternal = (form?: ApplicationFormData) =>
  form?.formMode === ApplicationFormMode.EXTERNAL &&
  !!form.externalApplicationUrl?.trim();

const fetchApplyGuide = async (clubId: string): Promise<ApplyGuideData> => {
  const options = await getApplicationOptions(clubId);
  if (options.length === 0) return { method: { kind: 'CONTACT' }, forms: [] };

  const forms = (
    await Promise.all(
      options.map((option) => getApplication(clubId, option.id)),
    )
  ).filter((form): form is ApplicationFormData => !!form);

  if (options.length > 1) {
    return { method: { kind: 'MULTIPLE', count: options.length }, forms };
  }

  const [form] = forms;
  if (isExternal(form)) {
    return {
      method: {
        kind: 'EXTERNAL',
        platform: getExternalPlatform(form.externalApplicationUrl as string),
      },
      forms,
    };
  }
  return { method: { kind: 'MOADONG' }, forms };
};

const useApplyGuide = (clubId?: string) =>
  useQuery({
    queryKey: ['club', 'applyGuide', clubId],
    // 시안 공유용 두 동아리는 개발 서버에 지원서가 없어 실제 서버 기준 값을 쓴다
    queryFn: () =>
      getShowcaseApplyGuide(clubId) ?? fetchApplyGuide(clubId as string),
    enabled: !!clubId,
    staleTime: 5 * 60 * 1000,
  });

export default useApplyGuide;
