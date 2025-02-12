import { App } from "antd";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useApi } from "@/hooks";
import { env } from "@/config";

type Arg = {
  data: {
    file: File;
  };
};

export const useUploadFileMutation = (
  onSuccess?: ((arg: any) => void) | undefined,
  onError?: (arg: any) => void | undefined
) => {
  const router = useRouter();
  const { message } = App.useApp();

  const callbackSusscess = useCallback(() => {
    message.success("Image uploaded successfully!");
  }, [message, router]);

  const { api } = useApi();

  const fetcher = async (arg: Arg) => {
    const { data: signData } = await api.post("/api/sign-cloudinary");
    const { signature, timestamp } = signData;

    const formData = new FormData();
    formData.append("file", arg.data.file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("upload_preset", env.CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", env.CLOUDINARY_UPLOAD_FOLDER);
    formData.append("api_key", env.CLOUDINARY_API_KEY);

    const rs = await api.post(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
