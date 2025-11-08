import type { Club } from './club';

export interface ClubSearchResponse {
    clubs: Club[];
    totalCount: number;
}