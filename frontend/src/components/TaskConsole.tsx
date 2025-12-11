import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskConsole({ graph }: { graph: any }) {
  if (!graph) {
    return <div className="text-sm text-gray-400">No run selected. Launch a run to see tasks and results.</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Tasks</h3>
      <div className="space-y-2">
        {graph.nodes.map((n: any) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-[#04131a] border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badgeColor(n.status)}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1"/></svg>
                </div>
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.payload?.instruction ?? ""}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-mono text-gray-300">{n.status?.toUpperCase()}</div>
                <div className="text-xs text-gray-400 mt-1">{formatTime(n)}</div>
              </div>
            </div>

            <AnimatePresence>
              <motion.pre initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 bg-[#06171d] p-2 rounded text-sm text-gray-200 overflow-auto">
                {JSON.stringify(n.result || {}, null, 2)}
              </motion.pre>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function badgeColor(status: string) {
  switch (status) {
    case "running": return "bg-amber-600";
    case "success": return "bg-emerald-600";
    case "failed": return "bg-rose-600";
    default: return "bg-sky-600";
  }
}

function formatTime(n: any) {
  const start = n.started_at ? new Date(n.started_at * 1000).toLocaleTimeString() : null;
  const finish = n.finished_at ? new Date(n.finished_at * 1000).toLocaleTimeString() : null;
  if (finish) return `${start ?? "—"} → ${finish}`;
  if (start) return `${start} • running`;
  return "pending";
}
