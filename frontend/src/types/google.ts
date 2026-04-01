export interface GoogleCalendarItem {
  id: string;
  summary: string;
  primary?: boolean;
}

export interface GoogleCalendarListResponse {
  items: GoogleCalendarItem[];
  selectedCalendarId?: string;
  selectedCalendarName?: string;
}

export interface GoogleEventItem {
  id: string;
  summary?: string;
  htmlLink?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
}
