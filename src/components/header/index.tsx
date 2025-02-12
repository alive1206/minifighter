"use client";

import { LOGO_HEADER } from "@public/index";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useCurrentUser, useLogout } from "@/hooks";
import { App, Avatar, Dropdown } from "antd";

export const Header = () => {
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const { onLogout } = useLogout();
  const { message } = App.useApp();
  const router = useRouter();
  const user = useCurrentUser();
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
      href: "/leaderboard",
      label: "Leaderboard",
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
          <div className="text-white rounded-[50%] flex justify-center items-center p-2 cursor-pointer hover:text-orange-500">
            {user ? (
              <>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "1",
                        label: (
                          <span className="capitalize font-bold flex justify-center">
                            {user.name || (
                              <span className="text-red-500">unamed</span>
                            )}
                          </span>
                        ),
                        disabled: true,
                      },
                      user.role !== "User"
                        ? {
                            key: "2",
                            label: "Admin panel",
                            onClick: () => {
                              router.push("/admin");
                            },
                          }
                        : null,
                      {
                        key: "3",
                        label: "Sign out",
                        onClick: () => {
                          onLogout();
                          message.success("Logout successfully!");
                        },
                      },
                    ],
                  }}
                >
                  <Avatar
                    src={
                      user?.image ||
                      "https://cdn.gamemeca.com/gmdb/g000/20/56/223303.jpg"
                    }
                  />
                </Dropdown>
              </>
            ) : (
              <Link href="/auth/login">
                <User />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
