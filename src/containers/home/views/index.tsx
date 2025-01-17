import { MainLayout } from "@/layouts";
import { Trailer } from "../_components/trailer";
import { Characters } from "../_components/characters";
import { News } from "../_components/news";

export const HomeViews = () => {
  return (
    <MainLayout>
      <div className="flex-1  bg-zinc-900 overflow-x-hidden">
        <Trailer />
        <div className="relative z-1 px-4 h-full">
          <News />
          <Characters />
        </div>
      </div>
    </MainLayout>
  );
};
