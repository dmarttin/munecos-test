"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-sky-200 flex items-center justify-center">
      <p className="text-sky-800 text-xl">Loading Roomies...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-screen relative overflow-hidden">
      <Scene />
    </main>
  );
}
