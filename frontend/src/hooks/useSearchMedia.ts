"use client";

import { useMutation } from "@tanstack/react-query";
import { searchMedia } from "../services/media/searchMedia";

export function useSearchMedia() {
  return useMutation({
    mutationFn: searchMedia,
  });
}