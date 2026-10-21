"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export function AuthButtons() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <div className="w-24 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />;
  if (isSignedIn) return <UserButton />;
  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <button className="px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">Sign in</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition">Sign up</button>
      </SignUpButton>
    </div>
  );
}
