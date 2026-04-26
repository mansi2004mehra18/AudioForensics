import React, { useEffect, useRef } from "react";

const Waveform = ({ stream, isRecording, score }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isRecording || !stream) return;

    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ✅ Fix resolution
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      if (!isRecording) return;

      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const scale = 1 + score * 0.3;
        const barHeight = (dataArray[i] / 255) * canvas.height * scale;

        const intensity = score;

        if (intensity > 0.7) {
          ctx.fillStyle = "#ef4444"; // red
        } else if (intensity > 0.4) {
          ctx.fillStyle = "#f59e0b"; // yellow
        } else {
          ctx.fillStyle = "#10b981"; // green
        }

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };

    draw();

    return () => {
      if (audioContext.state !== "closed") audioContext.close();
    };
  }, [isRecording, stream]);

  return <canvas ref={canvasRef} className="w-full h-full opacity-90" />;
};

export default Waveform;
