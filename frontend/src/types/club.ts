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

export interface ClubDetail extends Club {
  description: string;
  state: string;
  feeds: string[];
  presidentName: string;
  presidentPhoneNumber: string;
  recruitmentForm: string;
  recruitmentPeriod: string;
  recruitmentTarget: string;
}

export interface ClubDescription {
  id: string;
  description: string | null;
}
