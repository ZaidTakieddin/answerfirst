import Link from "next/link";
import { computeStats, getRecentCalls, isDbConfigured } from "@/lib/db";
import { fmtDateTime, fmtDuration, fmtMoney } from "@/lib/format";
import type { Outcome } from "@/lib/types";

export const dynamic = "force-dynamic";

const OUTCOME_LABEL: Record<Outcome, string> = {
  booked: "Booked",
  info: "Info",
  voicemail: "Callback",
  escalated: "Escalated",
  spam: "Spam",
  failed: "Failed",
};

export default async function Dashboard() {
  const calls = await getRecentCalls(100);
  const stats = computeStats(calls);
  const live = isDbConfigured();

  return (
    <main>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand">
            AnswerFirst<span> AI</span>
          </Link>
          <div className="nav-links">
            <span className="mode-tag">
              {live ? "LIVE - Supabase connected" : "DEMO MODE - add Supabase keys"}
            </span>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="dash-head">
          <h1>Call activity</h1>
          <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
            Last {calls.length} calls &middot; refresh to update
          </span>
        </div>

        <div className="stat-cards">
          <div className="card">
            <div className="stat-value">{stats.totalCalls}</div>
            <div className="stat-label">Leads handled</div>
          </div>
          <div className="card">
            <div className="stat-value" style={{ color: "var(--accent-2)" }}>
              {stats.booked}
            </div>
            <div className="stat-label">Viewings booked</div>
          </div>
          <div className="card">
            <div className="stat-value">{fmtMoney(stats.pipelineValueAed)}</div>
            <div className="stat-label">Est. pipeline value</div>
          </div>
          <div className="card">
            <div className="stat-value">{fmtDuration(stats.avgDurationSec)}</div>
            <div className="stat-label">Avg call length</div>
          </div>
        </div>

        <div className="card table-wrap">
          <table className="calls">
            <thead>
              <tr>
                <th>When</th>
                <th>Caller</th>
                <th>Outcome</th>
                <th>Length</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {calls.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: "var(--muted)", textAlign: "center", padding: 32 }}>
                    No calls yet. Once your Vapi assistant is live, calls appear here
                    automatically.
                  </td>
                </tr>
              )}
              {calls.map((c) => (
                <tr key={c.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDateTime(c.started_at)}</td>
                  <td>{c.caller_number ?? "Unknown"}</td>
                  <td>
                    <span className={`badge b-${c.outcome ?? "failed"}`}>
                      {OUTCOME_LABEL[c.outcome ?? "failed"]}
                    </span>
                  </td>
                  <td>{fmtDuration(c.duration_seconds)}</td>
                  <td className="summary-cell">
                    {c.summary || "-"}
                    {c.transcript && (
                      <details className="transcript">
                        <summary>Transcript</summary>
                        <pre>{c.transcript}</pre>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!live && (
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", padding: "16px 4px 40px" }}>
            You are seeing sample data. Add NEXT_PUBLIC_SUPABASE_URL and
            SUPABASE_SERVICE_ROLE_KEY to .env.local (see README) and apply the migration in
            supabase/migrations/0001_init.sql to go live.
          </p>
        )}
      </div>

      <footer className="footer">
        <div className="container">AnswerFirst AI &copy; 2026</div>
      </footer>
    </main>
  );
}
