
import React, { useState, useCallback } from 'react';
import type { ComicPage, ComicStyle } from './types';
import { generateComicStory } from './services/geminiService';
import ComicGeneratorForm from './components/ComicGeneratorForm';
import LoadingIndicator from './components/LoadingIndicator';
import ComicBook from './components/ComicBook';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [comicPages, setComicPages] = useState<ComicPage[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateComic = useCallback(async (
    prompt: string,
    style: ComicStyle,
    customStyle: string,
    characterImage: File | null,
    characterDesc: string
  ) => {
    setIsLoading(true);
    setError(null);
    setComicPages(null);
    
    try {
      await generateComicStory({
        prompt,
        style,
        customStyle,
        characterImage,
        characterDesc,
        onProgress: setLoadingMessage,
        onComplete: (pages) => {
          setComicPages(pages);
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err);
          setIsLoading(false);
        }
      });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setComicPages(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator message={loadingMessage} />;
    }
    if (error) {
      return (
        <div className="text-center text-red-400">
          <p className="text-xl">Generation Failed</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={handleReset}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      );
    }
    if (comicPages) {
      return <ComicBook pages={comicPages} onReset={handleReset} />;
    }
    return <ComicGeneratorForm onGenerate={handleGenerateComic} disabled={isLoading} />;
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <header className="w-full max-w-5xl flex items-center justify-center mb-6 md:mb-8">
        <LogoIcon className="w-10 h-10 mr-3 text-indigo-400" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          AI Comic Factory
        </h1>
      </header>
      <main className="w-full flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
      <footer className="w-full text-center text-gray-500 mt-8 text-sm">
        <p>Powered by Google Gemini. Create your story in seconds.</p>
      </footer>
    </div>
  );
};

export default App;
