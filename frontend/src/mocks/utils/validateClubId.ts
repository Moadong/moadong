export const validateClubId = (clubId: string) => {
  if (!clubId) return false;
  return /^[0-9a-fA-F]{24}$/.test(clubId);
};
