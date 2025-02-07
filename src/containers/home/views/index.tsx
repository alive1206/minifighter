"use client";

import { MainLayout } from "@/layouts";
import { Trailer, Characters, News, Features } from "../_components";

export const HomeViews = () => {
  return (
    <MainLayout>
      <div className="bg-zinc-900 overflow-hidden pb-16">
        <Trailer />
        <div className="relative z-1 px-4 h-full max-md:top-[72px]">
          <News />
          <Features />
          <Characters />
        </div>
      </div>
    </MainLayout>
  );
};
