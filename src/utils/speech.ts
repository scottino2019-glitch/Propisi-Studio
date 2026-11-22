export function speakRussian(text: string): { ok: boolean; reason?: string } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { ok: false, reason: 'Sintesi vocale non supportata in questo browser.' };
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ru'));
    if (ruVoice) {
      utterance.voice = ruVoice;
    }

    window.speechSynthesis.speak(utterance);
    return { ok: true };
  } catch {
    return { ok: false, reason: 'Impossibile riprodurre l’audio.' };
  }
}
