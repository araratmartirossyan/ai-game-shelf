export interface Game {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  genre?: string;
  platform?: string;
  year?: number;
  created_at: string;
  updated_at: string;
}

export interface GameRecognitionResult {
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  genre?: string;
  platform?: string;
  year?: number;
}
