import { SNS_CONFIG } from '@/constants/snsConfig';

export interface Club {
  id: string;
  name: string;
  logo: string;
  cover?: string;
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
  recruitmentStart: string | null;
  recruitmentEnd: string | null;
  recruitmentTarget: string;
  socialLinks: Record<SNSPlatform, string>;
  externalApplicationUrl?: string;
}

export interface ClubDescription {
  id: string;
  recruitmentStart: string | null;
  recruitmentEnd: string | null;
  recruitmentTarget: string;
}

export interface Award {
  semester: string;
  achievements: string[];
}

export interface IdealCandidate {
  tags: string[];
  content: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface DetailedDescription {
  introDescription: string;
  activityDescription: string;
  awards: Award[];
  idealCandidate: IdealCandidate;
  benefits: string;
  faqs: FAQ[];
}

export interface ClubApiResponse {
  id: string;
  name: string;
  logo: string;
  cover: string;
  tags: string[];
  state: string;
  introduction: string;
  description: DetailedDescription;
  recruitmentPeriod: string;
  recruitmentStatus: string;
  externalApplicationUrl: string;
  socialLinks: Record<SNSPlatform, string>;
  category: string;
  division: string;
}
