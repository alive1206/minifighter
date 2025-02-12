import { useApi } from "@/hooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

type Arg = {
  url: string;
  query?: any;
  dependencies: any[];
  enabled?: boolean;
};

export const useFetchCloudinaryAssets = (arg: Arg) => {
  const { api } = useApi();

  const fetcher = useCallback(
    async ({ pageParam = null }) => {
      const res = await api.get(arg.url, {
        params: {
          next_cursor: pageParam,
        },
      });

      return res?.data || null;
    },
    [api, arg.url]
  );

  const fn = useInfiniteQuery({
    queryKey: [...arg.dependencies],
    queryFn: fetcher,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next_cursor || null,
    refetchOnWindowFocus: false,
    retry: 5,
    enabled: arg.enabled,
  });

  return { ...fn };
};
