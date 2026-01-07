import { create } from "zustand";
import { RoomieData, RoomieInstance, LoadingState, AssetError } from "@/types/roomie";

interface GameState {
  catalog: RoomieData[];
  instances: RoomieInstance[];
  selectedInstanceId: string | null;
  isDragging: boolean;

  // Loading and error states
  catalogLoading: LoadingState;
  catalogError: string | null;
  assetLoadingStates: Map<string, LoadingState>;
  assetErrors: AssetError[];

  // Actions
  setCatalog: (catalog: RoomieData[]) => void;
  loadCatalog: () => Promise<void>;
  spawnRoomie: (roomieId: string, position?: [number, number, number]) => void;
  removeRoomie: (instanceId: string) => void;
  selectInstance: (instanceId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  updatePosition: (instanceId: string, position: [number, number, number]) => void;
  resetAll: () => void;

  // Asset loading actions
  setAssetLoadingState: (roomieId: string, state: LoadingState) => void;
  addAssetError: (error: AssetError) => void;
  clearAssetError: (roomieId: string) => void;
}

let instanceCounter = 0;

export const useGameStore = create<GameState>((set, get) => ({
  catalog: [],
  instances: [],
  selectedInstanceId: null,
  isDragging: false,
  catalogLoading: 'idle',
  catalogError: null,
  assetLoadingStates: new Map(),
  assetErrors: [],

  setCatalog: (catalog) => set({ catalog, catalogLoading: 'success', catalogError: null }),

  loadCatalog: async () => {
    set({ catalogLoading: 'loading', catalogError: null });

    try {
      const response = await fetch("/catalog.json");

      if (!response.ok) {
        throw new Error(`Failed to load catalog: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.roomies || !Array.isArray(data.roomies)) {
        throw new Error("Invalid catalog format");
      }

      set({
        catalog: data.roomies,
        catalogLoading: 'success',
        catalogError: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error loading catalog";
      set({
        catalogLoading: 'error',
        catalogError: errorMessage
      });
      console.error("Error loading catalog:", error);
    }
  },

  spawnRoomie: (roomieId, position = [0, 0, 0]) =>
    set((state) => ({
      instances: [
        ...state.instances,
        {
          instanceId: `instance-${++instanceCounter}`,
          roomieId,
          position,
        },
      ],
    })),

  removeRoomie: (instanceId) =>
    set((state) => ({
      instances: state.instances.filter((i) => i.instanceId !== instanceId),
      selectedInstanceId:
        state.selectedInstanceId === instanceId ? null : state.selectedInstanceId,
    })),

  selectInstance: (instanceId) => set({ selectedInstanceId: instanceId }),

  setDragging: (isDragging) => set({ isDragging }),

  updatePosition: (instanceId, position) =>
    set((state) => ({
      instances: state.instances.map((i) =>
        i.instanceId === instanceId ? { ...i, position } : i
      ),
    })),

  resetAll: () =>
    set({
      instances: [],
      selectedInstanceId: null,
      isDragging: false,
    }),

  setAssetLoadingState: (roomieId, state) =>
    set((prevState) => {
      const newMap = new Map(prevState.assetLoadingStates);
      newMap.set(roomieId, state);
      return { assetLoadingStates: newMap };
    }),

  addAssetError: (error) =>
    set((state) => ({
      assetErrors: [...state.assetErrors, error],
    })),

  clearAssetError: (roomieId) =>
    set((state) => ({
      assetErrors: state.assetErrors.filter((e) => e.roomieId !== roomieId),
    })),
}));

