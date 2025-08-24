export interface Workshop {
  id?: number;           // optional for new items
  title: string;
  description: string;
  date: Date;          // ISO string, e.g., "2025-08-24T10:00:00Z"
  trainer: number;       // trainer ID
}
