// components/SignOutButton.tsx
"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-3 py-1 rounded bg-red-600 text-white"
    >
      Sign out
    </button>
  );
}
