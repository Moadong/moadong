export interface NotionSearchItem {
  id: string;
  object: string;
  url?: string;
  last_edited_time?: string;
  properties?: Record<string, unknown>;
}

export interface NotionDatabaseOption {
  id: string;
  title: string;
}

export interface NotionPagesResponse {
  items: NotionSearchItem[];
  totalResults: number;
  databaseId?: string;
}
