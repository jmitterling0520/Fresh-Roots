# Form Submission Monitoring Plan

This plan outlines how to build and operate a **monitoring tool** for the Fresh Roots contact form so you can quickly detect issues with form submission, the `/api/contact` backend, storage, or the site itself.

---

## Overview & Goals

| Goal | Description |
|------|-------------|
| **Visibility** | Know when the form or API is broken so you can fix it before losing leads. |
| **Health checks** | Confirm the API and storage (e.g. `data/submissions.json`) are working. |
| **Alerting** | Get notified when something fails (e.g. API errors, submission failures). |
| **Minimal overhead** | Start simple; add automation and alerts as needed. |

---

## What to Monitor

| Area | What can go wrong | How to detect |
|------|-------------------|---------------|
| **Form (client)** | JS errors, network failures, wrong endpoint | Client-side error logging; synthetic “test submit.” |
| **API (`/api/contact`)** | Route down, 500s, validation rejecting valid input | Health endpoint; uptime checks; error logs. |
| **Storage** | Disk full, permissions, file missing/corrupt | Check that writes succeed; optional read-back. |
| **End-to-end** | Full path from “submit” to “saved” | Periodic test submission; verify it appears in storage. |

---

## Phase 1: Manual & Log-Based Monitoring (Quick Start)

**Objective:** See what’s happening without new infrastructure.

### 1.1 API logging

- In `app/api/contact/route.ts`:
  - Log every request (method, path) and response status.
  - On success: log `"Contact form submission saved"` (no PII).
  - On error: log full error and stack so you can debug from server logs.
- Where logs go depends on hosting (e.g. Vercel → Dashboard → Logs; VPS → stdout/file).

### 1.2 Client-side error surfacing

- Contact form already shows a generic error message on non-2xx or network failure.
- Optional: log to console in dev (or to an error-reporting service later) when `fetch` fails or returns an error so you can correlate with API logs.

### 1.3 Manual health check

- Once per day (or after deployments): open the site, submit the form with test data, and confirm:
  - Success message appears.
  - A new entry exists in `data/submissions.json` (or in your DB, if you’ve switched).

### 1.4 Checklist

- [ ] Add structured log lines in `/api/contact` for request, success, and failure.
- [ ] Confirm where logs are visible (Vercel, server, etc.).
- [ ] Document “manual test submission” steps (e.g. in this plan or a runbook).
- [ ] Optionally add a `received_at` or similar in submissions so you can verify “latest submission” during manual checks.

---

## Phase 2: Automated Health Endpoint

**Objective:** Let a machine check that the API is up and that storage is writable.

### 2.1 Health route

- Add `GET /api/health` (or `GET /api/contact/health` if you prefer):
  - Returns 200 if the app is running.
  - Optional: probe storage (e.g. read last line of `submissions.json` or run a no-op write). If that fails, return 503 so monitors know “degraded.”
- Do **not** expose PII or submission content in the health response.

### 2.2 What the health route can check

| Check | Implementation idea |
|-------|----------------------|
| App alive | Always return 200 from a minimal handler. |
| Storage writable | Write a small temp file or append a “health check” marker and then remove or ignore it; on failure return 503. |
| Storage readable | Read `data/submissions.json` (or DB); on parse error or exception return 503. |

### 2.3 Uptime monitor (external)

- Use an uptime service (e.g. UptimeRobot, Better Uptime, Pingdom) to hit `https://your-domain.com/api/health` every 5–15 minutes.
- If the service gets non-2xx (or timeout), it can notify you (email, Slack, etc.).

### 2.4 Checklist

- [ ] Implement `GET /api/health` (and optional storage check).
- [ ] Deploy and verify `GET /api/health` returns 200 (and 503 when you simulate storage failure, if applicable).
- [ ] Sign up for an uptime monitor and point it at `/api/health`.
- [ ] Configure notifications (email/Slack) for “down” or “degraded.”

---

## Phase 3: End-to-End Submission Test

**Objective:** Periodically prove that a real submission flow works (form → API → storage).

### 3.1 Synthetic submission

- A scheduled job (cron on a server, or a cron service like Vercel Cron, GitHub Actions, or external “monitoring that can POST”) runs every N hours (e.g. 6–24).
- It sends a `POST /api/contact` with known test data (e.g. `company_name: "Monitoring Test"`, `problem: "E2E test"`).
- Success criteria:
  - Response is 200 and body includes `ok: true`.
  - Optional: call a small “last submission” API or read storage (e.g. another route or script) and confirm the test submission appears with the expected marker so you know the full path works.

### 3.2 Keep test data out of your real pipeline

- Use a clear test marker (e.g. email `monitoring-test@yourdomain.com`, company name `[E2E Test]`) and either:
  - Filter these out when you review “real” leads, or
  - Store them in a separate file/table used only for monitoring.

### 3.3 Checklist

- [ ] Create a script or config that POSTs to `/api/contact` with test data.
- [ ] Run it manually and confirm 200 and storage updated.
- [ ] Schedule it (cron, GitHub Actions, or monitoring service).
- [ ] Document how to identify and ignore test submissions when reviewing leads.
- [ ] Optional: add a private “last submission” or “recent count” endpoint for the monitor to verify (without exposing PII).

---

## Phase 4: Alerting and Runbooks

**Objective:** When something breaks, you know quickly and know what to do.

### 4.1 Alert channels

- Decide where you want alerts:
  - Email (simple; use your uptime/monitoring provider).
  - Slack/Discord (if you use them for work).
- Alerts should fire when:
  - Health endpoint returns non-2xx or times out.
  - E2E submission test fails (if you implemented Phase 3).
  - Optional: spike in 4xx/5xx from `/api/contact` (if you add metrics later).

### 4.2 Runbook

- Short document (can live in `Plans/` or `Website/`) that says:
  - What the contact form and API do.
  - Where submissions are stored (`data/submissions.json` or DB).
  - How to check API health manually (`GET /api/health`).
  - How to test a submission manually (browser + test data).
  - Common fixes: deployment rollback, check logs, check storage permissions, check env vars (if you add email/DB later).
  - Who to contact if you need help (if applicable).

### 4.3 Checklist

- [ ] Configure alerts for health and (if applicable) E2E failure.
- [ ] Write a one-page runbook and keep it updated when the form or API changes.
- [ ] Test the alert flow once (e.g. break health on purpose and confirm you get notified).

---

## Tech Notes

### Hosting considerations

- **Vercel (serverless):** Logs in Vercel Dashboard; no persistent filesystem, so `data/submissions.json` won’t work in production. Use a DB or external storage and point the API there; health check can verify DB connectivity.
- **VPS / Node server:** Logs to stdout or a file; `data/submissions.json` works; health can check file existence/write.
- **Other serverless:** Same idea as Vercel—rely on DB or external storage and log + health-check that.

### Optional: error-reporting service

- For client-side JS errors (e.g. form script fails), you can add Sentry, LogRocket, or similar later. Not required for Phase 1.

### Optional: metrics

- Later you could add simple metrics (e.g. count of 200 vs 5xx per day) via a logging/metrics service or a small DB table. Phase 1–2 don’t require it.

---

## Summary

| Phase | Focus | Outcome |
|-------|--------|---------|
| **1** | Logging + manual checks | You can see API and form behavior in logs and verify with a manual submit. |
| **2** | Health endpoint + uptime monitor | You get notified when the API or app is down or degraded. |
| **3** | E2E submission test | You periodically prove the full path (form → API → storage) works. |
| **4** | Alerting + runbook | You know when something’s wrong and what to do next. |

Start with **Phase 1** (logging + manual test); add **Phase 2** when you want automated “is it up?” checks and alerts. Phase 3 and 4 round out a solid monitoring setup for the form and API.
