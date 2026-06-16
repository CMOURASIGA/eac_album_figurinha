import { supabase } from './supabase';
import type { Sticker, Encounter } from './store';

export async function syncLocalStickers(localStickers: Sticker[], encounters: Encounter[]) {
  if (!localStickers || localStickers.length === 0) return;

  const localIds = localStickers.map(s => s.id);

  // Check which ones exist
  const { data: existing, error } = await supabase
    .from('figurinha')
    .select('id')
    .in('id', localIds);

  if (error) {
     console.error("Error reading figurinhas for sync:", error);
     return;
  }

  const existingIds = new Set(existing?.map(e => e.id) || []);

  const toUpload = localStickers.filter(s => !existingIds.has(s.id));

  for (const sticker of toUpload) {
    // Determine the encounter_id
    // If it was a Nucleo or Momento that has no encounter, or if the encounter was deleted, set it to null
    let encounter_id = sticker.encounterId;
    if (sticker.isNucleo || sticker.rarity === 'MOMENTO') {
       encounter_id = null; // or empty depending on logic.
    }
    if (encounter_id) {
       // Validate against loaded encounters
       if (!encounters.some(e => e.id === encounter_id)) {
          console.warn("Invalid encounter ID during sync. Setting to null.");
          encounter_id = null;
       }
    }

    const payload = {
        id: sticker.id, // preserve the local UUID!
        nome: sticker.name.toUpperCase(),
        encontro_id: encounter_id || null,
        foto_url: sticker.photoUrl,
        texto_inferior: sticker.bottomText,
    };
    
    try {
        await supabase.from('figurinha').insert(payload);
        console.log("Synced old sticker to database:", sticker.id);
    } catch (e) {
        console.error("Failed to sync old sticker", sticker.id, e);
    }
  }
}
