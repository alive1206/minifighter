import { ImageSlider } from "@/components";
import {
  FEATURE1,
  FEATURE2,
  FEATURE3,
  FEATURE4,
  FEATURE5,
} from "@public/index";
import { useMemo } from "react";

export const Features = () => {
  const imgList = useMemo(
    () => [
      { key: "1", url: FEATURE1 },
      { key: "2", url: FEATURE2 },
      { key: "3", url: FEATURE3 },
      { key: "4", url: FEATURE4 },
      { key: "5", url: FEATURE5 },
    ],
    []
  );
  return (
    <div className="mt-6">
      <h3
        className="text-white text-center uppercase font-bold text-4xl mb-6"
        style={{ textShadow: "1px 1px 2px pink" }}
      >
        <span className="border-b-[3px] border-orange-500">Features</span>
      </h3>
      <div>
        <ImageSlider items={imgList} />
      </div>
    </div>
  );
};
