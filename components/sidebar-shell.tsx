import Link from "next/link";

export function SidebarShell({
  user,
  children
}: {
  user: any;
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      {user ? (
        <aside className="sidebar">
          <div>
            <div className="brand-card">
              <div className="crest">SMC</div>
              <div>
                <h1>Save My Conference</h1>
                <p>V8 Final</p>
              </div>
            </div>

            <nav className="nav-links">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/speech-lab">Speech Lab</Link>
              <Link href="/quiz">Quiz Arena</Link>
              <Link href="/crisis">Crisis Simulator</Link>
              <Link href="/debate">Debate Arena</Link>
              <Link href="/pricing">Plans</Link>
              {user.role === "admin" ? <Link href="/admin">Admin Control</Link> : null}
            </nav>
          </div>

          <div className="user-mini">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <span className={`badge ${user.plan}`}>{user.role} • {user.plan}</span>
            <a className="ghost-link" href="/logout">
              Log out
            </a>
          </div>
        </aside>
      ) : null}

      <main className={`content ${!user ? "full" : ""}`}>{children}</main>
    </div>
  );
}
