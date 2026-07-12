import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { listExamples } from "../services/exampleService.js";
import { listExamplesMock } from "../mocks/api/exampleMock.js";
import { aiComplete } from "../services/aiService.js";
import Loading from "../components/feedback/Loading.jsx";
import ErrorState from "../components/feedback/ErrorState.jsx";
import EmptyState from "../components/feedback/EmptyState.jsx";
import Card from "../components/common/Card.jsx";

// Set to `listExamples` once the backend/db is up and migrated.
// Using the mock by default so this page renders with zero setup.
const fetchExamples = listExamplesMock;

export default function Home() {
  const { data: examples, loading, error } = useFetch(fetchExamples, []);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  async function handleAskAi() {
    setAiLoading(true);
    try {
      // Calls POST /api/ai/complete — never call an AI provider directly
      // from the frontend.
      const res = await aiComplete("Say hello to a hackathon team.");
      setAiResult(res.success ? res.data.text : res.error);
    } catch (err) {
      setAiResult(err.message);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">🚀 Hackathon Starter</h1>
      <p className="text-gray-600 mb-6">
        Frontend talks to an Express + PostgreSQL backend over REST. AI calls
        go through the same API. Edit <code>src/pages/Home.jsx</code> to
        start building.
      </p>

      <Card className="mb-4">
        <h2 className="font-semibold mb-2">Backend-backed list</h2>
        {loading && <Loading />}
        {error && <ErrorState message={error.message} />}
        {!loading && !error && examples?.length === 0 && <EmptyState />}
        {!loading && !error && examples?.length > 0 && (
          <ul className="text-sm text-gray-700 list-disc pl-5">
            {examples.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">AI Router (via Express)</h2>
        <button
          onClick={handleAskAi}
          disabled={aiLoading}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-50"
        >
          {aiLoading ? "Asking..." : "Ask AI"}
        </button>
        {aiResult && <p className="mt-3 text-sm text-gray-700">{aiResult}</p>}
      </Card>
    </div>
  );
}
