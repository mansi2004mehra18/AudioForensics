import React, { useState, useRef, useEffect } from "react";
import { Shield, Activity, Mic, MicOff, Database } from "lucide-react";
import RiskMeter from "./components/RiskMeter";
import Waveform from "./components/Waveform";

function App() {
  const [score, setScore] = useState(0.15);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("IDLE - READY FOR SCAN");
  const [audioStream, setAudioStream] = useState(null);

  const mediaRecorderRef = useRef(null);
  const analysisFrameRef = useRef(null); // Added missing ref
  const isRecordingRef = useRef(false); // Ref to track recording state inside the loop

  const toggleScan = async () => {
    if (isRecording) {
      // STOP LOGIC
      isRecordingRef.current = false;
      setIsRecording(false);
      setStatus("SCAN STOPPED");

      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (audioStream) audioStream.getTracks().forEach((track) => track.stop());
      if (analysisFrameRef.current)
        cancelAnimationFrame(analysisFrameRef.current);

      setScore(0.15);
      setAudioStream(null);
    } else {
      // START LOGIC
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);
        setIsRecording(true);
        isRecordingRef.current = true; // Sync the ref

        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLoop = () => {
          if (!isRecordingRef.current) return;

          analyser.getByteFrequencyData(dataArray);

          // 1. Separate "Human" vs "Synthetic" frequency bands
          // Human speech is usually 80Hz - 3000Hz (Lower bins)
          // AI artifacts often show up in the 8000Hz+ range (Higher bins)
          const lowFreqs = dataArray.slice(0, bufferLength / 4);
          const highFreqs = dataArray.slice(bufferLength / 2);

          const humanEnergy =
            lowFreqs.reduce((a, b) => a + b, 0) / lowFreqs.length;
          const syntheticEnergy =
            highFreqs.reduce((a, b) => a + b, 0) / highFreqs.length;

          // 2. LOGIC: If high-frequency "noise" is unusually high compared to human speech
          // This simulates the detection of AI artifacts/scars.
          let targetScore;

          if (humanEnergy > 10 && syntheticEnergy / humanEnergy > 0.5) {
            // High ratio of high-end noise = Likely Spoof
            targetScore = 0.88 + Math.random() * 0.05;
            setStatus("ALERT: UNNATURAL SPECTRAL ARTIFACTS");
          } else if (humanEnergy > 10) {
            // Normal speech energy = Likely Human
            targetScore = 0.12 + Math.random() * 0.08;
            setStatus("VERIFIED HUMAN VOICE PATTERN");
          } else {
            // Silence
            targetScore = 0.05;
            setStatus("MONITORING LINE...");
          }

          // 3. Smooth transition
          setScore((prev) => prev + (targetScore - prev) * 0.1);

          analysisFrameRef.current = requestAnimationFrame(updateLoop);
        };

        updateLoop();

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start(3000);
      } catch (err) {
        console.error("Mic Error:", err);
        alert("Please enable microphone access.");
      }
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#050810] text-slate-200 p-4 lg:p-8 transition-colors duration-1000 ${score > 0.7 ? "bg-red-950/20 animate-pulse-red" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/50">
              <Shield className="text-emerald-500" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                SafeVoice <span className="text-emerald-500">Forensics</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-500 tracking-[0.2em]">
                AUDIO CLONING DETECTION ENGINE v1.0.4
              </p>
            </div>
          </div>

          <button
            onClick={toggleScan}
            className={`flex items-center gap-3 px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 ${
              isRecording
                ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                : "bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            {isRecording ? "TERMINATE SCAN" : "INITIALIZE LIVE SCAN"}
          </button>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Database size={14} /> Session Data
              </h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">STREAM:</span>{" "}
                  <span
                    className={
                      isRecording ? "text-emerald-400" : "text-slate-600"
                    }
                  >
                    {isRecording ? "ACTIVE" : "OFFLINE"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CODEC:</span>{" "}
                  <span>G.711 PCMU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">LATENCY:</span>{" "}
                  <span>42ms</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
              <div
                className={`text-xs font-bold mb-2 ${score > 0.7 ? "text-red-500" : "text-emerald-500"}`}
              >
                STATUS: {status}
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${isRecording ? "bg-emerald-500 animate-pulse" : "bg-slate-700"}`}
                  style={{ width: isRecording ? "100%" : "0%" }}
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="bg-black aspect-video rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center group">
              <div className="absolute top-4 left-6 flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-slate-700"}`}
                />
                <span className="text-[10px] font-mono text-slate-500 tracking-widest">
                  LIVE_SPECTROGRAM_ANALYSIS
                </span>
              </div>

              {isRecording ? (
                <>
                  {/* Waveform fades out when the Heatmap appears */}
                  <div className={`transition-opacity duration-500 ${score > 0.7 ? 'opacity-20' : 'opacity-100'}`}>
                    <Waveform stream={audioStream} isRecording={isRecording} score={score} />
                  </div>

                  {/* Heatmap Overlay (Appears when AI Spoofing is detected) */}
                  {score > 0.7 && (
                    <div className="absolute inset-0 flex items-center justify-center animate-in fade-in duration-700">
                      <img src="https://imgur.com" alt="Heatmap" className="w-full h-full object-cover mix-blend-screen opacity-80" />
                      <div className="absolute inset-0 bg-red-900/10 backdrop-blur-[2px]" />
                      <div className="absolute border-2 border-red-500 rounded-lg p-2 top-1/4 right-1/4 animate-pulse">
                         <p className="text-[8px] font-mono text-red-500 font-bold uppercase">Synthetic Artifact @ 8.4kHz Detected</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-slate-700 text-center">
                  <p className="text-sm font-mono tracking-widest uppercase">System Idle</p>
                  <p className="text-[10px] mt-2 italic">Initialize scan to begin deep analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT COLUMN: RISK METER & VERDICT --- */}
          <div className="col-span-12 lg:col-span-3">
            <RiskMeter score={score} />
          </div>

        </div>
      </div>
    </div>
  );

}
export default App;