"use client";

import React from "react";
import {
  AreaChartOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, Avatar, Button, Dropdown, Layout, Menu, theme } from "antd";
import { LOGO_HEADER } from "@public/index";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser, useLogout } from "@/hooks";
import { useAtom } from "jotai";
import { collapsedState } from "@/jotai";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export const AdminLayout: React.FC<Props> = ({ children }) => {
  const { Header, Sider, Content } = Layout;

  const { onLogout } = useLogout();
  const { message } = App.useApp();
  const user = useCurrentUser();

  const [collapsed, setCollapsed] = useAtom(collapsedState);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case "1":
        router.push("/admin");

        break;
      case "2":
        router.push("/admin/user");

        break;
      case "3":
        router.push("/admin/post");

        break;
      case "4":
        router.push("/admin/shop");

        break;
      default:
        break;
    }
  };

  const getActiveKey = () => {
    if (pathname?.includes("/admin/user")) return "2";
    if (pathname?.includes("/admin/post")) return "3";
    if (pathname?.includes("/admin/shop")) return "4";
    return "1";
  };

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-zinc-900"
      >
        <Link href="/" className="cursor-pointer">
          <img className="w-40 h-30 mx-auto py-3" src={LOGO_HEADER} />
        </Link>
        <Menu
          className="bg-zinc-900"
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[getActiveKey()]}
          items={[
            {
              key: "1",
              icon: <AreaChartOutlined style={{ fontSize: "20px" }} />,
              label: "Insights",
            },
            {
              key: "2",
              icon: <UserOutlined style={{ fontSize: "20px" }} />,
              label: "User",
            },
            {
              key: "3",
              icon: <BookOutlined style={{ fontSize: "20px" }} />,
              label: "Post",
            },
            {
              key: "4",
              icon: <ShoppingCartOutlined style={{ fontSize: "20px" }} />,
              label: "Shop",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between ">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {user && (
              <div className="pr-6">
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
                      {
                        key: "2",
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
              </div>
            )}
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
