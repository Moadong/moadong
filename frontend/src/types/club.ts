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
  clubPresidentName: string;
  telephoneNumber: string;
  recruitmentPeriod: string;
  recruitmentTarget: string;
}
