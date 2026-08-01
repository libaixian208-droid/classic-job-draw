/** Lightweight procedural UI sounds — no game audio assets. */
let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }
  try {
    ctx ??= new AudioContext()
    return ctx
  } catch {
    return null
  }
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  gain = 0.04,
  when = 0,
) {
  const audio = getCtx()
  if (!audio) return
  void audio.resume()

  const osc = audio.createOscillator()
  const g = audio.createGain()
  osc.type = type
  osc.frequency.value = frequency
  g.gain.value = gain
  osc.connect(g)
  g.connect(audio.destination)

  const t = audio.currentTime + when
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

export function playClick() {
  tone(520, 0.06, 'triangle', 0.03)
}

export function playDrawSpin() {
  tone(380, 0.05, 'square', 0.02)
  tone(440, 0.05, 'square', 0.015, 0.04)
}

export function playReveal() {
  tone(523, 0.12, 'triangle', 0.045)
  tone(659, 0.14, 'triangle', 0.035, 0.08)
  tone(784, 0.18, 'triangle', 0.03, 0.16)
}

export function playComplete() {
  tone(392, 0.1, 'sine', 0.04)
  tone(523, 0.12, 'sine', 0.035, 0.1)
  tone(659, 0.16, 'sine', 0.03, 0.2)
  tone(784, 0.22, 'sine', 0.028, 0.32)
}
