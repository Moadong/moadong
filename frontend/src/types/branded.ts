declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

export type Branded<T, B> = T & Brand<B>;

export type ClubId = Branded<string, 'ClubId'>;
export type ApplicationFormId = Branded<string, 'ApplicationFormId'>;
export type ApplicantId = Branded<string, 'ApplicantId'>;
export type CalendarId = Branded<string, 'CalendarId'>;
export type DatabaseId = Branded<string, 'DatabaseId'>;
