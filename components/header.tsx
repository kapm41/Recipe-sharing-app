"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-orange-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-xs font-semibold text-white shadow-sm">
            RS
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900">
              RecipeShare
            </span>
            <span className="text-[11px] text-zinc-500">
              Share your go-to recipes
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-medium text-zinc-700 sm:flex">
          <Link href="/explore" className="hover:text-zinc-900">
            Explore
          </Link>
          {user && (
            <>
              <Link href="/my-recipes" className="hover:text-zinc-900">
                My recipes
              </Link>
              <Link href="/saved" className="hover:text-zinc-900">
                Saved
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-zinc-200" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full border border-orange-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-orange-700 shadow-sm transition hover:border-orange-200 hover:bg-white sm:inline-flex"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="hidden rounded-full border border-orange-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-orange-700 shadow-sm transition hover:border-orange-200 hover:bg-white sm:inline-flex"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center rounded-full bg-orange-500 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-orange-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-orange-700 shadow-sm transition hover:border-orange-200 hover:bg-white sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-orange-500 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

