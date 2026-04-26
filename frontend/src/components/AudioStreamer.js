export const startAudioStream = async (ws) => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);

  source.connect(processor);
  processor.connect(audioContext.destination);

  processor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0);

    const buffer = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      buffer[i] = input[i] * 32767;
    }

    if (ws.readyState === 1) {
      ws.send(buffer.buffer);
    }
  };
};