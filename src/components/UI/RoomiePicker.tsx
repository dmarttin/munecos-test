"use client";

import { useState } from "react";
import Image from "next/image";
import { useGameStore } from "@/store/useGameStore";

export function RoomiePicker() {
  const catalog = useGameStore((state) => state.catalog);
  const instances = useGameStore((state) => state.instances);
  const spawnRoomie = useGameStore((state) => state.spawnRoomie);
  const resetAll = useGameStore((state) => state.resetAll);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);

  const handleSpawn = (roomieId: string) => {
    // Random position within bounds
    const x = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 6;
    spawnRoomie(roomieId, [x, 0.8, z]);
  };

  const handleRoomieClick = (roomieId: string) => {
    setSelectedCatalogId(roomieId);
    handleSpawn(roomieId);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
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
                  className={`
                    relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-200
                    hover:scale-110 hover:shadow-md active:scale-95
                    ${selectedCatalogId === roomie.id ? "ring-2 ring-yellow-400 ring-offset-2" : ""}
                  `}
                  title={`Spawn ${roomie.name}`}
                >
                  <Image
                    src={roomie.spriteUrl}
                    alt={roomie.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gray-300" />

            {/* Reset button */}
            <button
              onClick={resetAll}
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
    </div>
  );
}
