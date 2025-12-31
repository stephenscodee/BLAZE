import { create } from 'zustand';
import blazeApi from '../api/blazeApi';
import { io } from 'socket.io-client';
import { useAuthStore } from './authStore';

interface GenerationState {
  generations: any[];
  activeGenerationId: string | null;
  isGenerating: boolean;
  initSocket: () => void;
  createGeneration: (data: { prompt: string; stylePreset: string; projectId: string }) => Promise<void>;
  setGenerations: (generations: any[]) => void;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  generations: [],
  activeGenerationId: null,
  isGenerating: false,

  initSocket: () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const socket = io('http://localhost:3000', {
      auth: { token },
    });

    socket.on('generation_update', (data) => {
      console.log('Received WebSocket update:', data);
      const { generations } = get();
      
      // Update the Specific generation in the list
      const updated = generations.map(g => 
        g.id === data.generationId ? { ...g, ...data } : g
      );

      set({ 
        generations: updated,
        isGenerating: data.status !== 'COMPLETED' && data.status !== 'FAILED'
      });
    });
  },

  createGeneration: async (data) => {
    set({ isGenerating: true });
    try {
      const response = await blazeApi.post('/generations', data);
      set((state) => ({
        generations: [response.data, ...state.generations],
        activeGenerationId: response.data.id,
      }));
    } catch (error) {
      set({ isGenerating: false });
      console.error('Generation failed:', error);
    }
  },

  setGenerations: (generations) => set({ generations }),
}));
