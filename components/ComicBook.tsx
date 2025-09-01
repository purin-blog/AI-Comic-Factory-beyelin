
import React, { useState, useEffect } from 'react';
import type { ComicPage } from '../types';
import { LeftArrowIcon, RightArrowIcon, RedoIcon } from './Icons';

interface ComicBookProps {
  pages: ComicPage[];
  onReset: () => void;
}

const ComicBook: React.FC<ComicBookProps> = ({ pages, onReset }) => {
  const [currentSpread, setCurrentSpread] = useState(0);
  const totalPages = pages.length;
  
  // Calculate total spreads: first page alone + remaining pages in pairs
  const totalSpreads = Math.ceil((totalPages - 1) / 2) + (totalPages > 0 ? 1 : 0);

  const handleNextPage = () => {
    if (currentSpread < totalSpreads - 1) {
      setCurrentSpread(currentSpread + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentSpread > 0) {
      setCurrentSpread(currentSpread - 1);
    }
  };
  
  // Get pages for current spread
  const getCurrentSpreadPages = () => {
    if (currentSpread === 0) {
      // First spread: only right page (page 1)
      return { leftPage: null, rightPage: pages[0] || null };
    } else {
      // Subsequent spreads: pairs of pages
      const leftPageIndex = (currentSpread - 1) * 2 + 1;
      const rightPageIndex = leftPageIndex + 1;
      return {
        leftPage: pages[leftPageIndex] || null,
        rightPage: pages[rightPageIndex] || null
      };
    }
  };
  
  const { leftPage, rightPage } = getCurrentSpreadPages();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSpread, totalSpreads]);
  
  const Page = ({ page, side }: { page: ComicPage, side: 'left' | 'right' }) => (
    <div className="w-full h-full bg-white shadow-inner flex flex-col">
      <img 
        src={page.imageUrl} 
        alt={`Page ${page.pageNumber}`} 
        className="w-full h-3/5 object-cover border-b border-gray-200" 
      />
      <div className="p-4 sm:p-6 flex-grow text-gray-800 text-sm sm:text-base overflow-y-auto leading-relaxed">
        {page.text}
      </div>
      <div className={`text-xs text-gray-500 p-2 border-t border-gray-200 ${
        side === 'left' ? 'text-left' : 'text-right'
      }`}>
        {page.pageNumber}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <div className="relative w-full aspect-[2/1.2] bg-gray-200 rounded-lg shadow-2xl overflow-hidden">
        <div className="w-full h-full flex">
          {/* Left Page */}
          <div className="w-1/2 h-full border-r border-gray-300">
            {leftPage ? (
              <Page page={leftPage} side="left" />
            ) : (
              <div className="w-full h-full bg-gray-100 shadow-inner flex items-center justify-center">
                <div className="text-gray-400 text-lg font-serif">AI Comic Factory</div>
              </div>
            )}
          </div>
          
          {/* Right Page */}
          <div className="w-1/2 h-full">
            {rightPage ? (
              <Page page={rightPage} side="right" />
            ) : (
              <div className="w-full h-full bg-gray-100 shadow-inner flex items-center justify-center">
                <div className="text-gray-400 text-lg font-serif">End</div>
              </div>
            )}
          </div>
        </div>
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
          disabled={currentSpread === 0}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <LeftArrowIcon className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold tabular-nums">
          {currentSpread === 0 ? (
            `Page 1 / ${totalPages}`
          ) : (
            (() => {
              const leftPageNum = (currentSpread - 1) * 2 + 2;
              const rightPageNum = leftPageNum + 1;
              const displayPages = [];
              if (leftPage) displayPages.push(leftPageNum);
              if (rightPage) displayPages.push(rightPageNum);
              return `Page${displayPages.length > 1 ? 's' : ''} ${displayPages.join('-')} / ${totalPages}`;
            })()
          )}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentSpread >= totalSpreads - 1}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <RightArrowIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ComicBook;
