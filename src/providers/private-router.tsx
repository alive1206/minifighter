"use client";

import { useCurrentUser, useCurrentUserStatus } from "@/hooks";
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
      router.push("/");
    }, 100);
    return () => clearInterval(interval);
  }

  if (noPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary" href="/">
              Back Home
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};
