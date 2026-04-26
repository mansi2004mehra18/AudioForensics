import React from "react";
import { Mic, MicOff } from "lucide-react";

export default function Header({ isRecording, toggleScan }) {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <h1 className="text-xl font-bold">SafeVoice Forensics</h1>

      <button
        onClick={toggleScan}
        className={`px-6 py-2 rounded-full ${
          isRecording ? "bg-red-600" : "bg-emerald-600"
        }`}
      >
        {isRecording ? <MicOff /> : <Mic />}
      </button>
    </div>
  );
}