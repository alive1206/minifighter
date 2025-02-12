import { Header } from "@/components";

type Props = {
  children: React.ReactNode;
};

export const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen bg-zinc-900">
      <Header />
      <div className="h-full w-full relative ">{children}</div>
    </div>
  );
};
