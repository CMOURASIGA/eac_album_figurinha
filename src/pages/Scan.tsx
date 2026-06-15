import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { QrCode, X } from 'lucide-react';

export function Scan() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      const text = result[0].rawValue;
      try {
        const url = new URL(text);
        if (url.pathname.includes('/figurinha/')) {
           const id = url.pathname.split('/figurinha/')[1];
           navigate(`/figurinha/${id}`);
        } else {
           setError('QR Code não é de uma figurinha do sistema.');
        }
      } catch {
        // Se for só o ID direto
        if (text.length > 8) {
           navigate(`/figurinha/${text}`);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 flex justify-between items-center text-white bg-black z-10 border-b border-gray-800">
         <h1 className="font-bold flex items-center gap-2">
           <QrCode /> Escanear Figurinha
         </h1>
         <button onClick={() => navigate(-1)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
           <X size={20} />
         </button>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center bg-gray-900">
         <div className="w-full max-w-sm absolute inset-0 sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:h-[500px]">
           <Scanner onScan={handleScan} components={{
               audio: false,
               finder: true,
           }} />
         </div>
         
         <div className="absolute bottom-12 left-0 right-0 text-center text-white px-6">
            <div className="bg-black/60 p-4 rounded-xl backdrop-blur-sm shadow-lg inline-block">
                <p className="font-medium">Aponte a câmera para o</p>
                <p className="text-amber-400 font-bold">QR Code da figurinha</p>
            </div>
         </div>

         {error && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-xl shadow-lg whitespace-nowrap">
               {error}
            </div>
         )}
      </div>
    </div>
  );
}
