"use client";

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackLayout,
} from "@codesandbox/sandpack-react";

interface CodePlaygroundProps {
  code: string;
  language?: "javascript" | "typescript";
  title?: string;
}

export function CodePlayground({
  code,
  language = "javascript",
  title,
}: CodePlaygroundProps) {
  const ext = language === "typescript" ? "tsx" : "js";
  const filename = `/App.${ext}`;

  return (
    <div className="not-prose my-6 rounded-lg border border-border overflow-hidden">
      {title && (
        <div className="border-b border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
          {title}
        </div>
      )}
      <SandpackProvider
        template={language === "typescript" ? "react-ts" : "react"}
        files={{
          [filename]: { code, active: true },
        }}
        theme="dark"
      >
        <SandpackLayout>
          <SandpackCodeEditor
            style={{ minHeight: 300 }}
            showLineNumbers
            showRunButton
          />
          <SandpackPreview style={{ minHeight: 300 }} />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
