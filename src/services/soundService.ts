/**
 * Procedural Contemplative Sound Engine for "FECHE OS OLHOS E OLHE PARA DEUS"
 * Uses Web Audio API to generate peaceful ambient chords, gentle rain, and bell chimes.
 */

class ContemplativeSoundService {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentMode: 'sanctuary' | 'celestial' | 'rain' | 'none' = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.4;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentMode(): string {
    return this.currentMode;
  }

  public stopAmbient() {
    this.activeNodes.forEach(node => {
      try {
        if (typeof node === 'number') {
          clearInterval(node);
        } else if (node && 'stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        } else if (node && 'disconnect' in node) {
          node.disconnect();
        }
      } catch {
        // ignore cleanup
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentMode = 'none';
  }

  public playSanctuaryChords() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.stopAmbient();

    this.isPlaying = true;
    this.currentMode = 'sanctuary';

    // Frequencies representing a tranquil D major add9 / peaceful celestial chord (D3, A3, F#4, E4)
    const baseFreqs = [146.83, 220.0, 369.99, 329.63, 440.0];

    baseFreqs.forEach((freq, index) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Gentle LFO for warm breathing vibrato
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15 + index * 0.05, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      const noteGain = this.ctx.createGain();
      noteGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.08 / baseFreqs.length, this.ctx.currentTime + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + index * 100, this.ctx.currentTime);

      osc.connect(noteGain);
      noteGain.connect(filter);
      filter.connect(this.masterGain);

      osc.start();

      this.activeNodes.push(osc, lfo, noteGain, filter);
    });
  }

  public playGentleRain() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.stopAmbient();

    this.isPlaying = true;
    this.currentMode = 'rain';

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    rainGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, rainGain);
  }

  public playCelestialChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Harmonic singing bell sound
    const freqs = [528, 1056, 1584]; // 528Hz frequency of peace & renewal
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const amp = (0.2 / (idx + 1));
      gain.gain.setValueAtTime(amp, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 5);
    });
  }
}

export const soundService = new ContemplativeSoundService();
