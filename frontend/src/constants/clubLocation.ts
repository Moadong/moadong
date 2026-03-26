export interface ClubLocation {
  clubName: string;
  lat: number;
  lng: number;
  building: string;
  detailLocation: string;
}

export const clubLocations = [
  {
    clubName: 'WAP',
    lat: 35.137,
    lng: 129.104,
    building: '가온관',
    detailLocation: '2층 205호',
  },
  {
    clubName: '매니아',
    lat: 36.175,
    lng: 127.975,
    building: '김천관',
    detailLocation: '1층 201호',
  },
] as const;
