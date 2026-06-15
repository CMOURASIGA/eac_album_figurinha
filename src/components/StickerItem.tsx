import React from 'react';
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

  if (isPlaceholder) {
    return (
      <div className={cn("w-full aspect-[3/4] bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center relative shadow-sm backdrop-blur-sm", className)}>
        <span className="text-white/40 font-bold text-4xl bg-white/5 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
          {positionNumber}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full aspect-[3/4] bg-gray-200 shadow-md flex flex-col overflow-hidden relative border-[6px] border-white font-sans",
      sticker.isNucleo ? "border-amber-300 ring-2 ring-amber-500" : "",
      className
    )}>
      {/* Header */}
      <div className="bg-[#0f4c81] text-white flex items-center px-1.5 py-1 z-10 shrink-0">
        <div className="bg-white rounded p-0.5 mr-1">
          <Camera size={10} className="text-[#0f4c81]" />
        </div>
        <div className="flex-1 flex items-center overflow-hidden">
          <span className="font-semibold text-[8px] whitespace-nowrap overflow-hidden text-ellipsis mr-1">
            Convocado
          </span>
          <span className="bg-white text-gray-900 font-bold text-[9px] px-1 py-0.5 rounded-sm whitespace-nowrap overflow-hidden text-ellipsis ml-auto">
            {sticker.name}
          </span>
        </div>
      </div>

      {/* Decorative Background */}
      <div className="flex-1 relative bg-white overflow-hidden p-1.5 flex flex-col justify-center shrink">
        {/* Background shapes approximation */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-[#fcd116] rounded-br-[100%] opacity-80" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#e31837] rounded-tl-[100%] opacity-80" />
        <div className="absolute top-8 right-[-10px] w-12 h-20 bg-[#0f4c81] rounded-l-full opacity-80" />
        <div className="absolute bottom-10 left-[-10px] w-20 h-10 bg-[#0f4c81] rounded-t-full opacity-80" />
        
        {/* Photo Frame */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
           <div className="h-full aspect-[3/4] bg-white rounded shadow border border-gray-100 overflow-hidden relative">
             {sticker.photoUrl ? (
               <img src={sticker.photoUrl} alt={sticker.name} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <Camera size={24} />
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Footer / Instagram UI */}
      <div className="bg-[#e2e8f0] px-2 py-1 z-10 shrink-0">
        <div className="flex items-center justify-between mb-1 text-gray-600">
          <div className="flex space-x-1.5">
            <Heart size={12} className="fill-red-500 text-red-500" />
            <MessageCircle size={12} />
            <Send size={12} />
          </div>
          <Bookmark size={12} />
        </div>
        
        <div className="w-full flex justify-center mb-0.5 text-center">
          <div className="bg-white px-3 py-0.5 rounded-sm shadow-sm inline-block w-full">
            <span className={cn(
              "font-bold text-[10px] tracking-wide",
              sticker.isNucleo ? "text-amber-600" : "text-gray-800"
            )}>
              {sticker.bottomText}
            </span>
          </div>
        </div>

        <div className="text-[7px] text-center leading-tight mt-0.5 mb-0.5 font-medium text-gray-800">
          Mais um dia incrível com a família EAC 🙌
          <div className="text-[#0f4c81] mt-0.5 flex items-center justify-center gap-1">
             <span className="font-bold">#EACPorciuncula</span>
             <span className="font-bold">#CristoNosUne</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-0.5 pt-0.5 opacity-90 h-4">
           <span className="text-[6px] text-[#0f4c81] font-semibold tracking-tight">@eacporciunculadesantana</span>
           {/* Logo placeholder or real logo */}
           {encounter?.logoUrl ? (
             <img src={encounter.logoUrl} referrerPolicy="no-referrer" alt="Logo" className="w-4 h-4 rounded-full object-contain shrink-0 bg-white" />
           ) : (
             <div className="w-4 h-4 rounded-full bg-[#0f4c81] border border-white flex items-center justify-center shrink-0">
               <span className="text-[4px] text-white font-bold leading-none">EAC</span>
             </div>
           )}
        </div>
      </div>

    </div>
  );
}

// Fixed dimensions for printing/consistency
export const STICKER_WIDTH = 250;
export const STICKER_HEIGHT = 333; // 3:4 aspect ratio approx
