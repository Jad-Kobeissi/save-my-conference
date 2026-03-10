import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <section className="hero">
      <div className="hero-panel paper">
        <span className="eyebrow">Notion clarity • Parliament authority</span>
        <h1>The MUN platform that actually feels complete.</h1>
        <p>
          Create conferences, upload research, train with quizzes, run crisis drills,
          practice debates, and manage real users with a real admin system.
        </p>

        <div className="cta-row">
          <Link className="btn primary" href="/signup">
            Create account
          </Link>
          <Link className="btn secondary" href="/login">
            Log in
          </Link>
        </div>

        <div className="feature-grid">
          <div className="mini-card"><strong>Speech Lab</strong><span>AI-style feedback with fallback mode</span></div>
          <div className="mini-card"><strong>Admin Control</strong><span>Upgrade users to premium manually</span></div>
          <div className="mini-card"><strong>Study Hub</strong><span>Upload PDF, DOCX, TXT research</span></div>
          <div className="mini-card"><strong>Debate Arena</strong><span>Train against simulated delegations</span></div>
        </div>
      </div>
    </section>
  );
}
