"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseSSEOptions {
  url: string;
  onEvent?: (event: string) => void;
  enabled?: boolean;
  onConnectionChange?: (connected: boolean) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useSSE({
  url,
  onEvent,
  enabled = true,
  onConnectionChange,
  reconnectInterval = 3000,
  maxReconnectAttempts = 10,
}: UseSSEOptions) {
  const onEventRef = useRef(onEvent);
  const onConnectionChangeRef = useRef(onConnectionChange);
  const retryCountRef = useRef(0);
  const sourceRef = useRef<EventSource | null>(null);
  const mountedRef = useRef(true);

  onEventRef.current = onEvent;
  onConnectionChangeRef.current = onConnectionChange;

  const cleanup = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabled || !mountedRef.current) return;
    if (retryCountRef.current >= maxReconnectAttempts) return;

    cleanup();

    const source = new EventSource(url);
    sourceRef.current = source;

    source.onopen = () => {
      retryCountRef.current = 0;
      onConnectionChangeRef.current?.(true);
    };

    source.addEventListener("refresh", () => {
      onEventRef.current?.("refresh");
    });

    source.onerror = () => {
      onConnectionChangeRef.current?.(false);
      source.close();
      sourceRef.current = null;

      if (mountedRef.current && retryCountRef.current < maxReconnectAttempts) {
        retryCountRef.current += 1;
        setTimeout(connect, reconnectInterval);
      }
    };
  }, [url, enabled, reconnectInterval, maxReconnectAttempts, cleanup]);

  useEffect(() => {
    mountedRef.current = true;
    retryCountRef.current = 0;

    if (enabled) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [enabled, connect, cleanup]);
}
