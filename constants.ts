
import type { ComicStyle } from './types';

export const COMIC_STYLES: { id: ComicStyle; name: string }[] = [
  { id: 'anime', name: 'Anime' },
  { id: 'pixel', name: 'Pixel Art' },
  { id: 'ghibli', name: 'Ghibli Style' },
  { id: 'retro', name: 'Retro Comic' },
  { id: 'manga', name: 'Manga' },
  { id: 'bw_manga', name: 'Black & White Manga' },
  { id: 'custom', name: 'Custom Style' },
];

export const MAX_PAGES = 10;
