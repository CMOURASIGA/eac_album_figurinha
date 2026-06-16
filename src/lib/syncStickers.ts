import { supabase } from './supabase';
import { useStore } from './store';
import type { Sticker, Encounter } from './store';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function syncLocalStickers(localStickers: Sticker[], encounters: Encounter[]) {
  if (!localStickers || localStickers.length === 0) return;

  const validUuids = localStickers.map(s => s.id).filter(id => uuidPattern.test(id));
  
  let existingIds = new Set<string>();

  if (validUuids.length > 0) {
      const { data: existing, error } = await supabase
        .from('figurinha')
        .select('id')
        .in('id', validUuids);

      if (error) {
         console.error("Error reading figurinhas for sync:", error);
         return;
      }
      existingIds = new Set(existing?.map(e => e.id) || []);
  }

  const toUpload = localStickers.filter(s => {
      // Upar se não for UUID válido, ou se for mas não estiver no banco
      return !uuidPattern.test(s.id) || !existingIds.has(s.id);
  });

  for (const sticker of toUpload) {
    let encounter_id = sticker.encounterId;
    if (sticker.isNucleo || sticker.rarity === 'MOMENTO') {
       encounter_id = null;
    }
    if (encounter_id) {
       if (!encounters.some(e => e.id === encounter_id)) {
          encounter_id = null;
       }
    }

    const payload: any = {
        nome: sticker.name.toUpperCase(),
        encontro_id: encounter_id || null,
        foto_url: sticker.photoUrl,
        texto_inferior: sticker.bottomText,
    };
    
    const isOldId = !uuidPattern.test(sticker.id);
    if (!isOldId) {
        payload.id = sticker.id;
    }

    try {
        const { data, error } = await supabase.from('figurinha').insert(payload).select('id').single();
        if (error) throw error;
        
        console.log("Synced sticker to database. Prev ID:", sticker.id, "New ID:", data.id);
        
        if (isOldId) {
            // Atualiza o store com o UUID novo que o banco gerou,
            // assim o componente vai gerar a URL /figurinha/<novo_id> 
            // no QR Code, e outras pessoas conseguirão visualizar!
            useStore.setState((state) => ({
                stickers: state.stickers.map(s => s.id === sticker.id ? { ...s, id: data.id } : s)
            }));
        }
    } catch (e) {
        console.error("Failed to sync sticker", sticker.id, e);
    }
  }
}
