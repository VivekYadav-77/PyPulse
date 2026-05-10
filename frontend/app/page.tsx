"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import OutputPane from "@/components/OutputPane";
import RunBar from "@/components/RunBar";
import { useRunCode } from "@/hooks/useRunCode";

const EditorPane = dynamic(() => import("@/components/EditorPane"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-bg-primary text-sm text-text-muted">
      Loading editor...
    </div>
  ),
});

const STARTER_CODE = `# Write your Python code here\nprint("Hello Empower")\n`;

export default function HomePage() {
  const [code, setCode] = useState(STARTER_CODE);
  const { execute, reset, ...runState } = useRunCode();

  const handleRun = useCallback(() => {
    execute(code);
  }, [code, execute]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-primary">
      <Header />

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <div className="flex h-[50vh] w-full flex-col overflow-hidden md:h-auto md:w-[55%]">
          <EditorPane
            value={code}
            onChange={setCode}
            disabled={runState.status === "running"}
          />
        </div>

        <div className="flex h-[50vh] w-full flex-col overflow-hidden border-t border-border-default md:h-auto md:w-[45%] md:border-l md:border-t-0">
          <OutputPane state={runState} />
        </div>
      </div>

      <RunBar onRun={handleRun} onReset={reset} status={runState.status} />
    </div>
  );
}
