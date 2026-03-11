import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();

  const conferences = await prisma.conference.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" }
  });

  const files = await prisma.libraryFile.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" }
  });

  const stats = {
    conferenceCount: conferences.length,
    fileCount: files.length
  };

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Command center</span>
          <h2>Dashboard</h2>
          <p className="subtle">Everything important stays in one place now.</p>
        </div>
        <div className="badge-row">
          <span className="badge neutral">{stats.conferenceCount} conferences</span>
          <span className="badge neutral">{stats.fileCount} files</span>
        </div>
      </div>

      <div className="grid two">
        <section className="paper">
          <div className="section-head">
            <h3>Create Conference</h3>
            <span className="subtle">Fixed date and time picker</span>
          </div>

          <form method="post" action="/api/conferences/create" className="stack-form">
            <label>Conference name<input name="name" required /></label>
            <label>Committee<input name="committee" required /></label>
            <label>Country<input name="country" required /></label>
            <label>Topic<input name="topic" required /></label>
            <label>Date and time<input type="datetime-local" name="eventDatetime" required defaultValue={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} /></label>
            <label>Summary<textarea name="summary" rows={4} placeholder="Main notes, goals, strategy..."></textarea></label>
            <button className="btn primary" type="submit">Save conference</button>
          </form>
        </section>

        <section className="paper">
          <div className="section-head">
            <h3>Research Library</h3>
            <span className="subtle">Upload multiple files at once</span>
          </div>

          <form method="post" action="/api/library/upload" encType="multipart/form-data" className="stack-form">
            <label>Choose files<input type="file" name="files" multiple accept=".txt,.pdf,.docx" required /></label>
            <button className="btn primary" type="submit">Upload to library</button>
          </form>

          <div className="list-block">
            {files.length ? files.map((file) => (
              <div className="list-row" key={file.id}>
                <div>
                  <strong>{file.originalName}</strong>
                  <p>{file.fileType.toUpperCase()} • {new Date(file.uploadedAt).toLocaleString()}</p>
                </div>
                <a className="ghost-link" href={`/api/library/download/${file.id}`}>Download</a>
              </div>
            )) : <p className="subtle">No research uploaded yet.</p>}
          </div>
        </section>
      </div>

      <div className="grid two mt-24">
        <section className="paper">
          <div className="section-head"><h3>Your Conferences</h3></div>
          <div className="list-block">
            {conferences.length ? conferences.map((c) => (
              <div className="list-row tall" key={c.id}>
                <div>
                  <strong>{c.name}</strong>
                  <p>{c.committee} • {c.country}</p>
                  <p><strong>Topic:</strong> {c.topic}</p>
                  <p><strong>Date:</strong> {c.eventDatetime}</p>
                  {c.summary ? <p>{c.summary}</p> : null}
                </div>
              </div>
            )) : <p className="subtle">No conferences saved yet.</p>}
          </div>
        </section>

        <section className="paper">
          <div className="section-head"><h3>Tool Access</h3></div>
          <div className="tool-grid">
            <Link className="tool-card" href="/speech-lab"><strong>Speech Lab</strong><span> Evaluate speeches and tighten rhetoric.</span></Link>
            <Link className="tool-card" href="/quiz"><strong>Quiz Arena</strong><span> Generate practice questions from your material.</span></Link>
            <Link className="tool-card" href="/crisis"><strong>Crisis Simulator</strong><span> Practice emergency responses under pressure.</span></Link>
            <Link className="tool-card" href="/debate"><strong>Debate Arena</strong><span> Train against a simulated opponent country.</span></Link>
          </div>
        </section>
      </div>
    </>
  );
}
