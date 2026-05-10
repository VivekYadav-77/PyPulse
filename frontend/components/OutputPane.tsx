"use client";

import type { RunState } from "@/hooks/useRunCode";

interface OutputPaneProps {
  state: RunState;
}

function StatusBadge({ status }: { status: RunState["status"] }) {
  const config = {
    idle: {
      label: "Idle",
      className: "border-border-default bg-bg-tertiary text-text-muted",
    },
    running: {
      label: "Running",
      className: "animate-pulse border-blue-800 bg-blue-900/40 text-blue-400",
    },
    success: {
      label: "Success",
      className: "border-green-800 bg-green-900/30 text-success",
    },
    error: {
      label: "Error",
      className: "border-red-800 bg-red-900/30 text-error",
    },
    timeout: {
      label: "Timeout",
      className: "border-orange-800 bg-orange-900/30 text-timeout",
    },
  }[status];

  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-xs ${config.className}`}>
      {config.label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[100, 80, 60].map((w) => (
        <div
          key={w}
          className="h-4 animate-pulse rounded bg-bg-tertiary"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export default function OutputPane({ state }: OutputPaneProps) {
  const { status, result, error, elapsedMs } = state;

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-secondary px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
          output
        </span>
        <div className="flex items-center gap-3">
          {elapsedMs !== null && (
            <span className="font-mono text-xs text-text-muted">
              {(elapsedMs / 1000).toFixed(2)}s
            </span>
          )}
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-auto p-4">
        {status === "idle" && (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">
            <div className="space-y-2 text-center">
              <div className="text-3xl">Run</div>
              <p>Press Run to execute your code</p>
            </div>
          </div>
        )}

        {status === "running" && <LoadingSkeleton />}

        {status === "timeout" && (
          <div className="flex items-center gap-3 rounded-lg border border-orange-800 bg-orange-900/20 px-4 py-3 text-sm text-timeout">
            <span className="text-lg">2s</span>
            <div>
              <p className="font-semibold">Execution timed out</p>
              <p className="mt-0.5 text-xs text-text-muted">
                Your code exceeded the 2-second limit. Check for infinite loops.
              </p>
            </div>
          </div>
        )}

        {status === "error" && error && (
          <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 font-mono text-sm text-error">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Request Error
            </p>
            {error}
          </div>
        )}

        {result && result.stdout && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
                stdout
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(result.stdout)}
                className="font-mono text-xs text-text-muted transition-colors hover:text-text-primary"
              >
                Copy
              </button>
            </div>
            <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-border-default bg-bg-tertiary p-4 font-mono text-sm text-text-primary">
              {result.stdout}
            </pre>
          </div>
        )}

        {result && result.stderr && !result.timed_out && (
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-error">
              stderr
            </p>
            <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-red-900 bg-red-950/30 p-4 font-mono text-sm text-error">
              {result.stderr}
            </pre>
          </div>
        )}

        {status === "success" && result && !result.stdout && !result.stderr && (
          <div className="flex items-center gap-2 rounded-lg border border-green-900 bg-green-950/30 px-4 py-3 text-sm text-success">
            <span>OK</span>
            <span>Code executed successfully with no output.</span>
          </div>
        )}
      </div>
    </div>
  );
}
