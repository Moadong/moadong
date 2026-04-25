import { CalendarId } from './branded';

export interface GoogleCalendarItem {
  id: CalendarId;
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

export interface GoogleCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  url?: string;
  description?: string;
  source: 'GOOGLE';
}
