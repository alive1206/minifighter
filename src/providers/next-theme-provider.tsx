import { ThemeProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
};

export const NextThemeProvider: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};
