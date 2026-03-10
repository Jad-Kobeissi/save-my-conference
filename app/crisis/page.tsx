import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { premiumAllowed } from "@/lib/usage";

export default async function CrisisPage({
  searchParams
}: {
  searchParams: Promise<{ data?: string; topic?: string; country?: string; committee?: string }>;
}) {
  const user = await requireUser();
  const files = await prisma.libraryFile.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" }
  });

  const allowed = premiumAllowed(user, "crisis");
  const params = await searchParams;
  const result = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;

  return (
    <div className="grid two">
      <section className="paper">
        <div className="page-head"><div><span className="eyebrow">Pressure training</span><h2>Crisis Simulator</h2></div></div>
        {!allowed.ok ? <div className="flash error">{allowed.message}</div> : null}
        <form method="post" action="/api/tools/crisis" className="stack-form">
          <label>Topic<input name="topic" placeholder="Cross-border cyber escalation" defaultValue={params.topic || ""} /></label>
          <label>Country<input name="country" placeholder="Spain" defaultValue={params.country || ""} /></label>
          <label>Committee<input name="committee" placeholder="NATO" defaultValue={params.committee || ""} /></label>
          <label>Select research files
            <select name="fileIds" multiple size={8}>
              {files.map((file) => <option key={file.id} value={file.id}>{file.originalName}</option>)}
            </select>
          </label>
          <button className="btn primary" disabled={!allowed.ok}>Generate crisis</button>
        </form>
      </section>
      <section className="paper">
        {result ? (
          <>
            <h3>Scenario</h3>
            <p>{result.scenario}</p>
            <h3>Intel</h3>
            <p>{result.intel}</p>
            <h3>Your objectives</h3>
            <ul className="clean-list">{result.tasks.map((item: string) => <li key={item}>{item}</li>)}</ul>
            <h3>What strong delegates use</h3>
            <ul className="clean-list">{result.benchmarks.map((item: string) => <li key={item}>{item}</li>)}</ul>
          </>
        ) : (
          <p className="subtle">Generate a fast, realistic scenario built from your research positions, risks, and likely policy moves.</p>
        )}
      </section>
    </div>
  );
}
