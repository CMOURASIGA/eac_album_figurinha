import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { Share2, AlertCircle, Loader2, ArrowLeft, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

export function VisualizarEncontro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { encounters } = useStore();
  
  const [encounterData, setEncounterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadEncontro() {
       if (!id) return;
       
       // Procura no store local primeiro
       const local = encounters.find(e => e.id === id);
       if (local) {
          setEncounterData(local);
          setLoading(false);
          return;
       }

       // Testa buscar no Supabase
       try {
         const { data, error } = await supabase
           .from('encontros')
           .select('id, nome, numero, logo_url')
           .eq('id', id)
           .single();

         if (error || !data) {
            setError(true);
         } else {
            const mapped = {
               id: data.id,
               name: data.nome,
               logoUrl: data.logo_url || 'https://i.imgur.com/c5XQ7TW.png'
            };
            setEncounterData(mapped);
         }
       } catch (e) {
         setError(true);
       } finally {
         setLoading(false);
       }
    }
    loadEncontro();
  }, [id, encounters]);

  const shareUrl = window.location.origin + `/encontro/${id}`;

  return (
     <div className="min-h-screen bg-gray-100 py-8 px-4 pb-32">
        <div className="max-w-md mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900 transition-colors">
               <ArrowLeft size={20} /> Voltar
            </button>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
                   <Loader2 className="animate-spin text-[#0f4c81] h-12 w-12 mb-4" />
                   <p className="text-gray-500 font-medium">Carregando encontro...</p>
                </div>
            ) : error || !encounterData ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-red-200">
                   <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
                   <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Encontro não encontrado</h2>
                   <p className="text-gray-500 text-center">
                     Este QR Code pode ser inválido ou o encontro foi removido.
                   </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                         <div className="w-full max-w-[280px] aspect-[3/4] bg-white rounded-xl shadow-sm border-2 border-gray-100 flex flex-col items-center justify-center p-4">
                           {encounterData.logoUrl ? (
                             <img src={encounterData.logoUrl} referrerPolicy="no-referrer" alt={encounterData.name} className="w-full h-full object-contain drop-shadow-md" />
                           ) : (
                             <div className="text-gray-300 font-bold uppercase text-center text-lg">Sem Logo</div>
                           )}
                         </div>
                         <h2 className="mt-6 text-2xl font-black text-[#0f4c81] text-center tracking-tight">
                            {encounterData.name}
                         </h2>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                        <div className="mb-6 bg-blue-50 text-[#0f4c81] p-4 rounded-lg flex flex-col items-center justify-center gap-2 font-medium">
                            <Share2 className="h-6 w-6" />
                            <span>Escudo Oficial do Encontro</span>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="font-bold text-gray-800 flex items-center justify-center gap-2 mb-4">
                               <QrCode /> Compartilhar Escudo
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                               Mostre este QR Code para um amigo visualizar o escudo deste encontro.
                            </p>
                            
                            <div className="bg-white p-4 border-2 border-gray-100 rounded-xl inline-block shadow-sm mb-2">
                                <QRCode value={shareUrl} size={180} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
     </div>
  );
}
