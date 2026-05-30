declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

export type Branded<T, B> = T & Brand<B>;

export type ClubId = Branded<string, 'ClubId'>;
export type ApplicationFormId = Branded<string, 'ApplicationFormId'>;
export type ApplicantId = Branded<string, 'ApplicantId'>;
export type CalendarId = Branded<string, 'CalendarId'>;
export type DatabaseId = Branded<string, 'DatabaseId'>;

export const asClubId = (id: string): ClubId => id as ClubId;
export const asApplicationFormId = (id: string): ApplicationFormId =>
  id as ApplicationFormId;
export const asApplicantId = (id: string): ApplicantId => id as ApplicantId;
export const asCalendarId = (id: string): CalendarId => id as CalendarId;
export const asDatabaseId = (id: string): DatabaseId => id as DatabaseId;
