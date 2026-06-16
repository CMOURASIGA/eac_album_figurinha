import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { StickerItem } from '../components/StickerItem';
import { supabase } from '../lib/supabase';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, Download, QrCode, Link as LinkIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import { cn } from '../lib/utils';

export function VisualizarFigurinha() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stickers, saveSharedSticker } = useStore();
  
  const [stickerData, setStickerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOldFormat, setIsOldFormat] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isAlreadySaved = stickers.some(s => s.id === id);

  useEffect(() => {
    async function loadFigurinha() {
       if (!id) return;
       
       // Procura no store local primeiro (se a pessoa clicou na própria figurinha do álbum dela)
       const local = stickers.find(s => s.id === id);
       if (local) {
          setStickerData(local);
          setLoading(false);
          return;
       }

       // Testa buscar no Supabase
       try {
         const { data, error } = await supabase
           .from('figurinha')
           .select('*, encontros(nome)')
           .eq('id', id)
           .single();

         if (error?.code === '22P02') {
             setStickerData(null);
             setIsOldFormat(true);
             setError(true);
             // Para não poluir o console, tratamos a falha de sintaxe UUID como normal
         } else if (error || !data) {
            setError(true);
         } else {
            // Mapeia do banco para a interface local
            const encounterName = data.encontros?.nome || 'EAC';
            const isNucleo = data.tipo === 'NÚCLEO' || data.texto_inferior?.startsWith('NÚCLEO');
            const isMomento = data.texto_inferior === 'RECORDAÇÃO OFICIAL';

            const mapped = {
               id: data.id,
               requestId: 'imported',
               name: data.nome,
               photoUrl: data.foto_url,
               encounterId: data.encontro_id,
               bottomText: data.texto_inferior || (isNucleo ? 'NÚCLEO' : encounterName),
               isNucleo: isNucleo,
               rarity: isMomento ? 'MOMENTO' : (isNucleo ? 'ESPECIAL' : 'COMUM'),
               page: 1, 
               position: 1
            };
            setStickerData(mapped);
         }
       } catch (e) {
         setError(true);
       } finally {
         setLoading(false);
       }
    }
    loadFigurinha();
  }, [id, stickers]);

  const handleSaveToAlbum = () => {
    if (!stickerData) return;
    saveSharedSticker(stickerData);
  };

  const shareUrl = window.location.origin + `/figurinha/${id}`;

  return (
     <div className="min-h-screen bg-gray-100 py-8 px-4 pb-32">
        <div className="max-w-md mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900 transition-colors">
               <ArrowLeft size={20} /> Voltar
            </button>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
                   <Loader2 className="animate-spin text-[#0f4c81] h-12 w-12 mb-4" />
                   <p className="text-gray-500 font-medium">Carregando figurinha...</p>
                </div>
            ) : error || !stickerData ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-red-200">
                   <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
                   {isOldFormat ? (
                       <>
                         <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Figurinha desatualizada</h2>
                         <p className="text-gray-500 text-center">
                           Este QR Code é de uma versão antiga do sistema. <br/><br/><strong>Peça para a pessoa dona desta figurinha abrir o álbum dela.</strong> O sistema irá atualizar o QR Code automaticamente para a nova versão!
                         </p>
                       </>
                   ) : (
                       <>
                         <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Figurinha não encontrada</h2>
                         <p className="text-gray-500 text-center">
                           Este QR Code pode ser inválido ou a figurinha foi removida.
                         </p>
                       </>
                   )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex justify-center">
                         <div className="w-full max-w-[280px]">
                           <StickerItem sticker={stickerData} />
                         </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                        {isAlreadySaved ? (
                            <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center justify-center gap-2 font-medium">
                                <CheckCircle className="h-5 w-5" />
                                Esta figurinha já está no seu álbum!
                            </div>
                        ) : (
                            <button 
                                onClick={handleSaveToAlbum}
                                className="w-full mb-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                            >
                                <Download className="h-5 w-5" />
                                COLAR NO MEU ÁLBUM
                            </button>
                        )}

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="font-bold text-gray-800 flex items-center justify-center gap-2 mb-4">
                               <QrCode /> Compartilhar Figurinha
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Mostre este QR Code para um amigo escanear, ou copie o link para enviar nas redes sociais.
                            </p>
                            
                            <div className="bg-white p-4 border-2 border-gray-100 rounded-xl inline-block shadow-sm mb-6">
                                <QRCode value={shareUrl} size={180} />
                            </div>

                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border border-blue-200"
                            >
                                {copied ? <CheckCircle className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
                                {copied ? 'LINK COPIADO!' : 'COPIAR LINK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
     </div>
  );
}
