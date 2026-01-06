"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Experience } from "./Experience";
import { RoomiePicker } from "./UI/RoomiePicker";
import { useGameStore } from "@/store/useGameStore";
import { CatalogData } from "@/types/roomie";

export default function Scene() {
  const setCatalog = useGameStore((state) => state.setCatalog);

  useEffect(() => {
    fetch("/catalog.json")
      .then((res) => res.json())
      .then((data: CatalogData) => {
        setCatalog(data.roomies);
      });
  }, [setCatalog]);

  return (
    <div className="w-full h-full relative">
      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/background.png)" }}
      />

      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        camera={{
          position: [0, 8, 10],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>

      {/* UI Layer */}
      <RoomiePicker />
    </div>
  );
}
