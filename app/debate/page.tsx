import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { premiumAllowed } from "@/lib/usage";

export default async function DebatePage({
  searchParams
}: {
  searchParams: Promise<{ data?: string; your_country?: string; opponent_country?: string; topic?: string }>;
}) {
  const user = await requireUser();
  const files = await prisma.libraryFile.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" }
  });

  const allowed = premiumAllowed(user, "debate");
  const params = await searchParams;
  const result = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;

  return (
    <div className="grid two">
      <section className="paper">
        <div className="page-head"><div><span className="eyebrow">Direct clash</span><h2>Debate Arena</h2></div></div>
        {!allowed.ok ? <div className="flash error">{allowed.message}</div> : null}
        <form method="post" action="/api/tools/debate" className="stack-form">
          <label>Your country<input name="your_country" placeholder="Spain" defaultValue={params.your_country || ""} /></label>
          <label>Opponent country<input name="opponent_country" placeholder="Türkiye" defaultValue={params.opponent_country || ""} /></label>
          <label>Topic<input name="topic" placeholder="Cybersecurity as collective defence" defaultValue={params.topic || ""} /></label>
          <label>Select research files
            <select name="fileIds" multiple size={8}>
              {files.map((file) => <option key={file.id} value={file.id}>{file.originalName}</option>)}
            </select>
          </label>
          <button className="btn primary" disabled={!allowed.ok}>Start debate</button>
        </form>
      </section>
      <section className="paper">
        {result ? (
          <>
            <h3>Opponent opening</h3>
            <div className="quote-box">{result.opener}</div>
            <h3>Pressure points</h3>
            <ul className="clean-list">{result.pressurePoints.map((item: string) => <li key={item}>{item}</li>)}</ul>
            <h3>Your best counters</h3>
            <ul className="clean-list">{result.bestCounters.map((item: string) => <li key={item}>{item}</li>)}</ul>
          </>
        ) : (
          <p className="subtle">Generate an opponent that actually challenges the logic of your research instead of echoing random file text.</p>
        )}
      </section>
    </div>
  );
}
