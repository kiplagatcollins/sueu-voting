"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { useSSE } from "@/hooks/use-sse";
import { api, ApiClientError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  LogIn,
  Send,
} from "lucide-react";
import type { Election, Vote as VoteType } from "@/lib/types";

type VoteSelections = Record<number, number>;

export function VoteClient() {
  const { voter, loading: authLoading } = useAuth();
  const router = useRouter();

  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selections, setSelections] = useState<VoteSelections>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingVotes, setExistingVotes] = useState<VoteType[]>([]);

  const loadData = useCallback(async () => {
    if (!voter) return;
    setLoading(true);
    setError(null);

    try {
      const [electionData, myVotes] = await Promise.all([
        api.getActiveElection(),
        api.getMyVotes(),
      ]);
      setElection(electionData);
      setExistingVotes(myVotes);

      // restore previous selections from existing votes
      const restored: VoteSelections = {};
      for (const v of myVotes) {
        restored[v.position_id] = v.candidate_id;
      }
      setSelections(restored);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Failed to load election data",
      );
    } finally {
      setLoading(false);
    }
  }, [voter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useSSE({
    url: "/api/v1/events",
    onEvent: () => router.refresh(),
    enabled: !!voter,
  });

  // early return if not authenticated
  if (!authLoading && !voter) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="flex flex-col items-center py-20 text-gray-400">
          <LogIn className="mb-4 h-14 w-14" />
          <p className="text-xl font-medium">Sign in to vote</p>
          <p className="mt-1 text-sm">
            You need to be logged in to cast your vote.
          </p>
          <Button className="mt-6" onClick={() => router.push("/login")}>
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col items-center py-16">
          <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
          <p className="font-semibold text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!election) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="flex flex-col items-center py-20 text-gray-400">
          <AlertCircle className="mb-4 h-14 w-14" />
          <p className="text-xl font-medium">No active election</p>
          <p className="mt-1 text-sm">
            There is no active election to vote in right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  const allVoted = election.positions.every(
    (p) => selections[p.id] !== undefined,
  );
  const selectedCount = Object.keys(selections).length;

  const handleSelect = (positionId: number, candidateId: number) => {
    setSelections((prev) => {
      if (prev[positionId] === candidateId) {
        const next = { ...prev };
        delete next[positionId];
        return next;
      }
      return { ...prev, [positionId]: candidateId };
    });
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      for (const [posId, candId] of Object.entries(selections)) {
        await api.castVote(candId, Number(posId));
      }
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiClientError ? err.message : "Failed to submit vote",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex flex-col items-center py-20">
          <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
          <p className="text-2xl font-bold text-green-800">Vote Cast!</p>
          <p className="mt-2 text-sm text-green-600">
            Your votes have been recorded successfully.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/results")}
            >
              View Results
            </Button>
            <Button onClick={() => router.push("/")}>
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {election.positions.map((position) => {
          const selected = selections[position.id];
          const alreadyVoted = existingVotes.some(
            (v) => v.position_id === position.id,
          );

          return (
            <Card
              key={position.id}
              className="border-gray-200 transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-800">
                    {position.title}
                  </CardTitle>
                  {alreadyVoted && (
                    <Badge variant="success">Voted</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(position.candidates ?? []).length === 0 && (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No candidates for this position.
                    </p>
                  )}
                  {position.candidates?.map((candidate) => {
                    const isSelected = selected === candidate.id;
                    return (
                      <button
                        key={candidate.id}
                        disabled={alreadyVoted}
                        onClick={() =>
                          !alreadyVoted &&
                          handleSelect(position.id, candidate.id)
                        }
                        className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                          isSelected
                            ? "border-brand-500 bg-brand-50 shadow-sm"
                            : alreadyVoted
                              ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {candidate.name}
                            </p>
                            {candidate.bio && (
                              <p className="mt-0.5 text-sm text-gray-500">
                                {candidate.bio}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-6 w-6 text-brand-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="sticky bottom-4 z-10 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedCount} of {election.positions.length} positions selected
            </div>
            <Button
              size="lg"
              disabled={!allVoted || submitting}
              onClick={() => setShowConfirm(true)}
              loading={submitting}
            >
              <Send className="mr-2 h-4 w-4" />
              {allVoted ? "Submit Votes" : "Select All Positions"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={showConfirm}
        onOpenChange={(open) => !submitting && setShowConfirm(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Votes</DialogTitle>
            <DialogDescription>
              Please review your selections before submitting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {election.positions.map((pos) => {
              const candId = selections[pos.id];
              const candidate = pos.candidates?.find((c) => c.id === candId);
              return (
                <div
                  key={pos.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {pos.title}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {candidate?.name ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>

          {submitError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {submitError}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} loading={submitting}>
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
