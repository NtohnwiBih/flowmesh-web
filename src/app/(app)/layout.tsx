import type { ReactNode } from "react";

import { AppProvider } from "@/components/app-provider";
import { AppLayout } from "@/layouts/app-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AppLayout>{children}</AppLayout>
    </AppProvider>
  );
}