import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { Camera, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Sticker } from '../lib/store';

interface StickerItemProps {
  sticker: Sticker;
  className?: string;
  isPlaceholder?: boolean;
  positionNumber?: number;
}

export function StickerItem({ sticker, className, isPlaceholder, positionNumber }: StickerItemProps) {
  const encounters = useStore(state => state.encounters);
  const encounter = encounters.find(e => e.id === sticker?.encounterId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setScale(width / 250);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (isPlaceholder) {
    return (
      <div 
        ref={containerRef}
        className={cn("w-full aspect-[3/4] bg-white/5 rounded-xl border-2 border-dashed border-white/20 relative shadow-sm backdrop-blur-sm overflow-hidden", className)}
      >
        <div 
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: 250, height: 333, transform: `scale(${scale})` }}
        >
          <div className="w-[250px] h-[333px] flex items-center justify-center">
            <span className="text-white/40 font-bold text-4xl bg-white/5 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
              {positionNumber}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("w-full aspect-[3/4] relative overflow-hidden", className)}
    >
      <div 
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: 250, height: 333, transform: `scale(${scale})` }}
      >
        <div className={cn(
          "w-[250px] h-[333px] bg-gray-200 shadow-xl flex flex-col overflow-hidden relative border-[6px] border-white font-sans",
          sticker.rarity === 'MOMENTO' ? "border-pink-300 ring-2 ring-pink-500 rounded-lg" : (sticker.isNucleo ? "border-amber-300 ring-2 ring-amber-500" : "")
        )}>
          {/* Header */}
          <div className={cn("text-white flex items-center px-2 py-1 z-10 shrink-0", sticker.rarity === 'MOMENTO' ? 'bg-[#e31837]' : 'bg-[#0f4c81]')}>
            <div className="bg-white rounded p-0.5 mr-1.5 flex items-center justify-center">
              {sticker.rarity === 'MOMENTO' ? <Heart size={12} className="text-[#e31837]" /> : <Camera size={12} className="text-[#0f4c81]" />}
            </div>
            <div className="flex-1 flex items-center overflow-hidden">
              <span className="font-semibold text-[10px] whitespace-nowrap overflow-hidden text-ellipsis mr-1">
                {sticker.rarity === 'MOMENTO' ? 'Recordação' : 'Convocado'}
              </span>
              <span className="bg-white text-gray-900 font-extrabold text-[11px] px-1.5 py-0.5 rounded-sm whitespace-nowrap overflow-hidden text-ellipsis ml-auto max-w-[70%] shadow-sm">
                {sticker.name}
              </span>
            </div>
          </div>

          {/* Decorative Background */}
          <div className="flex-1 relative bg-white overflow-hidden p-2 flex flex-col justify-center shrink">
            {/* Background shapes approximation */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-[#fcd116] rounded-br-[100%] opacity-80" />
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-[#e31837] rounded-tl-[100%] opacity-80" />
            <div className="absolute top-10 right-[-10px] w-14 h-24 bg-[#0f4c81] rounded-l-full opacity-80" />
            <div className="absolute bottom-12 left-[-10px] w-24 h-12 bg-[#0f4c81] rounded-t-full opacity-80" />
            
            {/* Photo Frame */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
               <div className="h-full aspect-[3/4] bg-white rounded-md shadow-md border-[3px] border-gray-100 overflow-hidden relative">
                 {sticker.photoUrl ? (
                   <img src={sticker.photoUrl} alt={sticker.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                      <Camera size={32} />
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Footer / Instagram UI */}
          <div className="bg-[#e2e8f0] px-2.5 py-1.5 z-10 shrink-0">
            <div className="flex items-center justify-between mb-1.5 text-gray-600">
              <div className="flex space-x-2">
                <Heart size={14} className="fill-red-500 text-red-500 hover:scale-110 transition-transform cursor-pointer" />
                <MessageCircle size={14} className="hover:text-gray-800 transition-colors cursor-pointer" />
                <Send size={14} className="hover:text-gray-800 transition-colors cursor-pointer" />
              </div>
              <Bookmark size={14} className="hover:text-gray-800 transition-colors cursor-pointer" />
            </div>
            
            <div className="w-full flex justify-center mb-1 text-center">
              <div className="bg-white px-3 py-1 rounded-sm shadow-sm inline-block w-full border border-gray-100">
                <span className={cn(
                  "font-bold text-[11px] tracking-wide",
                  sticker.rarity === 'MOMENTO' ? "text-pink-600" : (sticker.isNucleo ? "text-amber-600" : "text-gray-800")
                )}>
                  {sticker.bottomText}
                </span>
              </div>
            </div>

            <div className="text-[8px] text-center leading-tight mt-1 mb-1 font-semibold text-gray-700">
              {sticker.rarity === 'MOMENTO' ? 'Mais um momento inesquecível ✨' : 'Mais um dia incrível com a família EAC 🙌'}
              <div className="text-[#0f4c81] mt-0.5 flex items-center justify-center gap-1.5">
                 <span className="font-bold cursor-pointer hover:underline">#EACPorciuncula</span>
                 <span className="font-bold cursor-pointer hover:underline">#CristoNosUne</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1 pt-1 opacity-90 h-5 border-t border-gray-300/50">
               <span className="text-[7.5px] text-[#0f4c81] font-bold tracking-tight">@eacporciunculadesantana</span>
               {encounter?.logoUrl ? (
                 <img src={encounter.logoUrl} referrerPolicy="no-referrer" alt="Logo" className="w-4 h-4 rounded-full object-contain shrink-0 bg-white shadow-sm ring-1 ring-white" />
               ) : (
                 <div className="w-4 h-4 rounded-full bg-[#0f4c81] border border-white flex items-center justify-center shrink-0 shadow-sm">
                   <span className="text-[4px] text-white font-bold leading-none">EAC</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fixed dimensions for printing/consistency
export const STICKER_WIDTH = 250;
export const STICKER_HEIGHT = 333; // 3:4 aspect ratio approx

