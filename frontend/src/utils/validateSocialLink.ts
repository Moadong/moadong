import { SNS_CONFIG, SNSPlatform } from '@/constants/snsConfig';

export const validateSocialLink = (key: SNSPlatform, value: string): string => {
  const { regex, label } = SNS_CONFIG[key];
  if (value && !regex.test(value)) {
    return `${label} 링크 형식이 조금 이상해요. 다시 한 번 확인해주세요!`;
  }
  return '';
};
