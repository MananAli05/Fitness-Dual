let audioContext = null

export function playNotificationTone() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return

  audioContext ??= new AudioContext()
  const now = audioContext.currentTime

  ;[880, 1320].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const start = now + index * 0.15

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4)

    oscillator.connect(gain).connect(audioContext.destination)
    oscillator.start(start)
    oscillator.stop(start + 0.45)
  })
}
