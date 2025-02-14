"use client";

import { MainLayout } from "@/layouts";
import { Trailer, Characters, News, Features } from "../_components";

export const HomeViews = () => {
  return (
    <MainLayout>
      <div className="bg-zinc-900 overflow-hidden pb-20">
        <Trailer />
        <div className="relative px-4 h-full max-lg:top-[70px]">
          <News />
          <Features />
          <Characters />
        </div>
      </div>
    </MainLayout>
  );
};
