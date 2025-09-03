
export type ComicStyle = 'anime' | 'pixel' | 'ghibli' | 'retro' | 'manga' | 'bw_manga' | 'custom';

export type ImageModel = 'imagen-4.0' | 'gemini-2.5-flash-image-preview';

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
  imageModel: ImageModel;
  onProgress: (message: string) => void;
  onComplete: (pages: ComicPage[]) => void;
  onError: (error: string) => void;
}
