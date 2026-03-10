import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { id: "desc" }
  });

  const recentLogs = await prisma.activityLog.findMany({
    include: { user: true },
    orderBy: { id: "desc" },
    take: 20
  });

  const platformStats = {
    users: await prisma.user.count(),
    premium: await prisma.user.count({ where: { plan: "premium" } }),
    conferences: await prisma.conference.count(),
    files: await prisma.libraryFile.count()
  };

  return (
    <>
      <div className="page-head"><div><span className="eyebrow">Super admin</span><h2>Admin Control</h2></div></div>
      <div className="grid four compact-stats">
        <div className="paper stat-box"><strong>{platformStats.users}</strong><span>Total users</span></div>
        <div className="paper stat-box"><strong>{platformStats.premium}</strong><span>Premium users</span></div>
        <div className="paper stat-box"><strong>{platformStats.conferences}</strong><span>Conferences saved</span></div>
        <div className="paper stat-box"><strong>{platformStats.files}</strong><span>Library files</span></div>
      </div>

      <div className="grid two mt-24">
        <section className="paper wide">
          <div className="section-head"><h3>User management</h3></div>
          <div className="admin-users">
            {users.map((user) => (
              <div className="admin-user-card" key={user.id}>
                <div className="admin-user-top">
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                    <p className="subtle">Joined {new Date(user.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`badge ${user.plan}`}>{user.role} • {user.plan}</span>
                </div>

                <form method="post" action={`/api/admin/users/${user.id}/update`}>
                  <div className="admin-controls">
                    <label>Plan
                      <select name="plan" defaultValue={user.plan}>
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                      </select>
                    </label>
                    <label>Role
                      <select name="role" defaultValue={user.role}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>
                    <label>Status
                      <select name="isActive" defaultValue={user.isActive ? "1" : "0"}>
                        <option value="1">Active</option>
                        <option value="0">Suspended</option>
                      </select>
                    </label>
                  </div>

                  <div className="usage-mini">
                    <span>Quiz {user.usageQuiz}</span>
                    <span>Crisis {user.usageCrisis}</span>
                    <span>Debate {user.usageDebate}</span>
                    <span>Speech {user.usageSpeech}</span>
                  </div>

                  <div className="admin-action-row">
                    <button className="btn primary" type="submit">Save changes</button>
                  </div>
                </form>

                <form method="post" action={`/api/admin/users/${user.id}/delete`} style={{ marginTop: "10px" }}>
                  <button className="btn danger" type="submit">Delete</button>
                </form>
              </div>
            ))}
          </div>
        </section>

        <section className="paper">
          <div className="section-head"><h3>Recent activity</h3></div>
          <div className="list-block">
            {recentLogs.length ? recentLogs.map((log) => (
              <div className="list-row tall" key={log.id}>
                <div>
                  <strong>{log.action}</strong>
                  <p>{log.user?.email || "system"}</p>
                  {log.details ? <p>{log.details}</p> : null}
                  <p className="subtle">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )) : <p className="subtle">No activity yet.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
