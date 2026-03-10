import { requireUser } from "@/lib/auth";
import { premiumAllowed } from "@/lib/usage";
import { redirect } from "next/navigation";

export default async function SpeechLabPage({
  searchParams
}: {
  searchParams: Promise<{ speech_text?: string; data?: string }>;
}) {
  const user = await requireUser();
  const allowed = premiumAllowed(user, "speech");
  const params = await searchParams;
  const speechText = params.speech_text || "";
  const result = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;

  return (
    <div className="grid two">
      <section className="paper">
        <div className="page-head"><div><span className="eyebrow">AI rhetoric</span><h2>Speech Lab</h2></div></div>
        {!allowed.ok ? <div className="flash error">{allowed.message}</div> : null}
        <form method="post" action="/api/tools/speech" className="stack-form">
          <label>Paste your speech<textarea name="speech_text" rows={16} placeholder="Paste your full speech here..." required defaultValue={speechText}></textarea></label>
          <button className="btn primary" disabled={!allowed.ok}>Analyze speech</button>
        </form>
      </section>
      <section className="paper">
        {result ? (
          <>
            <div className="score-box">Score <span>{result.score}/100</span></div>
            <h3>Strengths</h3>
            <ul className="clean-list">{result.strengths.map((item: string) => <li key={item}>{item}</li>)}</ul>
            <h3>Improve</h3>
            <ul className="clean-list">{result.improvements.map((item: string) => <li key={item}>{item}</li>)}</ul>
            <h3>Suggested opening</h3>
            <div className="quote-box">{result.revised_opening}</div>
          </>
        ) : (
          <p className="subtle">Paste a speech and get a clear score, strengths, improvements, and a sharper opening line.</p>
        )}
      </section>
    </div>
  );
}
