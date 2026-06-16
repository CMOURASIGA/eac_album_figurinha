import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Encounter {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Sticker {
  id: string;
  requestId: string;
  name: string;
  photoUrl: string;
  bottomText: string;
  isNucleo: boolean;
  encounterId: string;
  rarity: 'COMUM' | 'ESPECIAL';
  page: number; // Album page (max 7 per page)
  position: number; // 1-7
}

interface AppState {
  encounters: Encounter[];
  stickers: Sticker[];
  
  // Actions
  addEncounter: (id: string, name: string) => void;
  updateEncounterLogo: (id: string, logoUrl: string) => void;
  deleteSticker: (id: string) => void;
  reorderSticker: (id: string, newPage: number, newPosition: number) => void;
  saveSharedSticker: (sticker: Sticker) => void;
  resetStore: () => void;
  setEncounters: (encounters: Encounter[]) => void;
}

const initialEncounters: Encounter[] = [];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      encounters: initialEncounters,
      stickers: [],

      addEncounter: (id, name) => {
        const newEncounter = {
          id,
          name,
        };
        set((state) => ({ encounters: [...state.encounters, newEncounter] }));
      },
      
      updateEncounterLogo: (id, logoUrl) => {
        set((state) => ({
          encounters: state.encounters.map(e => 
            e.id === id ? { ...e, logoUrl } : e
          )
        }));
      },

      deleteSticker: (id) => {
        set((state) => ({
          stickers: state.stickers.filter(s => s.id !== id)
        }));
      },
      
      reorderSticker: (id, newPage, newPosition) => {
         set((state) => ({
            stickers: state.stickers.map(s => s.id === id ? { ...s, page: newPage, position: newPosition } : s)
         }));
      },

      saveSharedSticker: (sticker) => {
        set((state) => {
          // Check if already have it
          if (state.stickers.some(s => s.id === sticker.id)) return state;

          const existingStickers = state.stickers.filter(s => s.isNucleo === sticker.isNucleo);
          
          let targetPage = 1;
          let targetPos = 1;
          
          while (true) {
            const stickersOnPage = existingStickers.filter(s => s.page === targetPage);
            if (stickersOnPage.length < 7) {
              const positions = stickersOnPage.map(s => s.position);
              for (let i = 1; i <= 7; i++) {
                if (!positions.includes(i)) {
                  targetPos = i;
                  break;
                }
              }
              break;
            }
            targetPage++;
          }

          const newSticker = {
            ...sticker,
            page: targetPage,
            position: targetPos
          };

          return {
            stickers: [...state.stickers, newSticker]
          };
        });
      },

      resetStore: () => set({ stickers: [] }),
      setEncounters: (encounters) => set({ encounters }),
    }),
    {
      name: 'eac-album-storage',
      partialize: (state) => ({ stickers: state.stickers }),
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          stickers: persistedState?.stickers || [],
        };
      },
    }
  )
);
