import { SNS_CONFIG } from '@/constants/snsConfig';
import { SNSPlatform } from '@/types/club';

export const validateSocialLink = (key: SNSPlatform, value: string): string => {
  const { regex, label } = SNS_CONFIG[key];
  if (value && !regex.test(value)) {
    return `${label} 링크 형식이 조금 이상해요. 다시 한 번 확인해주세요!`;
  }
  return '';
};
