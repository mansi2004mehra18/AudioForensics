import React from "react";
import Waveform from "./Waveform";

export default function SpectrogramView({ score, isRecording, audioStream }) {
  return (
    <div className="col-span-12 lg:col-span-6">
      <div className="bg-black aspect-video rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center">
        
        <div className="absolute top-4 left-6 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-slate-700"}`} />
          <span className="text-[10px] font-mono text-slate-500 tracking-widest">
            LIVE_SPECTROGRAM_ANALYSIS
          </span>
        </div>

        {isRecording ? (
          <Waveform stream={audioStream} isRecording={isRecording} score={score} />
        ) : (
          <div className="text-slate-700 text-center">
            <p className="text-sm font-mono tracking-widest uppercase">System Idle</p>
            <p className="text-[10px] mt-2 italic">
              Initialize scan to begin deep analytics
            </p>
          </div>
        )}

      </div>
    </div>
  );
}