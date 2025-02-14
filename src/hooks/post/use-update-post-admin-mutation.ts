import { App } from "antd";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useApi } from "@/hooks";

type Arg = {
  id?: any;
  data?: any;
};

export const useUpdatePostAdminMutation = (
  onSuccess?: ((arg: any) => void) | undefined,
  onError?: (arg: any) => void | undefined
) => {
  const router = useRouter();
  const { message } = App.useApp();

  const callbackSusscess = useCallback(() => {
    message.success("Post updated successfully!");
  }, [message, router]);

  const { api } = useApi();

  const fetcher = async (arg: Arg) => {
    const rs = await api.put(`/api/post/${arg.id}`, { ...arg?.data });
    return rs.data;
  };

  const fn = useMutation({
    mutationFn: fetcher,
    onSuccess: (rs) => {
      callbackSusscess();
      onSuccess?.(rs);
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Something went wrong!");
      onError?.(err);
    },
    retry: false,
  });

  return { ...fn };
};
