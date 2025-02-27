import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        }
      }, { skipNull: true });

      const res = await fetch(url);
      const data = await res.json();

      if (!data || !data.items) {
        return { items: [], nextCursor: null };
      }

      return data;
    } catch (error) {
      console.error("[CHAT_QUERY_ERROR]", error);
      return { items: [], nextCursor: null };
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: undefined,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};