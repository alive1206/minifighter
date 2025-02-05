"use client";

import { TRAILER } from "@public/index";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const Trailer = () => {
  const router = useRouter();
  return (
    <div className="relative h-[50.25vw] max-lg:hidden bg-zinc-900">
      <video
        className="w-full h-[50.25vw] object-cover brightness-[60%]"
        autoPlay
        muted
        loop
        src={TRAILER}
      />
      <div className="absolute bottom-[25%] ml-8 w-[40%] max-lg:bottom-[10%]">
        <p className="text-white text-5xl h-full font-bold drop-shadow-xl mb-2">
          Mini Fighter
        </p>
        <p className="text-white text-sm mb-2 bg-gradient-to-b from-transparent">
          A 2-D sidescrolling fighter from Marvel Quest and CJ Internet with
          anime style graphics. Gameplay combined elements from MMOs,
          traditional fighting games, and card games.
        </p>
        <button
          className="bg-white text-black rounded-md py-2 px-4 flex justify-center gap-1 transition-all animate-bounce hover:bg-orange-500 items-center uppercase font-bold"
          onClick={() => router.push("/download")}
        >
          <Play width={16} height={16} fill="black" />
          Play
        </button>
      </div>
    </div>
  );
};
