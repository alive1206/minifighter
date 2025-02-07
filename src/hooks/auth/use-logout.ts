import { clearAll } from "@/utils";
import { signOut } from "next-auth/react";
import { useCallback } from "react";

export const useLogout = () => {
  const onLogout = useCallback(() => {
    clearAll();
    setTimeout(() => {
      signOut({ callbackUrl: "/auth/login" });
    }, 100);
  }, []);

  return { onLogout };
};
