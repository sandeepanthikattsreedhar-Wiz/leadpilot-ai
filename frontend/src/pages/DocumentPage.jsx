import { useState } from "react";

export default function DocumentPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const analyzeDoc = () => {
    const lines = text
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const summary = lines.slice(0, 5).join(" ");

    const tasks = lines.filter(
      (x) =>
        x.toLowerCase().includes("need") ||
        x.toLowerCase().includes("must") ||
        x.toLowerCase().includes("should") ||
        x.toLowerCase().includes("implement") ||
        x.toLowerCase().includes("fix")
    );

    const risks = lines.filter(
      (x) =>
        x.toLowerCase().includes("delay") ||
        x.toLowerCase().includes("risk") ||
        x.toLowerCase().includes("issue") ||
        x.toLowerCase().includes("blocked")
    );

    setResult({
      summary,
      tasks,
      risks,
      logic:
        "This document describes requested business changes and implementation expectations.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-4">
          Paste Requirement Document
        </h2>

        <textarea
          rows="12"
          className="w-full border rounded p-3"
          placeholder="Paste BRD / specs / requirement notes here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={analyzeDoc}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
        >
          Analyze Document
        </button>
      </div>

      {result && (
        <>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-gray-700">{result.summary}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-2">
              Explained Simply
            </h3>
            <p className="text-gray-700">{result.logic}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-2">
              Action Items
            </h3>

            <ul className="list-disc pl-5 space-y-1">
              {result.tasks.length === 0 ? (
                <li>No clear actions detected</li>
              ) : (
                result.tasks.map((item, i) => (
                  <li key={i}>{item}</li>
                ))
              )}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-2">
              Risks / Blockers
            </h3>

            <ul className="list-disc pl-5 space-y-1">
              {result.risks.length === 0 ? (
                <li>No risks detected</li>
              ) : (
                result.risks.map((item, i) => (
                  <li key={i}>{item}</li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}