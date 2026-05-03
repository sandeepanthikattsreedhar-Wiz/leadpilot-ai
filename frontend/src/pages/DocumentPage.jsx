import { useState } from "react";

export default function DocsPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [doneSteps, setDoneSteps] = useState([]);
  const [data, setData] = useState(null);

  const steps = [
    "Uploading document",
    "Extracting content",
    "Understanding business logic",
    "Detecting risks",
    "Generating summary",
    "Creating visuals",
    "Finalizing insights",
  ];

  const runExperience = async () => {
    let completed = [];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);

      for (let p = i * 14; p <= (i + 1) * 14; p++) {
        setProgress(Math.min(p, 100));
        await new Promise((r) => setTimeout(r, 25));
      }

      completed.push(steps[i]);
      setDoneSteps([...completed]);

      await new Promise((r) => setTimeout(r, 250));
    }

    setProgress(100);
  };

  const analyze = async () => {
    setLoading(true);
    setData(null);
    setProgress(0);
    setDoneSteps([]);

    const form = new FormData();
    form.append("text", text);
    if (file) form.append("file", file);

    const ui = runExperience();

    const api = fetch("http://127.0.0.1:8000/analyze-doc", {
      method: "POST",
      body: form,
    }).then((r) => r.json());

    const [, result] = await Promise.all([ui, api]);

    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">
          AI Docs Intelligence Hub
        </h2>

        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full border p-3 rounded-xl"
        />

        <textarea
          rows="8"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste document text..."
          className="w-full border p-4 rounded-xl"
        />

        <button
          onClick={analyze}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Analyze Document
        </button>
      </div>

      {loading && (
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto">
                <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>

                <div
                  className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent animate-spin"
                ></div>

                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                  {progress}%
                </div>
              </div>

              <p className="mt-5 text-lg text-blue-300">
                AI Analysis Engine Running
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Processing like a senior project consultant
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Live Progress
              </h3>

              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6">
                      {doneSteps.includes(step) ? "✅" :
                       currentStep === step ? "🔄" : "⭕"}
                    </div>

                    <div
                      className={
                        currentStep === step
                          ? "text-blue-300"
                          : doneSteps.includes(step)
                          ? "text-green-300"
                          : "text-slate-400"
                      }
                    >
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-slate-800 rounded-xl p-4 text-sm text-slate-300">
                Smart Insight: Detecting missing dependencies and hidden risks...
              </div>
            </div>
          </div>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-xl font-bold mb-3">
            Executive Summary
          </h3>

          <p>{data.summary}</p>
        </div>
      )}
    </div>
  );
}