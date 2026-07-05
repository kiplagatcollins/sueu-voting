import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { VoteClient } from "./vote-client";
import { Vote, ShieldAlert } from "lucide-react";

export default function VotePage() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Cast Your Vote
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Select one candidate per position and submit your ballot.
          </p>
        </div>

        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 py-4">
            <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">One vote per position</p>
              <p className="mt-0.5 text-amber-700">
                Once you submit, your choices are final and cannot be changed.
              </p>
            </div>
          </CardContent>
        </Card>

        <VoteClient />
      </main>
    </AuthProvider>
  );
}
