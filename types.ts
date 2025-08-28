
export type ComicStyle = 'anime' | 'pixel' | 'ghibli' | 'retro' | 'manga' | 'bw_manga' | 'custom';

export interface ComicPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface StoryPage {
  pageText: string;
  imagePrompt: string;
}

export interface GenerationParams {
  prompt: string;
  style: ComicStyle;
  customStyle: string;
  characterImage: File | null;
  characterDesc: string;
  onProgress: (message: string) => void;
  onComplete: (pages: ComicPage[]) => void;
  onError: (error: string) => void;
}
