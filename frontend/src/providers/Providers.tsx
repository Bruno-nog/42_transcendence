"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "./QueryProvider";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <QueryProvider>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
        }}
      />
    </QueryProvider>
  );
}