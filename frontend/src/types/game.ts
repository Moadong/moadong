export interface GameRankingEntry {
  rank: number;
  clubName: string;
  clickCount: number;
}

export interface GameRankingResponse {
  clubs: GameRankingEntry[];
  resetAt: string; // ISO 8601
}
