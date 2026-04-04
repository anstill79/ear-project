// Runs in the AudioWorklet scope (separate thread from the main page).
// Computes RMS of each audio block and posts it back to the main thread.
// Throttles to one message roughly every 100 ms to avoid flooding the UI.

const SAMPLE_RATE_ESTIMATE = 44100;
const BLOCK_SIZE = 128; // Web Audio spec: AudioWorklet block size is always 128 frames
const FRAMES_PER_UPDATE = Math.round((SAMPLE_RATE_ESTIMATE / BLOCK_SIZE) * 0.1); // ~100 ms

class LevelProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._frame = 0;
  }

  process(inputs) {
    this._frame++;
    if (this._frame < FRAMES_PER_UPDATE) return true;
    this._frame = 0;

    const channel = inputs[0]?.[0];
    if (!channel || channel.length === 0) return true;

    let sum = 0;
    for (let i = 0; i < channel.length; i++) {
      sum += channel[i] * channel[i];
    }
    const rms = Math.sqrt(sum / channel.length);
    this.port.postMessage(rms);

    return true; // keep processor alive
  }
}

registerProcessor("level-processor", LevelProcessor);
