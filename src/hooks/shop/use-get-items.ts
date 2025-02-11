import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useApi } from "@/hooks";

type Arg = {
  url: string;
  query?: any;
  dependencies: any[];
  enabled?: boolean;
};

export const useGetItems = (arg: Arg) => {
  const { api } = useApi();

  const fetcher = useCallback(async () => {
    const res = await api.get(arg.url, {
      params: {
        ...arg.query,
      },
    });
    return res?.data || null;
  }, [api, arg.query, arg.url]);

  const fn = useQuery({
    queryKey: [...arg.dependencies],
    queryFn: fetcher,
    refetchOnWindowFocus: false,
    retry: 5,
    enabled: arg.enabled,
  });
  return {
    ...fn,
  };
};
