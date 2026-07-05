"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vote, AlertCircle, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push("/vote");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto mt-12 w-full max-w-md border-gray-200 shadow-lg">
      <CardHeader className="items-center text-center pb-2 pt-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <Vote className="h-7 w-7 text-brand-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Sign In
        </CardTitle>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to cast your vote in the SUEU elections
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@egerton.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Demo Accounts
          </p>
          <div className="space-y-1.5 text-sm text-gray-600">
            <p>
              <span className="font-medium">Admin:</span> admin@sueu.edu / admin123
            </p>
            <p>
              <span className="font-medium">Voter:</span> john@sueu.edu / pass123
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link
            href="/results"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            View results without signing in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <LoginForm />
      </main>
    </AuthProvider>
  );
}
