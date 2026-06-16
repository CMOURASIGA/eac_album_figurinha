import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { CheckCircle, XCircle, Trash2, Settings, ListPlus, Users, Loader2, ArrowLeft } from 'lucide-react';
import { StickerItem } from '../components/StickerItem';
import { supabase } from '../lib/supabase';

export function Admin() {
  const navigate = useNavigate();
  const { 
    encounters, 
    stickers, 
    addEncounter, 
    updateEncounterLogo,
    deleteSticker,
    resetStore
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => sessionStorage.getItem('adminAuth') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'stickers' | 'encounters'>('stickers');
  const [newEncounterName, setNewEncounterName] = useState('');
  const [editingEncounterId, setEditingEncounterId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'Luc@sM0ur@') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const handleAddEncounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEncounterName.trim()) return;

    try {
      const { data, error } = await supabase.from('encontros').insert({
        nome: newEncounterName.trim(),
        status: 'PLANEJADO'
      }).select().single();

      if (error) throw error;

      addEncounter(data.id, newEncounterName.trim());
      setNewEncounterName('');
    } catch (err) {
      console.error("Erro ao adicionar encontro:", err);
      alert("Erro ao adicionar encontro no banco de dados.");
    }
  };

  const startEditingLogo = (encId: string, currentUrl?: string) => {
    setEditingEncounterId(encId);
    setEditingUrl(currentUrl || '');
  };

  const saveLogo = (encId: string) => {
    let finalUrl = editingUrl.trim();
    
    // Convert base Imgur links (e.g. imgur.com/XXXXX) to direct image links
    if (finalUrl.includes('imgur.com') && !finalUrl.includes('i.imgur.com') && !finalUrl.match(/\.(jpeg|jpg|gif|png)$/i)) {
      const urlParts = finalUrl.split('/');
      const idPart = urlParts[urlParts.length - 1];
      finalUrl = `https://i.imgur.com/${idPart}.png`;
    }

    updateEncounterLogo(encId, finalUrl);
    setEditingEncounterId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center pb-32 relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-gray-600 hover:text-emerald-600 flex items-center gap-2 font-medium bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Home
        </button>
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 inline-block pb-2">Acesso Admin</h1>
            <p className="text-gray-500 mt-2">Área restrita</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            
            {loginError && <p className="text-sm text-red-600 font-medium">{loginError}</p>}
            
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-md transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-emerald-600 flex items-center gap-2 font-medium bg-white px-4 py-2 rounded-lg shadow-sm w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Home
        </button>
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">Painel Administrativo</h1>
              <p className="text-gray-500 mt-1 pl-4">Gerencie as figurinhas do álbum digital</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl border-b flex overflow-x-auto shadow-sm">
          <button 
            onClick={() => setActiveTab('stickers')}
            className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'stickers' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings className="h-5 w-5" />
            Gerenciar Figurinhas
          </button>
          <button 
            onClick={() => setActiveTab('encounters')}
            className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'encounters' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ListPlus className="h-5 w-5" />
            Encontros (EACs)
          </button>
        </div>

        <div className="bg-white p-4 sm:p-6 shadow-sm rounded-b-xl min-h-[500px]">
          
          {/* Tab: Stickers */}
          {activeTab === 'stickers' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Figurinhas Ativas no Álbum</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Total: {stickers.length}</span>
                  <button 
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja limpar todo o álbum local? Figurinhas no banco de dados não serão deletadas.')) {
                        resetStore();
                      }
                    }}
                    className="font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100 whitespace-nowrap"
                  >
                    Limpar Dados Locais
                  </button>
                </div>
              </div>
              
               {stickers.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
                  Nenhuma figurinha ativa no álbum.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {stickers.map(sticker => (
                    <div key={sticker.id} className="relative group">
                       <StickerItem sticker={sticker} className="pointer-events-none" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-xl">
                          <span className="text-white text-xs px-2 text-center bg-black/80 rounded block">Pag {sticker.page} / Pos {sticker.position}</span>
                          <button 
                            onClick={() => deleteSticker(sticker.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-medium"
                          >
                            <Trash2 className="h-4 w-4" /> Excluir
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Encounters */}
          {activeTab === 'encounters' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Gerenciar Encontros</h2>
              
              <form onSubmit={handleAddEncounter} className="flex flex-col sm:flex-row gap-2 mb-8">
                <input 
                  type="text" 
                  value={newEncounterName}
                  onChange={(e) => setNewEncounterName(e.target.value)}
                  placeholder="Novo Encontro (ex: EAC 37)"
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  type="submit"
                  disabled={!newEncounterName.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 sm:w-auto w-full"
                >
                  Adicionar
                </button>
              </form>

              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700 w-16">ID</th>
                      <th className="px-4 py-3 font-medium text-gray-700 w-16">Logo</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Nome do Encontro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {encounters.map(enc => (
                      <tr key={enc.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500 font-mono text-sm">{enc.id}</td>
                        <td className="px-4 py-3">
                           {enc.logoUrl ? (
                             <img src={enc.logoUrl} referrerPolicy="no-referrer" alt="Logo" className="h-8 w-8 object-contain rounded" />
                           ) : (
                             <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center text-[8px] text-gray-500 text-center">Sem Logo</div>
                           )}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {editingEncounterId === enc.id ? (
                            <div className="flex flex-col sm:flex-row gap-2 w-full mt-2 sm:mt-0">
                              <input
                                type="url"
                                value={editingUrl}
                                onChange={(e) => setEditingUrl(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 w-full font-normal"
                                placeholder="https://..."
                                autoFocus
                              />
                              <div className="flex gap-1 shrink-0">
                                <button
                                   onClick={() => saveLogo(enc.id)}
                                   className="bg-emerald-600 text-white px-3 py-1 rounded text-sm shrink-0"
                                >
                                  Salvar
                                </button>
                                <button
                                   onClick={() => setEditingEncounterId(null)}
                                   className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm shrink-0"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center w-full gap-2">
                               <span>{enc.name}</span>
                               <button 
                                 onClick={() => startEditingLogo(enc.id, enc.logoUrl)}
                                 className="cursor-pointer text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded hover:bg-emerald-100 font-medium shrink-0 transition-colors"
                               >
                                  Editar Logo
                               </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
