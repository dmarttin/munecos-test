export interface RoomieData {
  id: string;
  name: string;
  spriteUrl: string;
  modelUrl?: string; // Future: .glb path for 3D models
  scale: number;
}

export interface RoomieInstance {
  instanceId: string;
  roomieId: string;
  position: [number, number, number];
}

export interface CatalogData {
  roomies: RoomieData[];
}
