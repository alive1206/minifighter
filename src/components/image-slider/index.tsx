"use client";

import { classNames } from "@/utils";
import { map } from "lodash";
import { useEffect, useRef, useState } from "react";

type Item = {
  key: string;
  url: string;
};

type Props = {
  items: Item[];
};

export const ImageSlider: React.FC<Props> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const width = sliderRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    }
  };

  const handleScrollTo = (index: number) => {
    if (sliderRef.current) {
      const width = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: index * width,
        behavior: "smooth",
      });
    }
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    handleScrollTo(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = prevIndex === items.length - 1 ? 0 : prevIndex + 1;
        handleScrollTo(nextIndex);
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex, items.length]);

  return (
    <div className="w-full p-[2px]">
      <div className="relative max-w-3xl my-0 mx-auto">
        <div
          ref={sliderRef}
          className="flex aspect-video snap-x snap-mandatory scroll-smooth shadow-md rounded-lg overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
          onScroll={handleScroll}
        >
          {map(items, (item, _index) => (
            <img
              className="object-cover snap-start transition-all"
              key={item.key}
              id={`${_index}`}
              src={item.url}
              alt=""
              style={{ flex: "1 0 100%" }}
            />
          ))}
        </div>
        <div className="flex absolute gap-1 bottom-5 left-1/2 translate-x-[-50%] z-10">
          {map(items, (item, _index) => (
            <div
              className={classNames(
                `w-4 h-4 rounded-[50%] bg-white opacity-75 transition-opacity ease duration-200 hover:opacity-100 hover:bg-orange-500 cursor-pointer`,
                activeIndex === _index ? "opacity-100 bg-orange-500" : ""
              )}
              key={item.key}
              onClick={() => handleDotClick(_index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
