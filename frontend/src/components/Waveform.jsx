import React, { useEffect, useRef } from 'react';

const Waveform = ({ stream, isRecording, score }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isRecording || !stream) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64; 
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (!isRecording) return;
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        // The bars turn RED if the threat score is high
        ctx.fillStyle = score > 0.7 ? '#ef4444' : '#10b981'; 
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
    return () => {
      if (audioContext.state !== 'closed') audioContext.close();
    };
  }, [isRecording, stream, score]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-40 opacity-90" 
      width={400} 
      height={150} 
    />
  );
};

export default Waveform;
