export interface GoogleCalendarItem {
  id: string;
  summary: string;
  primary?: boolean;
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
