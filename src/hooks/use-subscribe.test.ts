import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSubscribe } from "./use-subscribe";
import { SUBSCRIBE_COPY } from "@/lib/subscribe-copy";

vi.mock("@next/third-parties/google", () => ({ sendGAEvent: vi.fn() }));

describe("useSubscribe", () => {
  it("uses the shared success copy after a successful subscribe", async () => {
    global.fetch = vi.fn().mockImplementation((_u: string, o?: RequestInit) =>
      Promise.resolve({
        ok: true,
        json: async () => (o?.method === "POST" ? { success: true } : { count: 5 }),
      })
    );
    const { result } = renderHook(() => useSubscribe());
    act(() => result.current.updateEmail("a@example.com"));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault() {} } as React.FormEvent);
    });
    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.message).toBe(SUBSCRIBE_COPY.success);
  });
});
