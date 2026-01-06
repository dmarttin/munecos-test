import { create } from "zustand";
import { RoomieData, RoomieInstance } from "@/types/roomie";

interface GameState {
  catalog: RoomieData[];
  instances: RoomieInstance[];
  selectedInstanceId: string | null;
  isDragging: boolean;

  // Actions
  setCatalog: (catalog: RoomieData[]) => void;
  spawnRoomie: (roomieId: string, position?: [number, number, number]) => void;
  removeRoomie: (instanceId: string) => void;
  selectInstance: (instanceId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  updatePosition: (instanceId: string, position: [number, number, number]) => void;
  resetAll: () => void;
}

let instanceCounter = 0;

export const useGameStore = create<GameState>((set) => ({
  catalog: [],
  instances: [],
  selectedInstanceId: null,
  isDragging: false,

  setCatalog: (catalog) => set({ catalog }),

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
}));
