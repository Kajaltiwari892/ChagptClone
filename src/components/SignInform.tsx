"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      // sign-in successful — client session will update automatically
      // you can optionally redirect: window.location.href = '/';
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <label className="block mb-2">
        <span>Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="mt-1 block w-full rounded border px-2 py-1"
        />
      </label>

      <label className="block mb-4">
        <span>Password</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="mt-1 block w-full rounded border px-2 py-1"
        />
      </label>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded bg-blue-600 text-white"
      >
        {loading ? "Signing in..." : "Sign in with credentials"}
      </button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => signIn("google")}
          className="mt-2 inline-block px-4 py-2 border rounded"
        >
          Sign in with Google
        </button>
      </div>

      <p className="text-sm mt-4 text-gray-500">
        Demo credentials: <code>test@example.com / 1234</code>
      </p>
    </form>
  );
}
