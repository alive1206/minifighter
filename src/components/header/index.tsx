"use client";

import { LOGO_HEADER } from "@public/index";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumnDecreasing,
  Download,
  Home,
  Newspaper,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TOP_OFFSET } from "@/utils";

export const Header = () => {
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const pathname = usePathname();
  const linkClassName =
    "rounded-lg p-2 text-white text-[12px] flex items-center transition-all hover:text-orange-500 ";
  const logoClassName = "mr-1 text-[12px]";

  useEffect(() => {
    const handleScroll = () => {
      typeof window !== "undefined" && window.scrollY >= TOP_OFFSET
        ? setShowBackground(true)
        : setShowBackground(false);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="w-full fixed top-0 z-40 ">
      <div
        className={`flex w-full px-4  py-1 items-center justify-between transition duration-500 ${
          showBackground ? "bg-zinc-900 bg-opacity-90" : ""
        }`}
      >
        <Link href="/">
          <img className="h-16 w-36" src={LOGO_HEADER} alt="" />
        </Link>
        <ul className="flex gap-8">
          <li>
            <Link
              className={`${linkClassName} ${
                pathname === "/" && "!text-orange-500 "
              }`}
              href="/"
              title="Home Page"
            >
              <Home className={logoClassName} />
              Home
            </Link>
          </li>
          <li>
            <Link
              className={`${linkClassName} ${
                pathname === "/news" && "!text-orange-500 "
              }`}
              href="/news"
              title="News Page"
            >
              <Newspaper className={logoClassName} />
              News
            </Link>
          </li>
          <li>
            <Link
              className={`${linkClassName} ${
                pathname === "/ranking" && "!text-orange-500 "
              }`}
              href="/ranking"
              title="Ranking Page"
            >
              <ChartColumnDecreasing className={logoClassName} />
              Ranking
            </Link>
          </li>
          <li>
            <Link
              className={`${linkClassName} ${
                pathname === "/download" && "!text-orange-500 "
              }`}
              href="/download"
              title="Download Page"
            >
              <Download className={logoClassName} />
              Download
            </Link>
          </li>
          <li>
            <Link
              className={`${linkClassName} ${
                pathname === "/shop" && "!text-orange-500 "
              }`}
              href="/shop"
              title="Shop Page"
            >
              <Store className={logoClassName} />
              Shop
            </Link>
          </li>
        </ul>
        <div className="flex gap-3 items-center"></div>
      </div>
    </div>
  );
};
