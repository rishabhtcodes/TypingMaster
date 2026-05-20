// Web Audio API Mechanical Keyboard Sound Synthesizer
// Completely browser-native, requires no sound files!

export type SwitchType = 'clicky' | 'quiet' | 'mute';

class SoundSynthesizer {
  private audioCtx: AudioContext | null = null;
  private switchType: SwitchType = 'clicky';

  private initAudio() {
    if (!this.audioCtx) {
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setSwitchType(type: SwitchType) {
    this.switchType = type;
  }

  public getSwitchType(): SwitchType {
    return this.switchType;
  }

  public playClick(isBackspace = false, isSpace = false) {
    if (this.switchType === 'mute') return;

    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Base nodes
      const gainNode = this.audioCtx.createGain();
      gainNode.connect(this.audioCtx.destination);

      if (this.switchType === 'clicky') {
        // --- MECHANICAL BLUE SWITCH SYNTHESIS ---
        // Blue switches have a sharp high click and a plastic bottom out thud.

        // 1. Sharp Click Transient (high pass filtered short chirp)
        const clickOsc = this.audioCtx.createOscillator();
        const clickGain = this.audioCtx.createGain();
        
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(isSpace ? 1500 : 2500, now);
        clickOsc.frequency.exponentialRampToValueAtTime(isSpace ? 400 : 800, now + 0.015);

        clickGain.gain.setValueAtTime(0.08, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

        clickOsc.connect(clickGain);
        clickGain.connect(gainNode);

        // 2. Plastic Thud Bottom out
        const thudOsc = this.audioCtx.createOscillator();
        const thudGain = this.audioCtx.createGain();

        thudOsc.type = 'sine';
        const thudFreq = isBackspace ? 130 : isSpace ? 90 : 180;
        thudOsc.frequency.setValueAtTime(thudFreq, now);
        thudOsc.frequency.linearRampToValueAtTime(thudFreq - 40, now + 0.04);

        const thudDuration = isSpace ? 0.08 : isBackspace ? 0.06 : 0.05;
        thudGain.gain.setValueAtTime(0.15, now);
        thudGain.gain.exponentialRampToValueAtTime(0.0001, now + thudDuration);

        thudOsc.connect(thudGain);
        thudGain.connect(gainNode);

        // Play Blue Switch
        clickOsc.start(now);
        clickOsc.stop(now + 0.02);
        thudOsc.start(now);
        thudOsc.stop(now + thudDuration + 0.01);

      } else if (this.switchType === 'quiet') {
        // --- SILENT RED/BROWN SWITCH SYNTHESIS ---
        // Softer tactile bump, deeper round thud, no high click.
        
        const popOsc = this.audioCtx.createOscillator();
        const popGain = this.audioCtx.createGain();

        popOsc.type = 'sine';
        const baseFreq = isSpace ? 100 : isBackspace ? 140 : 200;
        popOsc.frequency.setValueAtTime(baseFreq, now);
        popOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.03);

        const duration = isSpace ? 0.07 : 0.04;
        popGain.gain.setValueAtTime(0.12, now);
        popGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        popOsc.connect(popGain);
        popGain.connect(gainNode);

        popOsc.start(now);
        popOsc.stop(now + duration + 0.01);
      }
    } catch (e) {
      console.warn("Failed to play keyboard audio", e);
    }
  }
}

export const SoundManager = new SoundSynthesizer();
