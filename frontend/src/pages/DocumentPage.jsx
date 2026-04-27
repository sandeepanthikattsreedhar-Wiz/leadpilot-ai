import { useState } from "react";
import api from "../api";

export default function DocumentPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeDoc = async () => {
    setLoading(true);

    const res = await api.post("/ask-ai", { text });

    setResult(res.data.result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-4">
          AI Requirement Analyzer
        </h2>

        <textarea
          rows="12"
          className="w-full border rounded p-3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste document..."
        />

        <button
          onClick={analyzeDoc}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze with AI"}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow p-5 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}