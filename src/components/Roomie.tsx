"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";
import { RoomieData } from "@/types/roomie";

interface RoomieProps {
  instanceId: string;
  data: RoomieData;
  position: [number, number, number];
}

// Boundary constraints for the island
const BOUNDS = {
  minX: -4,
  maxX: 4,
  minZ: -4,
  maxZ: 4,
};

export function Roomie({ instanceId, data, position }: RoomieProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPosition = useRef(new THREE.Vector3(...position));
  const [isHovered, setIsHovered] = useState(false);
  const [spawnScale, setSpawnScale] = useState(0);

  const { camera, raycaster, pointer, scene } = useThree();

  const selectedInstanceId = useGameStore((state) => state.selectedInstanceId);
  const isDragging = useGameStore((state) => state.isDragging);
  const selectInstance = useGameStore((state) => state.selectInstance);
  const setDragging = useGameStore((state) => state.setDragging);
  const updatePosition = useGameStore((state) => state.updatePosition);

  const isSelected = selectedInstanceId === instanceId;

  // Load texture with error handling
  const [textureUrl, setTextureUrl] = useState(data.spriteUrl);
  const [hasError, setHasError] = useState(false);

  let texture;
  try {
    texture = useTexture(textureUrl);
  } catch (error) {
    // If texture fails to load, use placeholder
    if (!hasError) {
      console.error(`Failed to load texture for ${data.name}:`, error);
      setHasError(true);
      setTextureUrl("/roomies/placeholder.png");
    }
    texture = useTexture("/roomies/placeholder.png");
  }


  // Spawn animation
  useEffect(() => {
    setSpawnScale(0);
    const timeout = setTimeout(() => setSpawnScale(1), 50);
    return () => clearTimeout(timeout);
  }, []);

  // Smooth movement and scale animation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth position interpolation
    groupRef.current.position.lerp(targetPosition.current, 0.15);

    // Spawn scale animation
    const currentScale = groupRef.current.scale.x;
    const targetScale = spawnScale * data.scale;
    if (Math.abs(currentScale - targetScale) > 0.01) {
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.2);
      groupRef.current.scale.setScalar(newScale);
    }

    // Subtle bounce when selected
    if (isSelected && !isDragging) {
      const bounce = Math.sin(state.clock.elapsedTime * 3) * 0.05;
      groupRef.current.position.y = targetPosition.current.y + bounce;
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    selectInstance(instanceId);
    setDragging(true);
  };

  const handlePointerUp = () => {
    setDragging(false);
    // Update store with final position
    if (groupRef.current) {
      updatePosition(instanceId, [
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z,
      ]);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isSelected || !isDragging) return;

    // Raycast to ground plane
    raycaster.setFromCamera(pointer, camera);
    const ground = scene.getObjectByName("ground");
    if (!ground) return;

    const intersects = raycaster.intersectObject(ground);
    if (intersects.length > 0) {
      const point = intersects[0].point;

      // Clamp to bounds
      const clampedX = THREE.MathUtils.clamp(point.x, BOUNDS.minX, BOUNDS.maxX);
      const clampedZ = THREE.MathUtils.clamp(point.z, BOUNDS.minZ, BOUNDS.maxZ);

      targetPosition.current.set(clampedX, 0.8, clampedZ);
    }
  };

  // Calculate sprite dimensions (maintain aspect ratio)
  const aspectRatio = texture.image
    ? texture.image.width / texture.image.height
    : 1;
  const height = 2.5;
  const width = height * aspectRatio;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {/* Shadow under the roomie */}
        <mesh position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Main sprite */}
        <sprite scale={[width, height, 1]}>
          <spriteMaterial
            map={texture}
            transparent
            alphaTest={0.1}
          />
        </sprite>

        {/* Selection/hover indicator */}
        {(isSelected || isHovered) && (
          <mesh position={[0, -0.7, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.7, 0.85, 32]} />
            <meshBasicMaterial
              color={isSelected ? "#FFD700" : "#FFFFFF"}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}
      </Billboard>
    </group>
  );
}
