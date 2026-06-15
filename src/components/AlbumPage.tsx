import React from 'react';
import { StickerItem } from './StickerItem';
import type { Sticker } from '../lib/store';

interface AlbumPageProps {
  pageNumber: number;
  stickers: Sticker[];
  title?: string;
}

import { useNavigate } from 'react-router-dom';

export const AlbumPage: React.FC<AlbumPageProps> = ({ pageNumber, stickers, title }) => {
  const navigate = useNavigate();
  // A page always has 7 slots
  const slots = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div className="bg-[#0f4c81] rounded-xl shadow-2xl border border-blue-900/50 overflow-hidden mb-12 max-w-4xl mx-auto ring-4 ring-[#0f4c81]/20">
      {/* Page Header */}
      <div className="bg-white/10 text-white px-6 py-4 flex justify-between items-center border-b-[6px] border-[#fcd116] backdrop-blur-md">
        <h2 className="text-2xl font-black italic tracking-wide uppercase drop-shadow-md">
          {title || `Página ${pageNumber}`}
        </h2>
        <span className="font-mono font-bold bg-[#fcd116] text-[#0f4c81] px-3 py-1 rounded-full text-sm shadow-sm">
          PAG. {pageNumber.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Grid of Stickers */}
      <div className="p-6 lg:p-10 relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full mix-blend-overlay filter blur-2xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />
         <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://i.imgur.com/c5XQ7TW.png')] bg-contain bg-no-repeat opacity-[0.05] pointer-events-none" />
         
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center relative z-10">
          {slots.map(position => {
            const sticker = stickers.find(s => s.position === position);
            return (
              <div key={position} className="flex justify-center w-full max-w-[220px] mx-auto">
                {sticker ? (
                  <div 
                    onClick={() => navigate(`/figurinha/${sticker.id}`)}
                    className="w-full cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  >
                    <StickerItem sticker={sticker} className="w-full shadow-lg" />
                  </div>
                ) : (
                  <StickerItem sticker={{} as any} isPlaceholder positionNumber={position} className="w-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
