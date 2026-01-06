"use client";

import { useRef } from "react";
import * as THREE from "three";

export function Ground() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      name="ground"
    >
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}
