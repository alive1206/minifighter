import { NextThemeProvider } from "@/providers";

type Props = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  return <NextThemeProvider>{children}</NextThemeProvider>;
};
