export interface RoomieData {
  id: string;
  name: string;
  description?: string;
  spriteUrl: string;
  thumbnail?: string; // Optional smaller thumbnail for UI
  modelUrl?: string; // Future: .glb path for 3D models
  scale: number;
  tags?: string[]; // For categorization/filtering
}

export interface RoomieInstance {
  instanceId: string;
  roomieId: string;
  position: [number, number, number];
}

export interface CatalogData {
  version?: string; // For future migration support
  roomies: RoomieData[];
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AssetLoadingState {
  roomieId: string;
  state: LoadingState;
  error?: string;
}

export interface AssetError {
  roomieId: string;
  assetType: 'sprite' | 'model' | 'thumbnail';
  error: Error;
  timestamp: number;
}
