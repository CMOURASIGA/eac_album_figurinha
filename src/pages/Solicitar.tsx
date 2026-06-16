import React, { useState, useCallback } from 'react';
import { useStore } from '../lib/store';
import { resizeImage, getCroppedImg } from '../lib/utils';
import { Camera, Image as ImageIcon, CheckCircle, Loader2, Crop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { supabase } from '../lib/supabase';
import { StickerItem } from '../components/StickerItem';

export function Solicitar() {
  const { encounters, saveSharedSticker } = useStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [encounterId, setEncounterId] = useState(encounters[0]?.id || '');
  const [isNucleo, setIsNucleo] = useState(false);

  React.useEffect(() => {
    if (encounters.length > 0 && !encounters.some(e => e.id === encounterId)) {
      setEncounterId(encounters[0].id);
    }
  }, [encounters, encounterId]);

  const [rawImageUrl, setRawImageUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  
  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      const resizedUrl = await resizeImage(file, 1200, 1200); // Keep decent quality for crop
      setRawImageUrl(resizedUrl);
      setIsCropping(true);
    } catch (error) {
      console.error('Failed to process image', error);
      alert('Erro ao processar imagem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCrop = async () => {
    try {
       const croppedImage = await getCroppedImg(rawImageUrl, croppedAreaPixels);
       setPhotoUrl(croppedImage);
       setIsCropping(false);
    } catch (e) {
       console.error(e);
       alert('Erro ao cortar imagem');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob || !encounterId || !photoUrl) {
      alert('Preencha todos os campos e envie uma foto.');
      return;
    }

    setIsLoading(true);

    try {
      if (encounters.length === 0) {
         throw new Error("Não foi possível carregar os encontros (EAC) do banco de dados. Por favor, recarregue a página antes de continuar.");
      }
      
      let finalEncounterId = encounterId;
      
      // Defesa contra estados defasados no momento do submit: 
      // Se o ID selecionado não estiver na lista de encontros carregados do banco, pega o primeiro válido.
      if (!encounters.some(e => e.id === finalEncounterId) && encounters.length > 0) {
          finalEncounterId = encounters[0].id;
          console.warn("Estado do encounterId estava defasado. Forçando para o primeiro válido: ", finalEncounterId);
      }

      const encounterName = encounters.find(e => e.id === finalEncounterId)?.name || 'EAC';

      const payload = {
          nome: name.toUpperCase(),
          encontro_id: finalEncounterId?.trim(),
          foto_url: photoUrl,
          texto_inferior: isNucleo ? 'NÚCLEO' : encounterName
      };
      
      console.log("Submitting figurinha with payload:", payload);

      const { data, error } = await supabase.from('figurinha').insert(payload).select().single();

      if (error) {
          console.error("Insert error:", error);
          if (error.code === '23503') {
             throw new Error(`Erro: O encontro (EAC) selecionado não existe no banco. ID enviado: "${finalEncounterId}". Recarregue e tente novamente.`);
          }
          throw error;
      }

      saveSharedSticker({
          id: data.id,
          requestId: 'self',
          name: name.toUpperCase(),
          photoUrl: photoUrl,
          encounterId: finalEncounterId,
          bottomText: isNucleo ? 'NÚCLEO' : encounterName,
          isNucleo: isNucleo,
          rarity: isNucleo ? 'ESPECIAL' : 'COMUM',
          page: 1, 
          position: 1
      });

      setCreatedId(data.id);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/figurinha/${data.id}`);
      }, 2000);

    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Erro ao criar figurinha.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <CheckCircle className="text-green-500 h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Figurinha Criada!</h2>
          <p className="text-gray-600 mb-6">
            Redirecionando para a sua figurinha...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 pb-32 flex items-start justify-center">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-lg w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto bg-[#0f4c81] w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Camera className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crie sua Figurinha</h1>
          <p className="text-sm text-gray-500 mt-1">Preencha os dados e ajuste sua foto para figurinha EAC.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome na Figurinha</label>
            <input 
              type="text" 
              maxLength={20}
              placeholder="Ex: JOÃO SILVA"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Máximo 20 caracteres.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
            <input 
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EAC Realizado</label>
            <select 
              value={encounterId}
              onChange={e => setEncounterId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
              required
            >
              <option disabled value="">Selecione...</option>
              {encounters.map(enc => (
                <option key={enc.id} value={enc.id}>{enc.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
             <input 
               id="isNucleo"
               type="checkbox"
               checked={isNucleo}
               onChange={(e) => setIsNucleo(e.target.checked)}
               className="h-4 w-4 text-[#0f4c81] rounded border-gray-300 focus:ring-[#0f4c81]"
             />
             <label htmlFor="isNucleo" className="ml-2 block text-sm text-gray-800 font-medium">
                Faço parte do Núcleo
             </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto (Rosto legível, camisa EAC)</label>
            
            {isCropping ? (
               <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden">
                  <Cropper
                    image={rawImageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={3 / 4} // portrait aspect ratio for the sticker form
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <div className="absolute top-2 left-0 right-0 flex justify-center z-10 px-4">
                     <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => {
                          setZoom(Number(e.target.value))
                        }}
                        className="w-full max-w-xs"
                      />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 gap-2">
                     <button
                        type="button"
                        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 font-medium text-sm border-2 border-gray-600"
                        onClick={() => {
                           setIsCropping(false);
                           setRawImageUrl('');
                        }}
                     >
                        Cancelar
                     </button>
                     <button
                        type="button"
                        className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-500 font-bold"
                        onClick={handleConfirmCrop}
                     >
                        <Crop className="w-4 h-4 inline mr-1" />
                        Cortar e Confirmar
                     </button>
                  </div>
               </div>
            ) : !photoUrl ? (
              <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center text-gray-500">
                   {isLoading ? (
                     <Loader2 className="h-8 w-8 animate-spin mb-2" />
                   ) : (
                     <ImageIcon className="h-8 w-8 mb-2" />
                   )}
                   <span className="text-sm font-medium">Clique para enviar foto</span>
                   <span className="text-xs">Formato paisagem ou retrato (JPG/PNG)</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            ) : (
              <div className="flex flex-col items-center">
                 <div className="relative w-full max-w-[240px] shadow-xl rounded overflow-hidden mb-4">
                   <StickerItem 
                     sticker={{
                        id: 'preview',
                        requestId: 'preview',
                        name: name.toUpperCase() || 'SEU NOME',
                        photoUrl: photoUrl,
                        encounterId: encounterId,
                        bottomText: isNucleo ? 'NÚCLEO' : (encounters.find(e => e.id === encounterId)?.name || 'EAC'),
                        isNucleo: isNucleo,
                        rarity: isNucleo ? 'ESPECIAL' : 'COMUM',
                        page: 1,
                        position: 1
                     }}
                   />
                 </div>
                 <div className="flex justify-center gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => {
                         setPhotoUrl('');
                         setIsCropping(true); 
                      }}
                      className="flex-1 bg-white border border-gray-300 text-gray-800 text-sm px-4 py-2 rounded-md font-medium shadow-sm hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      <Crop size={16} /> Re-cortar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="flex-1 bg-white border border-red-200 text-red-600 text-sm px-4 py-2 rounded-md font-medium shadow-sm hover:bg-red-50"
                    >
                      Trocar Foto
                    </button>
                 </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading || isCropping || !name || !dob || !encounterId || !photoUrl}
            className="w-full bg-[#e31837] hover:bg-[#c41530] text-white font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Criar Figurinha Agora
          </button>
        </form>
      </div>
    </div>
  );
}
