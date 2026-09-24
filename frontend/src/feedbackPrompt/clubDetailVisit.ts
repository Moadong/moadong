export interface ClubDetailVisit {
  id: string;
  clubId: string;
  pathname: string;
}
let currentVisit: ClubDetailVisit | null = null;
export const registerClubDetailVisit = (clubId: string, pathname: string) => {
  if (currentVisit?.clubId === clubId && currentVisit.pathname === pathname) return;
  currentVisit = { id: crypto.randomUUID(), clubId, pathname };
};
export const consumeClubDetailVisit = () => {
  const visit = currentVisit;
  currentVisit = null;
  return visit;
};
export const clearClubDetailVisit = () => { currentVisit = null; };
