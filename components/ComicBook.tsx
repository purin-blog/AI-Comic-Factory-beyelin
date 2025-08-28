
import React, { useState, useEffect } from 'react';
import type { ComicPage } from '../types';
import { LeftArrowIcon, RightArrowIcon, RedoIcon } from './Icons';

interface ComicBookProps {
  pages: ComicPage[];
  onReset: () => void;
}

const ComicBook: React.FC<ComicBookProps> = ({ pages, onReset }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 2);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 2);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);
  
  const Page = ({ page, side }: { page: ComicPage, side: 'left' | 'right' }) => (
    <div className={`w-1/2 h-full flex flex-col ${side === 'left' ? 'items-end' : 'items-start'}`}>
      <div className="w-full h-full bg-gray-100 shadow-inner flex flex-col">
        {side === 'left' && <img src={page.imageUrl} alt={`Page ${page.pageNumber}`} className="w-full h-3/5 object-cover" />}
        <div className="p-4 sm:p-6 flex-grow text-gray-800 text-sm sm:text-base overflow-y-auto">
          {page.text}
        </div>
        <div className="text-center text-xs text-gray-500 p-2 border-t border-gray-300">{page.pageNumber}</div>
        {side === 'right' && <img src={page.imageUrl} alt={`Page ${page.pageNumber}`} className="w-full h-3/5 object-cover" />}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <div className="relative w-full aspect-[2/1.2]" style={{ perspective: '2000px' }}>
        {pages.map((page, index) => {
          const isEven = index % 2 === 0;
          const isVisible = index === currentPage || index === currentPage + 1;
          const isFlipped = index < currentPage;

          if (!isVisible) return null;

          return (
            <div
              key={page.pageNumber}
              className="absolute w-full h-full transition-transform duration-1000"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: isEven ? 'right center' : 'left center',
                transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                zIndex: isFlipped ? index : totalPages - index,
              }}
            >
              <div className="absolute w-full h-full flex" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                {isEven ? (
                  // Front of a spread (left blank, right page)
                  <>
                    <div className="w-1/2 h-full bg-gray-100 shadow-inner" />
                    {pages[index] && <Page page={pages[index]} side="right" />}
                  </>
                ) : (
                   // Back of a spread (left page, right blank)
                  <>
                    {pages[index] && <Page page={pages[index]} side="left" />}
                    <div className="w-1/2 h-full bg-gray-100 shadow-inner" />
                  </>
                )}
              </div>
              <div className="absolute w-full h-full flex" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                 {isEven ? (
                    // Back of a spread (left page, right blank)
                  <>
                    {pages[index+1] && <Page page={pages[index+1]} side="left" />}
                    <div className="w-1/2 h-full bg-gray-100 shadow-inner" />
                  </>
                ) : (
                  // Front of a spread (left blank, right page)
                  <>
                    <div className="w-1/2 h-full bg-gray-100 shadow-inner" />
                    {pages[index-1] && <Page page={pages[index-1]} side="right" />}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={onReset}
          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors duration-300"
          title="Create New Comic"
        >
          <RedoIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <LeftArrowIcon className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold tabular-nums">
          Pages {Math.min(currentPage + 1, totalPages)}-{Math.min(currentPage + 2, totalPages)} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 2}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <RightArrowIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ComicBook;
