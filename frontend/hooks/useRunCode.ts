import { useCallback, useState } from "react";
import { runCode, type RunResponse } from "@/lib/api";

export type RunStatus = "idle" | "running" | "success" | "error" | "timeout";

export interface RunState {
  status: RunStatus;
  result: RunResponse | null;
  error: string | null;
  elapsedMs: number | null;
}

export function useRunCode() {
  const [state, setState] = useState<RunState>({
    status: "idle",
    result: null,
    error: null,
    elapsedMs: null,
  });

  const execute = useCallback(async (code: string) => {
    if (!code.trim()) return;

    const startTime = performance.now();

    setState({ status: "running", result: null, error: null, elapsedMs: null });

    try {
      const result = await runCode({ code });
      const elapsed = Math.round(performance.now() - startTime);

      setState({
        status: result.timed_out ? "timeout" : result.stderr ? "error" : "success",
        result,
        error: null,
        elapsedMs: elapsed,
      });
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - startTime);
      const message = err instanceof Error ? err.message : "Unknown error occurred";

      setState({
        status: "error",
        result: null,
        error: message,
        elapsedMs: elapsed,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", result: null, error: null, elapsedMs: null });
  }, []);

  return { ...state, execute, reset };
}
