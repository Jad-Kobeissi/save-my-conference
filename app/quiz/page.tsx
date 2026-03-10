import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizInteractive } from "@/components/quiz-client";
import { premiumAllowed } from "@/lib/usage";

export default async function QuizPage({
  searchParams
}: {
  searchParams: Promise<{ topic?: string; data?: string }>;
}) {
  const user = await requireUser();
  const files = await prisma.libraryFile.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" }
  });

  const allowed = premiumAllowed(user, "quiz");
  const params = await searchParams;
  const topic = params.topic || "";
  const quizData = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;

  return (
    <div className="grid two">
      <section className="paper">
        <div className="page-head"><div><span className="eyebrow">Study smart</span><h2>Quiz Arena</h2></div></div>
        {!allowed.ok ? <div className="flash error">{allowed.message}</div> : null}
        <form method="post" action="/api/tools/quiz" className="stack-form">
          <label>Topic<input name="topic" placeholder="Cybersecurity as collective defence" defaultValue={topic} /></label>
          <label>Select research files
            <select name="fileIds" multiple size={8}>
              {files.map((file) => <option key={file.id} value={file.id}>{file.originalName}</option>)}
            </select>
          </label>
          <button className="btn primary" disabled={!allowed.ok}>Generate quiz</button>
        </form>
      </section>
      <section className="paper">
        {quizData ? (
          <>
            <h3>Generated quiz{topic ? ` — ${topic}` : ""}</h3>
            <p className="subtle">Answers stay hidden until you submit or reveal them.</p>
            <QuizInteractive questions={quizData} />
          </>
        ) : (
          <p className="subtle">Pick a topic, optionally select files from your library, and the system will generate a quiz from actual research insights rather than raw text fragments.</p>
        )}
      </section>
    </div>
  );
}
