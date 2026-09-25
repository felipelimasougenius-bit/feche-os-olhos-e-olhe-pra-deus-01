/**
 * Natural Speech Narration Service using Browser Web Speech API
 */

class NarrationService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private onStateChangeCallback: ((speaking: boolean, paused: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setOnStateChange(cb: (speaking: boolean, paused: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  private notify() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.isSpeaking, this.isPaused);
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;
    this.stop();

    const cleanText = text
      .replace(/«|»/g, '')
      .replace(/—/g, ', ')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.88; // Serene, contemplative pace
    utterance.pitch = 0.95;

    // Pick best PT voice if available
    const voices = this.synth.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Daniel') || v.lang === 'pt-BR'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public getStatus() {
    return { isSpeaking: this.isSpeaking, isPaused: this.isPaused };
  }
}

export const narrationService = new NarrationService();
