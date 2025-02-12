import { MainLayout } from "@/layouts";
import { COMING_SOON } from "@public/index";
import { Image } from "antd";

export const DownloadViews = () => {
  return (
    <MainLayout>
      <div className="w-full h-full flex justify-center items-center flex-col">
        <Image
          width={150}
          height={150}
          src={COMING_SOON}
          alt="under-construction"
          preview={false}
        />
        <div className="border  rounded-lg p-2 text-white uppercase text-center">
          <div className="text-6xl">Coming Soon</div>
          <div className="text-xl text-gray-100">Stay tunned</div>
        </div>
      </div>
    </MainLayout>
  );
};
