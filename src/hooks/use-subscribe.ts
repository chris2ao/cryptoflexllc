"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

type SubscribeStatus = "idle" | "loading" | "success" | "error";

export function useSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("You're subscribed! Check your inbox on Mondays.");
      setEmail("");
      sendGAEvent("event", "subscribe", { method: "email" });
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  function updateEmail(value: string) {
    setEmail(value);
    if (status === "error") setStatus("idle");
  }

  return { email, status, message, handleSubmit, updateEmail };
}
