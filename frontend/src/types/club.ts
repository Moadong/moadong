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
  recruitmentForm: string;
}

export interface ClubDescription {
  id: string;
  description: string | null;
}

export interface ImageUploadProps {
  clubId: string;
  onChangeImageList: (image: string) => void;
}

export interface ImagePreviewProps {
  image: string;
  onDelete: () => void;
}
