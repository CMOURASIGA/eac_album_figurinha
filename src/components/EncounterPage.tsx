import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Encounter } from '../lib/store';

interface EncounterPageProps {
  pageNumber: number;
  encounters: Encounter[];
}

export const EncounterPage: React.FC<EncounterPageProps> = ({ pageNumber, encounters }) => {
  const slots = Array.from({ length: 8 }, (_, i) => i);
  const navigate = useNavigate();

  return (
    <div className="bg-[#0f4c81] rounded-xl shadow-2xl border border-blue-900/50 overflow-hidden mb-12 max-w-4xl mx-auto ring-4 ring-[#0f4c81]/20">
      <div className="bg-white/10 text-white px-6 py-4 flex justify-between items-center border-b-[6px] border-[#fcd116] backdrop-blur-md">
        <h2 className="text-2xl font-black italic tracking-wide uppercase drop-shadow-md">
          ESCUDOS DOS ENCONTROS
        </h2>
        <span className="font-mono font-bold bg-[#fcd116] text-[#0f4c81] px-3 py-1 rounded-full text-sm shadow-sm">
          PAG. E{pageNumber.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="p-6 lg:p-10 relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full mix-blend-overlay filter blur-2xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />
         
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center relative z-10">
          {slots.map(index => {
            const encounter = encounters[index];
            if (encounter) {
              return (
                <div 
                  key={encounter.id} 
                  onClick={() => navigate(`/encontro/${encounter.id}`)}
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-lg border-[6px] border-white max-w-[220px] mx-auto w-full aspect-[3/4] relative rotate-1 hover:rotate-0 transition-transform cursor-pointer hover:scale-105"
                >
                  {encounter.logoUrl ? (
                    <img src={encounter.logoUrl} referrerPolicy="no-referrer" alt={encounter.name} className="w-full h-full object-contain drop-shadow-xl" />
                  ) : (
                    <div className="text-gray-300 font-bold uppercase text-center text-xs">Sem Logo</div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-b from-[#07243c] to-[#0f4c81] flex flex-col items-center justify-center border-t-2 border-[#fcd116]">
                    <span className="text-white font-bold text-xs sm:text-sm tracking-wide text-center leading-tight">
                      {encounter.name}
                    </span>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={`empty-${index}`} className="flex flex-col items-center justify-center p-4 bg-black/20 rounded-xl shadow-inner border-[3px] border-dashed border-white/20 max-w-[220px] mx-auto w-full aspect-[3/4]">
                   <span className="text-white/20 font-bold text-4xl">{index + 1}</span>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
