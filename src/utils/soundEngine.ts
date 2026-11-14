// Offline Web Audio synthesizer & Mobile Haptics engine for tactile UI feedback
// Uses warm marimba/woodblock envelopes (zero audio file downloads, works on iOS Safari & Android)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private hapticsEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public setHapticsEnabled(val: boolean) {
    this.hapticsEnabled = val;
  }

  public triggerHaptic(pattern: number | number[] = 12) {
    if (!this.hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore on unsupported browsers
      }
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Subtle tactile woodblock/micro-pop for UI taps & globe interactions
  public playTap() {
    this.triggerHaptic(8);
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.028);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  // Warm marimba/kalimba harmonic pop for right answers (pleasant even across 100+ rapid questions)
  public playSuccess() {
    this.triggerHaptic([12, 24, 16]);
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [
      { freq: 587.33, delay: 0, dur: 0.14, peak: 0.13 }, // D5
      { freq: 880.0, delay: 0.055, dur: 0.22, peak: 0.15 } // A5
    ];

    notes.forEach((n) => {
      const t = now + n.delay;
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, t);

      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(n.freq * 2, t);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.03, t);
      subGain.gain.exponentialRampToValueAtTime(0.0005, t + n.dur * 0.6);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(n.peak, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + n.dur);

      osc.connect(gain);
      subOsc.connect(subGain);
      subGain.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      subOsc.start(t);
      osc.stop(t + n.dur + 0.01);
      subOsc.stop(t + n.dur + 0.01);
    });
  }

  // Soft muted low wood-thud for wrong answers (non-harsh, unmistakable tactile feel)
  public playError() {
    this.triggerHaptic([45, 35, 65]);
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const thuds = [
      { freqStart: 185, freqEnd: 120, start: 0, dur: 0.09, peak: 0.16 },
      { freqStart: 140, freqEnd: 88, start: 0.095, dur: 0.14, peak: 0.14 }
    ];

    thuds.forEach((b) => {
      const t = now + b.start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(b.freqStart, t);
      osc.frequency.exponentialRampToValueAtTime(b.freqEnd, t + b.dur);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(b.peak, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + b.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + b.dur + 0.01);
    });
  }

  // Gentle warm bell chime when revealing a hint or stepping through Mistake Review Flyover
  public playHint() {
    this.triggerHaptic(14);
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18); // G5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  // Uplifting warm chord arpeggio on completing a quiz
  public playFanfare() {
    this.triggerHaptic([18, 35, 18, 35, 70]);
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, delay: 0.0, d: 0.16, peak: 0.12 },   // C5
      { f: 659.25, delay: 0.07, d: 0.18, peak: 0.12 },  // E5
      { f: 783.99, delay: 0.14, d: 0.22, peak: 0.13 },  // G5
      { f: 987.77, delay: 0.21, d: 0.28, peak: 0.12 },  // B5
      { f: 1046.5, delay: 0.28, d: 0.45, peak: 0.15 }   // C6
    ];

    notes.forEach((n) => {
      const t = now + n.delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(n.peak, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + n.d + 0.02);
    });
  }
}

export const sounds = new SoundEngine();
