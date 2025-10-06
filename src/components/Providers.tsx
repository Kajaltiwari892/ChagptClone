"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // SessionProvider will make useSession/signIn/signOut available on client components
  return <SessionProvider>{children}</SessionProvider>;
}
