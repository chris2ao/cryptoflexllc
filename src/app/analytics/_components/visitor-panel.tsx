"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VisitorDossier } from "@/lib/analytics-queries/visitor";
import type { IpEnrichment } from "@/lib/ip-enrichment/types";
import { VISITOR_EVENT, type VisitorEventDetail } from "./ip-link";
import {
  EngagementSection,
  HistorySection,
  IdentitySection,
  LocationSection,
  NetworkSection,
  SignalsSection,
} from "./visitor-panel-sections";

export type EnrichmentError = null | "unauthorized" | "unavailable";

export type VisitorPanelProps = {
  ip: string;
  dossier: VisitorDossier | null;
  enrichment: IpEnrichment | null;
  loadingDossier: boolean;
  loadingEnrichment: boolean;
  error: string | null;
  enrichmentError?: EnrichmentError;
  onClose: () => void;
  headingRef?: React.Ref<HTMLHeadingElement>;
};

export function VisitorPanel({
  ip,
  dossier,
  enrichment,
  loadingDossier,
  loadingEnrichment,
  error,
  enrichmentError = null,
  onClose,
  headingRef,
}: VisitorPanelProps) {
  return (
    <>
      <div className="ax-visitor-head">
        <h2 ref={headingRef} tabIndex={-1} className="ax-visitor-title">
          {ip}
        </h2>
        <button type="button" className="chip" onClick={onClose}>
          Close
        </button>
      </div>

      {error ? <p className="ax-empty">{error}</p> : null}
      {loadingDossier ? <p className="ax-muted">Loading history...</p> : null}

      <IdentitySection dossier={dossier} enrichment={enrichment} />
      {enrichment ? (
        <>
          <NetworkSection e={enrichment} />
          <LocationSection e={enrichment} />
        </>
      ) : loadingEnrichment ? (
        <p className="ax-muted">Loading network details...</p>
      ) : enrichmentError ? (
        <p className="ax-empty">
          {enrichmentError === "unauthorized" ? "Session expired" : "Enrichment unavailable"}
        </p>
      ) : null}

      {dossier ? (
        <>
          <HistorySection d={dossier} />
          <EngagementSection d={dossier} />
          <SignalsSection d={dossier} />
        </>
      ) : null}

      {enrichment ? (
        <p className="ax-visitor-foot ax-muted">
          Sources: {enrichment.sources.join(", ") || "none"}. Enriched{" "}
          {enrichment.enrichedAt || "unknown"}.
        </p>
      ) : null}
    </>
  );
}

type HostState = {
  ip: string;
  dossier: VisitorDossier | null;
  enrichment: IpEnrichment | null;
  loadingDossier: boolean;
  loadingEnrichment: boolean;
  error: string | null;
  enrichmentError: EnrichmentError;
};

const IDLE: HostState = {
  ip: "",
  dossier: null,
  enrichment: null,
  loadingDossier: false,
  loadingEnrichment: false,
  error: null,
  enrichmentError: null,
};

const FETCH_INIT = {
  credentials: "same-origin",
  cache: "no-store",
} as const satisfies RequestInit;

function isEnrichment(v: unknown): v is IpEnrichment {
  return (
    typeof v === "object" &&
    v !== null &&
    Array.isArray((v as IpEnrichment).sources)
  );
}

class HttpError extends Error {
  constructor(readonly status: number) {
    super(String(status));
  }
}

export function VisitorPanelHost() {
  const [state, setState] = useState<HostState>(IDLE);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const currentIp = useRef("");
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    currentIp.current = "";
    setOpen(false);
    dialogRef.current?.close();
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener?.isConnected) opener.focus();
  }, []);

  const loadDossier = useCallback(async (ip: string, stale: () => boolean) => {
    try {
      const res = await fetch(`/api/analytics/visitor?ip=${encodeURIComponent(ip)}`, FETCH_INIT);
      if (stale()) return;
      if (!res.ok) throw new HttpError(res.status);
      const body = (await res.json()) as { dossier?: VisitorDossier };
      if (stale()) return;
      setState((s) => ({ ...s, dossier: body.dossier ?? null, loadingDossier: false }));
    } catch (err) {
      if (stale()) return;
      const error =
        err instanceof HttpError && err.status === 401
          ? "Session expired. Reload the dashboard."
          : "Visitor history unavailable";
      setState((s) => ({ ...s, loadingDossier: false, error }));
    }
  }, []);

  const loadEnrichment = useCallback(async (ip: string, stale: () => boolean) => {
    try {
      const res = await fetch(`/api/analytics/ip-intel?ip=${encodeURIComponent(ip)}`, FETCH_INIT);
      if (stale()) return;
      if (!res.ok) throw new HttpError(res.status);
      const body = (await res.json()) as { enrichment?: unknown };
      if (stale()) return;
      if (!isEnrichment(body.enrichment)) throw new Error("shape");
      const enrichment = body.enrichment;
      setState((s) => ({ ...s, enrichment, loadingEnrichment: false }));
    } catch (err) {
      if (stale()) return;
      const enrichmentError: EnrichmentError =
        err instanceof HttpError && err.status === 401 ? "unauthorized" : "unavailable";
      setState((s) => ({ ...s, loadingEnrichment: false, enrichmentError }));
    }
  }, []);

  const load = useCallback(
    (ip: string) => {
      currentIp.current = ip;
      setState({ ...IDLE, ip, loadingDossier: true, loadingEnrichment: true });
      const stale = () => currentIp.current !== ip;
      void loadDossier(ip, stale);
      void loadEnrichment(ip, stale);
    },
    [loadDossier, loadEnrichment],
  );

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ip = (e as CustomEvent<VisitorEventDetail>).detail?.ip;
      if (!ip) return;
      const active = document.activeElement;
      if (!dialogRef.current?.open && active instanceof HTMLElement && active !== document.body) {
        openerRef.current = active;
      }
      setOpen(true);
      const dlg = dialogRef.current;
      if (dlg && !dlg.open) dlg.show();
      load(ip);
      requestAnimationFrame(() => headingRef.current?.focus());
    };
    window.addEventListener(VISITOR_EVENT, onOpen);
    return () => window.removeEventListener(VISITOR_EVENT, onOpen);
  }, [load]);

  // Escape does not fire `cancel` on a non-modal dialog, so handle it here.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const other = document.querySelector(
        'dialog:modal, [role="dialog"][data-state="open"]',
      );
      if (other && other !== dialogRef.current) return;
      close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <dialog ref={dialogRef} className="ax-visitor" aria-label="Visitor details">
      {open && state.ip ? (
        <VisitorPanel
          {...state}
          onClose={close}
          headingRef={headingRef}
        />
      ) : null}
    </dialog>
  );
}
