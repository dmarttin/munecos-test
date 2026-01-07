"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Experience } from "./Experience";
import { RoomiePicker } from "./UI/RoomiePicker";
import { useGameStore } from "@/store/useGameStore";
import { ErrorBoundary } from "./ErrorBoundary";

export default function Scene() {
  const loadCatalog = useGameStore((state) => state.loadCatalog);
  const catalogLoading = useGameStore((state) => state.catalogLoading);
  const catalogError = useGameStore((state) => state.catalogError);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // Show error state if catalog fails to load
  if (catalogError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Failed to Load Catalog
            </h2>
            <p className="text-gray-600 mb-6">{catalogError}</p>
            <button
              onClick={() => loadCatalog()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
        {catalogLoading === 'success' && <RoomiePicker />}
      </div>
    </ErrorBoundary>
  );
}

