"use client";

import {
  useRef,
  useState,
  useEffect,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { sendGAEvent } from "@next/third-parties/google";

interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  children: ReactNode;
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [copied, setCopied] = useState(false);

  // Extract language from code element className
  let language = "";
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    typeof (children as ReactElement<{ className?: string }>).props?.className === "string"
  ) {
    const match = (children as ReactElement<{ className?: string }>).props.className!.match(/language-(\w+)/);
    if (match) language = match[1];
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      sendGAEvent("event", "copy_code", { content_length: text.length });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions, non-secure context).
      // Button stays in default state so the user can retry.
    }
  }

  return (
    <div className="group relative">
      {language && (
        <span className="absolute right-12 top-2 z-10 text-xs text-muted-foreground/70 font-mono uppercase select-none">
          {language}
        </span>
      )}
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-2 top-2 rounded-md border border-border bg-zinc-800 p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus:opacity-100"
      >
        {copied ? (
          <svg
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
      {copied && (
        <span role="status" className="sr-only">
          Code copied to clipboard
        </span>
      )}
    </div>
  );
}
