"use client";

import { App } from "antd";

type Props = {
  children?: React.ReactNode;
};

export const AntdProvider: React.FC<Props> = ({ children }) => {
  return <App>{children}</App>;
};
