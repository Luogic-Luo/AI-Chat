export type SpeakOptions = {
  rate?: number
  pitch?: number
  volume?: number
  voiceName?: string
}

export const tts = {
  supported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  },
  listVoices(): SpeechSynthesisVoice[] {
    if (!this.supported()) return []
    return window.speechSynthesis.getVoices()
  },
  speak(text: string, opts: SpeakOptions = {}) {
    if (!this.supported()) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = opts.rate ?? 1
    utter.pitch = opts.pitch ?? 1
    utter.volume = opts.volume ?? 1
    if (opts.voiceName) {
      const v = this.listVoices().find(v => v.name === opts.voiceName)
      if (v) utter.voice = v
    }
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  },
  stop() {
    if (!this.supported()) return
    window.speechSynthesis.cancel()
  }
}


