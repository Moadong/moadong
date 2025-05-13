import {
  SNS_VALIDATION_REGEX,
  SnsConfig,
  SNSPlatform,
} from '@/constants/snsConfig';

const snsLabelMap: Record<SNSPlatform, string> = SnsConfig.reduce(
  (acc, { key, label }) => {
    acc[key] = label;
    return acc;
  },
  {} as Record<SNSPlatform, string>,
);

export const validateSocialLink = (key: SNSPlatform, value: string): string => {
  const regex = SNS_VALIDATION_REGEX[key];
  if (value && !regex.test(value)) {
    return `${snsLabelMap[key]} 링크 형식이 조금 이상해요. 다시 한 번 확인해주세요!`;
  }
  return '';
};
