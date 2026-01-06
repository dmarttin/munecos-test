"use client";

import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";
import { Roomie } from "./Roomie";
import { Ground } from "./Ground";

export function Experience() {
  const instances = useGameStore((state) => state.instances);
  const catalog = useGameStore((state) => state.catalog);

  // Get roomie data by id
  const getRoomieData = (roomieId: string) =>
    catalog.find((r) => r.id === roomieId);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Invisible ground plane for raycasting */}
      <Ground />

      {/* Render all Roomie instances */}
      {instances.map((instance) => {
        const roomieData = getRoomieData(instance.roomieId);
        if (!roomieData) return null;
        return (
          <Roomie
            key={instance.instanceId}
            instanceId={instance.instanceId}
            data={roomieData}
            position={instance.position}
          />
        );
      })}
    </>
  );
}
