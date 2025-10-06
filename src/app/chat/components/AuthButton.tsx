// components/AuthButton.tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import SignOutButton from "@/components/SignOutButton";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="px-3 py-1">Loading...</div>;

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">{session.user.name ?? session.user.email}</div>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn()} className="px-3 py-1 rounded border">
        Sign in
      </button>
    </div>
  );
}
