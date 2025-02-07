"use client";

import { AntdProvider, NextThemeProvider } from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AntdProvider>
          <NextThemeProvider>{children}</NextThemeProvider>
        </AntdProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
