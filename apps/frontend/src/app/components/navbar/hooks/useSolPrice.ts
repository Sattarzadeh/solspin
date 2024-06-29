import { useQuery } from "@tanstack/react-query";

export const useSolPrice = () => {
  return useQuery({
    queryKey: ["solPrice"],
    queryFn: async () => {
      const response = await fetch("https://price.jup.ag/v4/price?ids=SOL");
      const data = await response.json();
      return data.data.SOL.price;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (replaces cacheTime)
    refetchInterval: 60000, // 1 minute
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
