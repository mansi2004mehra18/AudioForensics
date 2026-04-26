import React from "react";

import { Database } from "lucide-react";

export default function StatusPanel({ score, status, isRecording }) {
  return (
    <div className="col-span-12 lg:col-span-3 space-y-4">
      
      <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <Database size={14} /> Session Data
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">STREAM:</span>
            <span className={isRecording ? "text-emerald-400" : "text-slate-600"}>
              {isRecording ? "ACTIVE" : "OFFLINE"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">CODEC:</span>
            <span>G.711 PCMU</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">LATENCY:</span>
            <span>42ms</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
        <div className={`text-xs font-bold mb-2 ${score > 0.7 ? "text-red-500" : "text-emerald-500"}`}>
          STATUS: {status}
        </div>

        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isRecording ? "bg-emerald-500 animate-pulse" : "bg-slate-700"
            }`}
            style={{ width: isRecording ? "100%" : "0%" }}
          />
        </div>
      </div>

    </div>
  );
}