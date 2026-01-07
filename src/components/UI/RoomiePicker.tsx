"use client";

import { useState } from "react";
import Image from "next/image";
import { useGameStore } from "@/store/useGameStore";
import { LoadingIndicator } from "./LoadingIndicator";

export function RoomiePicker() {
  const catalog = useGameStore((state) => state.catalog);
  const instances = useGameStore((state) => state.instances);
  const catalogLoading = useGameStore((state) => state.catalogLoading);
  const spawnRoomie = useGameStore((state) => state.spawnRoomie);
  const resetAll = useGameStore((state) => state.resetAll);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hoveredRoomie, setHoveredRoomie] = useState<string | null>(null);

  const handleSpawn = (roomieId: string) => {
    // Random position within bounds
    const x = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 6;
    spawnRoomie(roomieId, [x, 0.8, z]);
  };

  const handleRoomieClick = (roomieId: string) => {
    setSelectedCatalogId(roomieId);
    handleSpawn(roomieId);
    // Clear selection after a brief moment
    setTimeout(() => setSelectedCatalogId(null), 300);
  };

  const handleResetClick = () => {
    if (instances.length > 0) {
      setShowResetConfirm(true);
    }
  };

  const confirmReset = () => {
    resetAll();
    setShowResetConfirm(false);
  };

  const hoveredRoomieData = hoveredRoomie
    ? catalog.find(r => r.id === hoveredRoomie)
    : null;

  if (catalogLoading === 'loading') {
    return (
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="flex justify-center pb-6 px-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 pointer-events-auto">
            <LoadingIndicator size="md" />
            <p className="text-sm text-gray-600 mt-2">Loading Roomies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
      {/* Tooltip */}
      {hoveredRoomieData && (
        <div className="flex justify-center pb-2 px-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-2 pointer-events-none max-w-xs">
            <p className="text-white font-semibold text-sm">{hoveredRoomieData.name}</p>
            {hoveredRoomieData.description && (
              <p className="text-gray-300 text-xs mt-1">{hoveredRoomieData.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="flex justify-center pb-6 px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-3 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Roomie thumbnails */}
            <div className="flex gap-2">
              {catalog.map((roomie) => (
                <button
                  key={roomie.id}
                  onClick={() => handleRoomieClick(roomie.id)}
                  onMouseEnter={() => setHoveredRoomie(roomie.id)}
                  onMouseLeave={() => setHoveredRoomie(null)}
                  className={`
                    relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-200
                    hover:scale-110 hover:shadow-md active:scale-95
                    ${selectedCatalogId === roomie.id ? "ring-2 ring-yellow-400 ring-offset-2 scale-95" : ""}
                  `}
                  title={roomie.name}
                >
                  <Image
                    src={roomie.spriteUrl}
                    alt={roomie.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                    onError={(e) => {
                      // Fallback to placeholder on error
                      const target = e.target as HTMLImageElement;
                      target.src = "/roomies/placeholder.png";
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gray-300" />

            {/* Reset button */}
            <button
              onClick={handleResetClick}
              disabled={instances.length === 0}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${instances.length > 0
                  ? "bg-red-500 text-white hover:bg-red-600 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Reset
            </button>
          </div>

          {/* Counter */}
          {instances.length > 0 && (
            <div className="text-center mt-2 text-sm text-gray-500">
              {instances.length} Roomie{instances.length !== 1 ? "s" : ""} on screen
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Reset Scene?</h3>
            <p className="text-gray-600 mb-6">
              This will remove all {instances.length} Roomie{instances.length !== 1 ? "s" : ""} from the scene.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
