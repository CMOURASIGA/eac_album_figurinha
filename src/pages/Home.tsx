import React, { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { AlbumPage } from '../components/AlbumPage';
import { BookOpen, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Home() {
  const { stickers, encounters } = useStore();
  const [selectedEncounter, setSelectedEncounter] = useState<string>('all');
  const [albumOpen, setAlbumOpen] = useState(false);

  const nucleoStickers = useMemo(() => {
    let list = stickers.filter(s => s.isNucleo);
    if (selectedEncounter !== 'all') {
      list = list.filter(s => s.encounterId === selectedEncounter);
    }
    return list;
  }, [stickers, selectedEncounter]);

  const commonStickers = useMemo(() => {
    let list = stickers.filter(s => !s.isNucleo);
    if (selectedEncounter !== 'all') {
      list = list.filter(s => s.encounterId === selectedEncounter);
    }
    return list;
  }, [stickers, selectedEncounter]);

  const nucleoPages = useMemo(() => {
    const pageMap = new Map<number, typeof stickers>();
    nucleoStickers.forEach(sticker => {
      if (!pageMap.has(sticker.page)) {
        pageMap.set(sticker.page, []);
      }
      pageMap.get(sticker.page)!.push(sticker);
    });
    return Array.from(pageMap.entries()).sort((a, b) => a[0] - b[0]);
  }, [nucleoStickers]);

  const commonPages = useMemo(() => {
    const pageMap = new Map<number, typeof stickers>();
    commonStickers.forEach(sticker => {
      if (!pageMap.has(sticker.page)) {
        pageMap.set(sticker.page, []);
      }
      pageMap.get(sticker.page)!.push(sticker);
    });
    return Array.from(pageMap.entries()).sort((a, b) => a[0] - b[0]);
  }, [commonStickers]);

  return (
    <div className={`min-h-[calc(100vh-64px)] bg-[#07243c] py-6 px-4 sm:px-6 lg:px-8 pb-24 flex flex-col items-center ${!albumOpen ? 'justify-center' : 'justify-start'}`}>
      <AnimatePresence mode="wait">
        {!albumOpen ? (
          <motion.div 
            key="closed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg bg-[#0f4c81] rounded-r-3xl rounded-l-md shadow-2xl overflow-hidden relative border-l-[16px] border-[#0a355c] min-h-[70vh] flex flex-col items-center justify-center cursor-pointer group"
            onClick={() => setAlbumOpen(true)}
          >
            {/* Book Spine Texture */}
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent z-20" />
            
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-xl translate-x-1/3 -translate-y-1/3 transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full mix-blend-overlay filter blur-xl -translate-x-1/3 translate-y-1/3 transition-transform duration-700 group-hover:scale-110" />
            
            <div className="relative p-8 flex flex-col items-center text-center z-10 w-full">
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20 mb-8 shadow-inner transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                <img 
                  src="https://i.imgur.com/c5XQ7TW.png" 
                  alt="EAC Logo" 
                  className="w-32 h-32 sm:w-48 sm:h-48 object-contain drop-shadow-xl"
                />
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-200">
                Álbum Oficial
              </h1>
              
              <div className="w-16 h-1 bg-[#fcd116] rounded-full mb-6" />
              
              <p className="text-blue-100 mt-2 text-base font-medium tracking-wide uppercase letter-spacing-2">
                Encontro de Adolescentes com Cristo
              </p>
              <p className="text-blue-200/80 mt-1 text-sm">
                Porciúncula de Sant'ana
              </p>

              <button className="mt-12 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-3 rounded-full font-bold tracking-wide backdrop-blur-md transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:text-[#0f4c81] group-hover:scale-105 active:scale-95">
                ABRIR ÁLBUM
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="open"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Header after opening */}
            <div className="mb-8 bg-[#0f4c81] rounded-2xl shadow-xl overflow-hidden relative border-b-8 border-[#fcd116]">
              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-xl translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full mix-blend-overlay filter blur-xl -translate-x-1/3 translate-y-1/3" />
              
              <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/20 transition" onClick={() => setAlbumOpen(false)}>
                    <img 
                      src="https://i.imgur.com/c5XQ7TW.png" 
                      alt="EAC Logo" 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                      Álbum EAC
                    </h1>
                    <p className="text-blue-100 mt-1 text-sm sm:text-base font-medium">
                      Suas figurinhas colecionadas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                  <Filter className="text-blue-100 h-5 w-5 ml-1" />
                  <select 
                    value={selectedEncounter}
                    onChange={(e) => setSelectedEncounter(e.target.value)}
                    className="flex-1 bg-transparent text-white border-none py-1 px-2 text-sm focus:outline-none focus:ring-0 [&>option]:text-gray-900 cursor-pointer font-medium"
                  >
                    <option value="all">Todos os Encontros</option>
                    {encounters.map(enc => (
                      <option key={enc.id} value={enc.id}>{enc.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {nucleoPages.length === 0 && commonPages.length === 0 ? (
              <div className="bg-[#0f4c81] rounded-xl shadow-2xl p-12 text-center border border-dashed border-white/30 backdrop-blur-md">
                <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/5">
                   <BookOpen className="h-8 w-8 text-blue-200" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Seu Álbum está Vazio</h2>
                <p className="text-blue-200/80">
                  Escaneie figurinhas na aba "Escanear" ou crie a sua para começar a colecionar!
                </p>
              </div>
            ) : (
              <div className="space-y-12 w-full">
                {nucleoPages.map(([pageNumber, pageStickers]) => (
                  <AlbumPage 
                    key={`nucleo-${pageNumber}`} 
                    title={`NÚCLEO ESPECIAL - ${pageNumber}`}
                    pageNumber={pageNumber} 
                    stickers={pageStickers} 
                  />
                ))}
                {commonPages.map(([pageNumber, pageStickers]) => (
                  <AlbumPage 
                    key={`common-${pageNumber}`} 
                    title={`PARTICIPANTES - ${pageNumber}`}
                    pageNumber={pageNumber} 
                    stickers={pageStickers} 
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
