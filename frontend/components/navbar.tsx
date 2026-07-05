"use client";

import Link from "next/link";
import { Vote, LogOut, User, Shield } from "lucide-react";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";

export function Navbar() {
  const { voter, loading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Vote className="h-6 w-6 text-brand-600" />
            <span>SUEU Voting</span>
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <Link
              href="/results"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Results
            </Link>
            {voter && !voter.is_admin && (
              <Link
                href="/vote"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Vote
              </Link>
            )}
            {voter?.is_admin && (
              <Link
                href="/admin"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-600 animate-pulse sm:inline-flex">
            Live
          </span>

          {loading ? (
            <div className="h-8 w-20 rounded-full bg-gray-100 animate-pulse" />
          ) : voter ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 text-right sm:flex">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {voter.name}
                </p>
                <p className="text-xs text-gray-400">{voter.student_id}</p>
              </div>
              {voter.is_admin && (
                <Shield className="h-4 w-4 text-amber-500" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-500"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-700"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
