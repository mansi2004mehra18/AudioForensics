import React, { useState, useRef } from "react";
import Header from "./Header";
import StatusPanel from "./StatusPanel";
import SpectrogramView from "./SpectrogramView";
import RiskMeter from "./RiskMeter";

export default function Dashboard() {
  const [score, setScore] = useState(0.15);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("IDLE - READY FOR SCAN");
  const [audioStream, setAudioStream] = useState(null);

  const analysisFrameRef = useRef(null);
  const isRecordingRef = useRef(false);
  const wsRef = useRef(null); // ✅ FIX 1

  const toggleScan = async () => {
    if (isRecording) {
      // 🔴 STOP
      isRecordingRef.current = false;
      setIsRecording(false);
      setStatus("SCAN STOPPED");

      if (audioStream) audioStream.getTracks().forEach((t) => t.stop());
      if (analysisFrameRef.current)
        cancelAnimationFrame(analysisFrameRef.current);

      if (wsRef.current) wsRef.current.close(); // ✅ close WS

      setScore(0.15);
      setAudioStream(null);
    } else {
      try {
        // 🟢 START
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);
        setIsRecording(true);
        isRecordingRef.current = true;

        // ✅ INIT WEBSOCKET
        wsRef.current = new WebSocket("ws://localhost:8000/ws/audio");

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);

          const newScore = data.fraud;

          // smooth UI
          setScore((prev) => prev + (newScore - prev) * 0.2);

          setScore((prev) => {
            const smoothed = prev + (newScore - prev) * 0.15;

            if (smoothed > 0.75) {
              setStatus("⚠️ AI VOICE DETECTED");
            } else if (smoothed < 0.6) {
              setStatus("VERIFIED HUMAN VOICE");
            }

            return smoothed;
          });
        };

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLoop = () => {
          if (!isRecordingRef.current) return;

          analyser.getByteFrequencyData(dataArray);

          const now = Date.now();

          // ⏳ limit updates (smoothness boost)
          if (now - lastUpdateRef.current > 120) {
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

            const smoothingFactor = 0.01;

            setScore((prev) => prev + (avg / 255 - prev) * smoothingFactor);

            lastUpdateRef.current = now;
          }

          // ✅ send to backend
          if (wsRef.current?.readyState === 1) {
            wsRef.current.send(dataArray.buffer);
          }

          analysisFrameRef.current = requestAnimationFrame(updateLoop);
        };

        updateLoop();
      } catch (err) {
        console.error("Mic Error:", err);
        alert("Please allow microphone access");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 p-6">
      <Header isRecording={isRecording} toggleScan={toggleScan} />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <StatusPanel score={score} status={status} isRecording={isRecording} />

        <SpectrogramView
          score={score}
          isRecording={isRecording}
          audioStream={audioStream}
        />

        <div className="col-span-3">
          <RiskMeter score={score} />
        </div>
      </div>
    </div>
  );
}
