import { useQuery } from "@tanstack/react-query";
import { searchMedia } from "../services/media/searchMedia";

export function useSearchMedia(title: string) {
  return useQuery({
    queryKey: ["media", "search", title],
    queryFn: () => searchMedia(title),
    enabled: Boolean(title.trim()),
  });
}