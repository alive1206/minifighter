"use client";

import { useCurrentUser, useCurrentUserStatus, useLogout } from "@/hooks";
import { UserRole } from "@prisma/client";
import { App, Button, Result, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type Props = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export const PrivateRouter: React.FC<Props> = ({ children, roles }): any => {
  const user = useCurrentUser();
  const status = useCurrentUserStatus();
  const router = useRouter();
  const { message } = App.useApp();
  const { onLogout } = useLogout();

  const noPermission = useMemo(() => {
    return (
      status === "authenticated" && !roles?.includes(user?.role as UserRole)
    );
  }, [roles, status, user?.role]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spin />
      </div>
    );
  } else if (status === "unauthenticated") {
    message.error("You must login to use this function!");
    const interval = setInterval(() => {
      router.push("/auth/login");
    }, 1000);
    return () => clearInterval(interval);
  }

  if (noPermission) {
    message.error("You don't have permission to be here!");
    const interval = setInterval(() => {
      onLogout();
    }, 1000);
    return () => clearInterval(interval);
  }

  return <>{!noPermission && children}</>;
};
