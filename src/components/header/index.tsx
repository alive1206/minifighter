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
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TOP_OFFSET } from "@/utils";

export const Header = () => {
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const pathname = usePathname();
  const linkClassName =
    " p-2 text-white text-[12px] flex items-center transition-all hover:text-orange-500 ";

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

  const menuItems = [
    { href: "/", label: "Home ", icon: <Home /> },
    {
      href: "/news",
      label: "News",
      icon: <Newspaper />,
    },
    {
      href: "/ranking",
      label: "Ranking",
      icon: <ChartColumnDecreasing />,
    },
    {
      href: "/download",
      label: "Download",
      icon: <Download />,
    },
    {
      href: "/shop",
      label: "Shop",
      icon: <Store />,
    },
  ];

  return (
    <div className="w-full fixed top-0 z-40">
      <div
        className={`flex w-full px-4 py-1 items-center justify-between transition duration-500 ${
          showBackground ? "bg-zinc-900 bg-opacity-90" : ""
        }`}
      >
        <Link href="/">
          <img className="h-16 w-36" src={LOGO_HEADER} alt="Logo" />
        </Link>
        <ul className="flex gap-16">
          {menuItems.map(({ href, label, icon }) => (
            <li key={href}>
              <Link
                className={`${linkClassName} ${
                  pathname === href &&
                  "!text-orange-500 border-b-2 border-orange-500"
                }`}
                href={href}
                title={label}
              >
                {icon}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-3 items-center">
          <div className="rounded-[50%] flex justify-center items-center p-2 cursor-pointer hover:text-orange-500">
            <User />
          </div>
        </div>
      </div>
    </div>
  );
};
