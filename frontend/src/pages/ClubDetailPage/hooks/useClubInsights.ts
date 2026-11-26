// 동아리 상세의 구조화 정보(한눈에 보기·부원 키워드 등)를 가져오는 훅. API가 생기기 전까지는 목 데이터를 돌려준다
import { clubInsightsMock } from '@/mocks/data/clubInsightsMock';
import { ClubInsights } from '@/types/clubInsights';

const useClubInsights = (clubId?: string): ClubInsights | undefined =>
  clubId ? clubInsightsMock[clubId] : undefined;

export default useClubInsights;
