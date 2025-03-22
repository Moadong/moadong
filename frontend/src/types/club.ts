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
  state: string;
  feeds: string[];
  description: string;
  presidentName: string;
  presidentPhoneNumber: string;
  recruitmentPeriod: string;
  recruitmentTarget: string;
}

export interface ClubDescription {
  clubId: string;
  description: string | null;
}
