export interface Entry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  tags?: string;
  strict_date: string;
}
