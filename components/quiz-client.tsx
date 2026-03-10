"use client";

import { useState } from "react";

export function QuizInteractive({ questions }: { questions: any[] }) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [shown, setShown] = useState<Record<number, { reveal: boolean; checked: boolean }>>({});

  function show(idx: number, reveal = false) {
    setShown((p) => ({ ...p, [idx]: { reveal, checked: !reveal } }));
  }

  return (
    <>
      {questions.map((q, idx) => {
        const chosen = selected[idx] || "";
        const state = shown[idx];
        const revealed = !!state;
        const correct = chosen === q.answer;
        return (
          <div key={idx} className="question-card">
            <div className="question-meta">{q.kind}</div>
            <strong>Q{idx + 1}. {q.question}</strong>
            <p>{q.statement}</p>
            <div className="option-stack">
              {q.options.map((opt: string) => (
                <label key={opt} className="option-row">
                  <input
                    type="radio"
                    name={`quiz_${idx}`}
                    value={opt}
                    checked={chosen === opt}
                    onChange={() => setSelected((p) => ({ ...p, [idx]: opt }))}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <div className="quiz-actions">
              <button className="btn secondary" type="button" onClick={() => show(idx, false)}>
                Submit answer
              </button>
              <button className="btn ghost" type="button" onClick={() => show(idx, true)}>
                Reveal answer
              </button>
            </div>

            {revealed && (
              <div className={`result-box ${state?.reveal ? "" : correct ? "correct" : "incorrect"}`}>
                <strong>
                  {state?.reveal ? "Answer revealed" : !chosen ? "Select an option first" : correct ? "Correct" : "Not quite"}
                </strong>
                <p>Correct answer: {q.answer}</p>
                <p className="subtle">{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
