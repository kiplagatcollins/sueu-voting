import Link from "next/link";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { BarChart3, ArrowRight, Vote, Users, Bell } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Live Results",
    description: "Real-time vote counts and rankings updated instantly via server push.",
  },
  {
    icon: Vote,
    title: "Secure Voting",
    description: "Cast your vote with confidence. One vote per position per voter.",
  },
  {
    icon: Bell,
    title: "Instant Updates",
    description: "SSE-powered live refresh — no page reload needed.",
  },
];

export default function Home() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="mx-auto mt-16 max-w-4xl px-6 pb-20 text-center sm:mt-28">
        <div className="mx-auto mb-6 inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
          2026 SUEU General Elections
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Student Union{" "}
          <span className="text-brand-600">Election Results</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500">
          Live dashboard for real-time vote counts, candidate rankings, and
          voter turnout. Powered by Go SSE streaming.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/results"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-700 hover:shadow-xl active:scale-[0.98] sm:w-auto"
          >
            View Live Results
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] sm:w-auto"
          >
            Sign In to Vote
            <Users className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-20 grid gap-6 text-left sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <f.icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="mb-1.5 font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </AuthProvider>
  );
}
