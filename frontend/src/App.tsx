import React, { useEffect, useMemo, useState } from "react";
import GraphView from "./components/GraphView";
import TaskConsole from "./components/TaskConsole";
import WsClient from "./components/WsClient";
import { motion } from "framer-motion";
import clsx from "clsx";
import Logo from "./components/Logo";

type Graph = {
  nodes: any[];
  edges: any[];
  meta?: any;
};

export default function App() {
  const [goal, setGoal] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const [history, setHistory] = useState<
    Array<{ id: string; goal: string; startedAt: string }>
  >([]);
  const ws = useMemo(() => WsClient(), []);

  useEffect(() => {
    if (!runId) return;
    ws.connect(runId, (msg) => {
      if (msg.type === "node_update" || msg.type === "node_state") {
        fetch(`/api/graph-state/${runId}`)
          .then((r) => r.json())
          .then((g) => setGraph(g));
      }
      if (msg.type === "run_complete") {
        setStatus("done");
      }
    });
    fetch(`/api/graph-state/${runId}`)
      .then((r) => r.json())
      .then((g) => setGraph(g));
    return () => {
      ws.disconnect();
    };
  }, [runId]);

  async function submit(overrideGoal?: string) {
    const localGoal = typeof overrideGoal === "string" ? overrideGoal : goal;
    if (!localGoal.trim()) return;
    setStatus("starting");
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ goal: localGoal })
    });
    const data = await res.json();
    const id = data.run_id;
    setRunId(id);
    setStatus("running");
    setHistory((h) => [
      { id, goal: localGoal.slice(0, 120), startedAt: new Date().toISOString() },
      ...h
    ]);
  }

  function resetState() {
    setGoal("");
    setRunId(null);
    setGraph(null);
    setStatus("idle");
  }

  const demoGoal =
    "Define system requirements and workflow structure. Ingest and validate raw input data. Execute transformation, analysis, and decision logic. Persist and version outputs. Deploy, monitor, and verify end-to-end workflow execution.";

  function runDemo() {

    setGoal(demoGoal);
    submit(demoGoal);
  }

  return (
    <div className="min-h-screen text-gray-100">
      <header className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-neutral-900 to-bg/60">
        <div className="flex items-center gap-4">

          <Logo />

          <div>
            <div className="text-xl font-semibold">Autonomous Workflow Engineer</div>
            <div className="text-sm text-gray-400">Live DAG Visualization</div>
          </div>
        </div>

        <div className="flex items-center gap-3">

        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto grid grid-cols-12 gap-6">

        <section className="col-span-12 lg:col-span-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-panel border border-slate-800"
          >
            <h2 className="text-lg font-semibold mb-2">New Run</h2>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe a high-level goal e.g. 'Scrape example.com, extract H1, summarize' "
              className="w-full p-3 rounded bg-[#071b24] border border-slate-700 text-sm min-h-[120px]"
            />

            <div className="mt-3 flex items-center gap-3">

              <button
                onClick={() => submit()}
                className="px-5 py-2.5 rounded-xl
                           bg-gradient-to-r from-accent to-purple-600
                           hover:brightness-110 transition-all
                           shadow-lg shadow-purple-900/20 text-white font-medium
                           min-w-[112px] text-center"
              >
                Launch
              </button>

              <button
                onClick={resetState}
                className="px-5 py-2.5 rounded-xl
                           bg-gradient-to-r from-accent to-purple-600
                           hover:brightness-110 transition-all
                           shadow-lg shadow-purple-900/20 text-white font-medium
                           min-w-[112px] text-center"
              >
                Reset
              </button>

              <div className="text-sm text-gray-400 ml-2">
                Run ID: <span className="font-mono text-xs ml-2">{runId ?? "—"}</span>
              </div>
            </div>
          </motion.div>

          <div className="p-4 rounded-lg bg-panel border border-slate-800">
            <h3 className="text-md font-semibold mb-3">Recent Runs</h3>
            <div className="space-y-2 max-h-48 overflow-auto">
              {history.length === 0 && (
                <div className="text-sm text-gray-400">No runs yet.</div>
              )}
              {history.map((h) => (
                <div
                  key={h.id}
                  className="p-2 rounded bg-[#06141a] flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium">{h.goal}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(h.startedAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => setRunId(h.id)}
                      className="px-2 py-1 text-xs rounded bg-slate-700"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-panel border border-slate-800">
            <h3 className="text-md font-semibold mb-2">About</h3>
            <p className="text-sm text-gray-300">
              AWE breaks your high-level goal into steps, runs them autonomously,
              and shows a live DAG of progress.
            </p>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-8 space-y-4">
          <div className="relative p-4 rounded-lg bg-panel border border-slate-800 overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <svg
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                viewBox="0 0 800 400"
                className="w-full h-full"
              >
                <defs>
                  <radialGradient id="g1" cx="20%" cy="20%">
                    <stop offset="0%" stopColor="#2a1640" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#02060a" stopOpacity="0.0" />
                  </radialGradient>
                  <radialGradient id="g2" cx="80%" cy="80%">
                    <stop offset="0%" stopColor="#3b1b7a" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#02060a" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                <rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" />
                <ellipse cx="700" cy="320" rx="260" ry="120" fill="url(#g2)" />
              </svg>
            </div>

            <div className="relative z-10 min-h-[460px]">
              <GraphView graph={graph} />
            </div>

            {!graph && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-gradient-to-r from-[#04121a]/60 to-[#071822]/40 border border-slate-700 p-6 rounded-lg text-center max-w-md shadow-lg">
                  <svg
                    className="mx-auto mb-3"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 7a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 6h3a1 1 0 011 1v10a1 1 0 01-1 1h-3" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 9h3" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12h3" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  <h4 className="text-lg font-semibold text-white mb-1">No run selected</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Launch a run to see tasks and results live. Try the demo goal to
                    see an example DAG and task progress.
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={runDemo}
                      className="px-5 py-2.5 rounded-xl
                                 bg-gradient-to-r from-accent to-purple-600
                                 hover:brightness-110 transition-all
                                 shadow-lg shadow-purple-900/20 text-white font-medium
                                 min-w-[140px] text-center"
                    >
                      Try demo goal
                    </button>
                    <button
                      onClick={() => {
                        setGoal(demoGoal);
                        const ta = document.querySelector("textarea");
                        (ta as HTMLTextAreaElement | null)?.focus();
                      }}
                      className="px-5 py-2.5 rounded-xl
                                 bg-slate-700 hover:brightness-95 transition-all
                                 shadow-md text-white font-medium
                                 min-w-[140px] text-center"
                    >
                      Edit goal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-panel border border-slate-800">
            <TaskConsole graph={graph} />
          </div>
        </section>
      </main>
    </div>
  );
}

