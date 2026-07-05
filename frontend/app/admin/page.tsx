"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { api, ApiClientError } from "@/lib/api";
import type { ResultsSummary, Voter } from "@/lib/types";
import {
  BarChart3,
  RefreshCw,
  Database,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Shield,
  Users,
  Vote,
  UserCheck,
  X,
} from "lucide-react";

function AdminDashboard() {
  const { voter, loading: authLoading } = useAuth();
  const router = useRouter();

  const [results, setResults] = useState<ResultsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [actionMsg, setActionMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getResults();
      setResults(data);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Failed to load results",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const handleSeed = async () => {
    setSeeding(true);
    setActionMsg(null);
    try {
      await api.seedData();
      setActionMsg({ type: "success", text: "Demo data seeded successfully" });
      await loadResults();
    } catch (err) {
      setActionMsg({
        type: "error",
        text:
          err instanceof ApiClientError
            ? err.message
            : "Failed to seed data",
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setActionMsg(null);
    try {
      await api.resetVotes();
      setActionMsg({ type: "success", text: "All votes reset successfully" });
      setShowResetConfirm(false);
      await loadResults();
    } catch (err) {
      setActionMsg({
        type: "error",
        text:
          err instanceof ApiClientError
            ? err.message
            : "Failed to reset votes",
      });
    } finally {
      setResetting(false);
    }
  };

  if (!authLoading && !voter) {
    router.push("/login");
    return null;
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-8 space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (voter && !voter.is_admin) {
    return (
      <main className="mx-auto max-w-4xl px-4 pt-20 text-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-16">
            <Shield className="mx-auto mb-4 h-12 w-12 text-red-400" />
            <p className="text-lg font-semibold text-red-700">
              Admin access required
            </p>
            <p className="mt-1 text-sm text-red-500">
              You do not have permission to access this page.
            </p>
            <Button className="mt-6" variant="outline" onClick={() => router.push("/")}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage election data and monitor results
            </p>
          </div>
          <Badge variant="default" className="bg-amber-100 text-amber-800 border-0">
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        </div>

        {actionMsg && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium ${
              actionMsg.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {actionMsg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {actionMsg.text}
            <button
              onClick={() => setActionMsg(null)}
              className="ml-auto text-current opacity-50 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Voters
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.total_voters.toLocaleString() ?? "—"}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Votes Cast
              </CardTitle>
              <Vote className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.total_votes_cast.toLocaleString() ?? "—"}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Turnout
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results
                  ? `${results.voter_turnout_pct.toFixed(1)}%`
                  : "—"}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Positions
              </CardTitle>
              <UserCheck className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.positions.length.toLocaleString() ?? "—"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Election Data Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSeed}
                loading={seeding}
                variant="default"
              >
                <Database className="mr-2 h-4 w-4" />
                Seed Demo Data
              </Button>
              <Button
                onClick={() => setShowResetConfirm(true)}
                loading={resetting}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset All Votes
              </Button>
              <Button onClick={loadResults} loading={loading} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
              <p className="font-medium text-red-700">{error}</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={loadResults}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        )}

        {results && !loading && (
          <div className="space-y-8">
            {results.positions.map((pos) => (
              <section key={pos.position_id}>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
                  <span className="inline-block h-5 w-1.5 rounded-full bg-brand-500" />
                  {pos.position}
                </h2>
                <Card className="overflow-hidden border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          <th className="px-5 py-3">Rank</th>
                          <th className="px-5 py-3">Candidate</th>
                          <th className="px-5 py-3 text-right">Votes</th>
                          <th className="px-5 py-3 text-right">%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {pos.candidates.map((c) => {
                          const total = pos.candidates.reduce(
                            (s, x) => s + x.votes,
                            0,
                          );
                          const pct = total > 0 ? (c.votes / total) * 100 : 0;
                          return (
                            <tr
                              key={c.id}
                              className={`${
                                c.rank === 1
                                  ? "bg-green-50/50"
                                  : "hover:bg-gray-50/50"
                              }`}
                            >
                              <td className="px-5 py-3 font-medium">
                                {c.rank}
                              </td>
                              <td className="px-5 py-3 font-medium text-gray-900">
                                {c.name}
                              </td>
                              <td className="px-5 py-3 text-right font-bold tabular-nums">
                                {c.votes.toLocaleString()}
                              </td>
                              <td className="px-5 py-3 text-right text-gray-600">
                                {pct.toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>
            ))}
          </div>
        )}
      </main>

      <Dialog
        open={showResetConfirm}
        onOpenChange={(open) => !resetting && setShowResetConfirm(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Votes</DialogTitle>
            <DialogDescription>
              This will delete all votes and allow voters to vote again. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(false)}
              disabled={resetting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              loading={resetting}
            >
              Yes, Reset All Votes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <Navbar />
      <AdminDashboard />
    </AuthProvider>
  );
}
