import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsClient } from "./results-client";
import { Trophy, UserCheck, Vote, Users } from "lucide-react";
import type { ResultsSummary } from "@/lib/types";

async function getResults(): Promise<ResultsSummary> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/v1/results`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch results");
  }
  return res.json();
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white shadow-sm ring-2 ring-green-200">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white shadow-sm ring-2 ring-blue-200">
        2
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-400">
      {rank}
    </span>
  );
}

function CandidateRow({
  candidate,
}: {
  candidate: ResultsSummary["positions"][0]["candidates"][0];
}) {
  const isWinner = candidate.rank === 1;
  const isRunnerUp = candidate.rank === 2;

  let rowClass = "transition-colors hover:bg-gray-50/50";
  if (isWinner) rowClass = "bg-green-50/70 transition-colors";
  else if (isRunnerUp) rowClass = "bg-blue-50/30 transition-colors";

  const progressPct = Math.max(0, Math.min(100, candidate.rank === 1 ? 100 : 100 - (candidate.rank - 1) * 20));

  return (
    <tr className={rowClass}>
      <td className="px-6 py-4">
        <RankBadge rank={candidate.rank} />
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className={`font-semibold ${isWinner ? "text-lg text-green-900" : isRunnerUp ? "text-blue-900" : "text-gray-700"}`}>
            {candidate.name}
          </span>
          {candidate.bio && (
            <span className="text-xs text-gray-400 mt-0.5">
              {candidate.bio}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-4">
          <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <span className={`min-w-[4rem] text-right font-bold tabular-nums ${isWinner ? "text-green-700" : isRunnerUp ? "text-blue-700" : "text-gray-500"}`}>
            {candidate.votes.toLocaleString()}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        {isWinner && (<Badge variant="success" className="whitespace-nowrap">Winner</Badge>)}
        {isRunnerUp && (<Badge variant="secondary" className="whitespace-nowrap bg-blue-100 text-blue-700">Runner Up</Badge>)}
      </td>
    </tr>
  );
}

function ResultsTable({ position }: { position: ResultsSummary["positions"][0] }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <span className="inline-block h-6 w-1.5 rounded-full bg-brand-500" />
          {position.position}
        </h2>
        <div className="text-xs text-gray-400">
          {position.candidates.reduce((s, c) => s + c.votes, 0).toLocaleString()} total votes
        </div>
      </div>
      <Card className="overflow-hidden border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3 w-20">Rank</th>
                <th className="px-6 py-3">Candidate</th>
                <th className="px-6 py-3 text-right">Votes</th>
                <th className="px-6 py-3 text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {position.candidates.map((candidate) => (
                <CandidateRow key={candidate.id} candidate={candidate} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <Card className="border-gray-200 transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{label}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
        {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default async function ResultsPage() {
  let summary: ResultsSummary;

  try {
    summary = await getResults();
  } catch {
    return (
      <AuthProvider>
        <Navbar />
        <main className="mx-auto mt-20 max-w-4xl px-4 text-center">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-16">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Vote className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-lg font-semibold text-red-700">Could not load election results</p>
              <p className="mt-1 text-sm text-red-500">Make sure the backend server is running on port 8080.</p>
            </CardContent>
          </Card>
        </main>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <ResultsClient>
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{summary.election_title}</h1>
            <p className="mt-1 text-sm text-gray-500">Live vote counts and candidate rankings — updates automatically</p>
          </div>

          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <StatCard icon={Users} label="Registered Voters" value={summary.total_voters.toLocaleString()} />
            <StatCard icon={Vote} label="Votes Cast" value={summary.total_votes_cast.toLocaleString()} sub={`${summary.voter_turnout_pct.toFixed(1)}% turnout`} />
            <StatCard icon={Trophy} label="Positions" value={String(summary.positions.length)} sub="contested seats" />
          </div>

          <div className="space-y-10">
            {summary.positions.length === 0 && (
              <Card className="border-dashed border-gray-300">
                <CardContent className="flex flex-col items-center py-20 text-gray-400">
                  <UserCheck className="mb-4 h-14 w-14" />
                  <p className="text-xl font-medium">No positions yet</p>
                  <p className="text-sm mt-1">Results will appear once the election is configured.</p>
                </CardContent>
              </Card>
            )}
            {summary.positions.map((pos) => (
              <ResultsTable key={pos.position_id} position={pos} />
            ))}
          </div>

          <footer className="mt-12 text-center text-sm text-gray-400">
            Registered Voters: {summary.total_voters.toLocaleString()} | Votes Cast: {summary.total_votes_cast.toLocaleString()} ({summary.voter_turnout_pct.toFixed(1)}%)
          </footer>
        </ResultsClient>
      </main>
    </AuthProvider>
  );
}
