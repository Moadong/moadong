import { SNS_CONFIG } from '@/constants/snsConfig';

export interface Club {
  id: string;
  name: string;
  logo: string;
  tags: string[];
  recruitmentStatus: string;
  division: string;
  category: string;
  introduction: string;
}

export type SNSPlatform = keyof typeof SNS_CONFIG;

export interface ClubDetail extends Club {
  description: string;
  state: string;
  feeds: string[];
  presidentName: string;
  presidentPhoneNumber: string;
  recruitmentForm: string;
  recruitmentPeriod: string;
  recruitmentTarget: string;
  socialLinks: Record<SNSPlatform, string>;
  externalApplicationUrl?: string;
  recommendClubs?: Club[]
}

export interface ClubDescription {
  id: string;
  description: string | null;
}

export interface ClubSearchResponse {
  clubs: Club[];
  totalCount: number;
}
