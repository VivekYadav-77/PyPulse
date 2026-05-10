"use client";

import Editor from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

loader.config({ monaco });

if (typeof window !== "undefined") {
  window.MonacoEnvironment = {
    getWorker() {
      return new Worker(
        new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
      );
    },
  };
}

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const STARTER_CODE = `# Write your Python code here
print("Hello Empower")
`;

export default function EditorPane({ value, onChange, disabled }: EditorPaneProps) {
  const lineCount = value.split("\n").length;
  const charCount = value.length;

  return (
    <div className="flex h-full flex-col border-r border-border-default">
      <div className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-secondary px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
          editor
        </span>
        <span className="font-mono text-xs text-text-muted">
          main.py - {lineCount}L - {charCount}C
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          defaultValue={STARTER_CODE}
          value={value}
          language="python"
          theme="vs-dark"
          onChange={(val) => onChange(val ?? "")}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: true,
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 4,
            insertSpaces: true,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            readOnly: disabled,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            renderLineHighlight: "line",
          }}
        />
      </div>
    </div>
  );
}
