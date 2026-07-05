"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useSSE } from "@/hooks/use-sse";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

export function ResultsClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [connected, setConnected] = useState(false);

  const handleSSEEvent = useCallback(() => {
    router.refresh();
  }, [router]);

  useSSE({
    url: "/api/v1/events",
    onEvent: handleSSEEvent,
    onConnectionChange: setConnected,
  });

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10 flex items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${connected ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
          {connected ? (<><Wifi className="h-3 w-3" /> Connected</>) : (<><WifiOff className="h-3 w-3" /> Connecting…</>)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Live
        </span>
      </div>
      {children}
    </div>
  );
}
