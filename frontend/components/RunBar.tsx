"use client";

import type { RunStatus } from "@/hooks/useRunCode";

interface RunBarProps {
  onRun: () => void;
  onReset: () => void;
  status: RunStatus;
}

export default function RunBar({ onRun, onReset, status }: RunBarProps) {
  const isRunning = status === "running";

  return (
    <div className="flex shrink-0 items-center justify-center border-t border-border-default bg-bg-secondary px-5 py-3 sm:justify-between">
      <span className="hidden font-mono text-xs text-text-muted sm:block">
        Ctrl + Enter to run
      </span>

      <div className="flex items-center gap-3">
        {status !== "idle" && (
          <button
            onClick={onReset}
            className="rounded-md border border-border-default px-3 py-1.5 font-mono text-xs text-text-muted transition-colors hover:border-text-muted hover:text-text-primary"
          >
            Clear
          </button>
        )}

        <button
          onClick={onRun}
          disabled={isRunning}
          title="Run code (Ctrl+Enter)"
          className={`flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-all duration-150 ${
            isRunning
              ? "cursor-not-allowed border border-border-default bg-bg-tertiary text-text-muted"
              : "cursor-pointer border border-transparent bg-accent text-bg-primary hover:bg-accent-hover active:scale-[0.97]"
          }`}
        >
          {isRunning ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-text-muted border-t-transparent" />
              Running...
            </>
          ) : (
            <>Run Code</>
          )}
        </button>
      </div>

      <span className="hidden w-32 text-right font-mono text-xs text-text-muted sm:block">
        {status === "idle" || status === "running" ? "" : `status: ${status}`}
      </span>
    </div>
  );
}
