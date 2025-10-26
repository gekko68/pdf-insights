export interface Comment {
  text: string;
  comment: string;
  page: number;
  timestamp: string;
  offsets: { start: number; end: number };
} 