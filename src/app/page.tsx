import Link from "next/link";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE || "+971 4 000 0000";
const TALLY_URL = process.env.NEXT_PUBLIC_TALLY_URL || "#start";

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <div className="container nav-inner">
          <div className="brand">
            AnswerFirst<span> AI</span>
          </div>
          <div className="nav-links">
            <Link href="/dashboard">Live demo dashboard</Link>
            <a href={`tel:${DEMO_PHONE.replace(/[^+\d]/g, "")}`} className="btn btn-primary" style={{ padding: "9px 18px" }}>
              Call the AI
            </a>
          </div>
        </div>
      </nav>

      <section className="hero container">
        <span className="pill">Your competitor just called that Bayut lead back. Did you?</span>
        <h1>
          Every lead answered in
          <br />
          <span className="grad">under 60 seconds.</span>
        </h1>
        <p className="sub">
          Portal leads go cold in minutes - and the first broker to respond usually wins
          the client. Our AI answers every call and inquiry instantly, in English or
          Arabic, qualifies the buyer, books the viewing, and alerts you the moment a
          hot lead appears.
        </p>
        <div className="cta-row">
          <a href={`tel:${DEMO_PHONE.replace(/[^+\d]/g, "")}`} className="btn btn-primary">
            Call our live demo: {DEMO_PHONE}
          </a>
          <Link href="/dashboard" className="btn btn-ghost">
            See the agent dashboard
          </Link>
        </div>

        <div className="stats-strip">
          <div className="stat-mini">
            <b>78%</b>
            <span>of clients go with the first responder</span>
          </div>
          <div className="stat-mini">
            <b>&lt; 5 min</b>
            <span>reply window before a lead goes cold</span>
          </div>
          <div className="stat-mini">
            <b>3+</b>
            <span>brokers contacted per buyer inquiry</span>
          </div>
          <div className="stat-mini">
            <b>24/7</b>
            <span>nights, weekends, Eid, everything</span>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="grid">
          <div className="card">
            <span className="icon">&#9889;</span>
            <h3>Instant first response</h3>
            <p>
              Answers in under two rings with your agency name. No more Bayut leads
              expiring while your agents are mid-viewing.
            </p>
          </div>
          <div className="card">
            <span className="icon">&#128269;</span>
            <h3>Qualifies automatically</h3>
            <p>
              Buy or rent, area, bedrooms, budget, timeline, cash or mortgage -
              captured on the very first call and logged to your dashboard.
            </p>
          </div>
          <div className="card">
            <span className="icon">&#128197;</span>
            <h3>Books viewings live</h3>
            <p>
              Offers real slots and locks in viewings during the call. Confirmation
              lands in your calendar before the client hangs up.
            </p>
          </div>
          <div className="card">
            <span className="icon">&#128227;</span>
            <h3>Hot-lead alerts</h3>
            <p>
              Cash buyers, AED 5M+ budgets, urgent movers - flagged to your senior
              agent immediately, plus an email summary of every call.
            </p>
          </div>
        </div>
      </section>

      <section className="section container steps">
        <h2 style={{ textAlign: "center", marginBottom: 28 }}>How it works</h2>
        <div className="card">
          <div className="step">
            <div className="step-num" />
            <div>
              <h3 style={{ margin: "0 0 6px" }}>Forward your line</h3>
              <p>
                One dial code routes missed or after-hours calls to your AI desk. Keep
                your existing number, carrier, and WhatsApp.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-num" />
            <div>
              <h3 style={{ margin: "0 0 6px" }}>Train it on your agency</h3>
              <p>
                Areas you cover, buildings you list, how you qualify clients. Live in
                48 hours, speaking English and Arabic like a Dubai local.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-num" />
            <div>
              <h3 style={{ margin: "0 0 6px" }}>Watch viewings appear</h3>
              <p>
                Every lead handled, viewing booked, and dirham of pipeline created
                shows up in your dashboard and weekly report.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section container" id="start">
        <h2 style={{ textAlign: "center", marginBottom: 28 }}>Simple pricing</h2>
        <div className="card pricing-card">
          <div className="price">
            AED 1,499<small>/mo per agent line</small>
          </div>
          <ul className="price-list">
            <li>Up to 300 conversations per month included</li>
            <li>Bilingual English + Arabic answering</li>
            <li>Automatic qualification + live viewing bookings</li>
            <li>Instant hot-lead escalation to your mobile</li>
            <li>Email summaries with full transcripts</li>
            <li>Weekly pipeline report - cancel anytime</li>
          </ul>
          <a href={TALLY_URL} className="btn btn-primary">
            Start my 14-day pilot
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          AnswerFirst AI &copy; 2026 &middot; AI lead desk for Dubai real-estate teams
          &middot; <Link href="/dashboard">Dashboard</Link>
        </div>
      </footer>
    </main>
  );
}
