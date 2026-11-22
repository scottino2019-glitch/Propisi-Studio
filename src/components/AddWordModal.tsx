import React, { useMemo, useState } from 'react';
import { Delete, Plus, Volume2, X } from 'lucide-react';
import { CYRILLIC_ALPHABET } from '../data/cyrillicAlphabet';
import { getRussianIpa } from '../utils/russianIpa';
import { speakRussian } from '../utils/speech';
import { hasCyrillicLetters, sanitizeCyrillicInput } from '../utils/wordStrokeComposer';
import { GlyphPreviewSvg } from './GlyphPreviewSvg';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (
    word: string,
    translit: string,
    meaningIt: string,
    note?: string,
    ipa?: string,
    stressedWord?: string
  ) => void;
}

const TRANSLIT_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'jo', ж: 'zh', з: 'z',
  и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
  ъ: '’', ы: 'y', ь: '’', э: 'e', ю: 'ju', я: 'ja',
};

const CYRILLIC_VOWELS = new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я']);

function autoTransliterate(word: string): string {
  return word
    .split('')
    .map((ch) => {
      const lower = ch.toLowerCase();
      const mapped = TRANSLIT_MAP[lower];
      if (!mapped) return ch;
      const isUpper = ch !== lower;
      return isUpper ? mapped.charAt(0).toUpperCase() + mapped.slice(1) : mapped;
    })
    .join('');
}

export const AddWordModal: React.FC<AddWordModalProps> = ({
  isOpen,
  onClose,
  onAddWord,
}) => {
  const [word, setWord] = useState('');
  const [stressIndex, setStressIndex] = useState<number | null>(null);
  const [meaningIt, setMeaningIt] = useState('');
  const [translit, setTranslit] = useState('');
  const [note, setNote] = useState('');
  const [keyboardUpper, setKeyboardUpper] = useState(false);
  const [error, setError] = useState('');

  const suggestedTranslit = useMemo(() => autoTransliterate(word.trim()), [word]);

  const wordWithExplicitStress = useMemo(() => {
    const trimmed = word.trim();
    if (!trimmed) return '';
    if (stressIndex === null || stressIndex >= trimmed.length) return trimmed;
    const chars = Array.from(trimmed);
    if (!CYRILLIC_VOWELS.has(chars[stressIndex]?.toLowerCase() ?? '')) return trimmed;
    return chars.map((c, idx) => (idx === stressIndex ? `${c}\u0301` : c)).join('');
  }, [word, stressIndex]);

  const ipaPreview = useMemo(
    () => getRussianIpa(wordWithExplicitStress || word.trim()),
    [wordWithExplicitStress, word]
  );

  const vowelIndices = useMemo(() => {
    const chars = Array.from(word.trim());
    return chars
      .map((c, i) => ({ char: c, idx: i, isVowel: CYRILLIC_VOWELS.has(c.toLowerCase()) }))
      .filter((item) => item.isVowel);
  }, [word]);

  if (!isOpen) return null;

  const handleWordChange = (val: string) => {
    const cleaned = sanitizeCyrillicInput(val);
    setWord(cleaned);
    setStressIndex(null);
    if (error) setError('');
  };

  const handleVirtualKey = (char: string) => {
    setWord((prev) => prev + char);
    if (error) setError('');
  };

  const handleBackspace = () => {
    setWord((prev) => prev.slice(0, -1));
    setStressIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed || !hasCyrillicLetters(trimmed)) {
      setError('Inserisci almeno una lettera cirillica russa (А–Я).');
      return;
    }

    onAddWord(
      trimmed,
      translit.trim() || suggestedTranslit,
      meaningIt.trim() || 'Parola personalizzata',
      note.trim() || undefined,
      ipaPreview.ipa,
      ipaPreview.stressedWord
    );
    setWord('');
    setStressIndex(null);
    setMeaningIt('');
    setTranslit('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-word-title"
    >
      <div className="bg-white border border-slate-300 rounded-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-xl">
        <div className="px-5 py-4 border-b border-slate-700 bg-[#0F172A] text-white flex items-center justify-between">
          <div>
            <h2 id="add-word-title" className="text-lg font-semibold font-display">
              Aggiungi parola alla lista di studio
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Genera automaticamente guida animata corsiva, stampatello e trascrizione IPA.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Chiudi finestra"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Word Input + Meaning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ru-word-input" className="block text-xs font-medium text-slate-700 mb-1.5">
                Parola in cirillico *
              </label>
              <input
                id="ru-word-input"
                type="text"
                value={word}
                onChange={(e) => handleWordChange(e.target.value)}
                placeholder="Es. спасибо, кошка, чай..."
                className="w-full px-3.5 py-2.5 text-base rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                autoFocus
              />
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>

            <div>
              <label htmlFor="it-meaning-input" className="block text-xs font-medium text-slate-700 mb-1.5">
                Significato in italiano
              </label>
              <input
                id="it-meaning-input"
                type="text"
                value={meaningIt}
                onChange={(e) => setMeaningIt(e.target.value)}
                placeholder="Es. gatto, tè, buongiorno..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="translit-input" className="block text-xs font-medium text-slate-700 mb-1.5">
                Traslitterazione (opzionale)
              </label>
              <input
                id="translit-input"
                type="text"
                value={translit}
                onChange={(e) => setTranslit(e.target.value)}
                placeholder={suggestedTranslit || 'Generata automaticamente'}
                className="w-full px-3.5 py-2 text-sm font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label htmlFor="note-input" className="block text-xs font-medium text-slate-700 mb-1.5">
                Nota di studio (opzionale)
              </label>
              <input
                id="note-input"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Es. attenzione al legame con л"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Live Vector + IPA Phonetic Preview */}
          {hasCyrillicLetters(word) && (
            <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-100 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-300">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Trascrizione IPA:</span>
                  <span className="font-mono text-sm font-semibold text-blue-800 bg-white border border-blue-200 px-2.5 py-0.5 rounded">
                    {ipaPreview.ipa}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakRussian(word.trim())}
                    className="p-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-400 transition-colors"
                    title="Ascolta pronuncia"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {vowelIndices.length > 1 && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-600 mr-1">Vocale accentata:</span>
                    {Array.from(word.trim()).map((ch, idx) => {
                      if (!CYRILLIC_VOWELS.has(ch.toLowerCase())) {
                        return (
                          <span key={idx} className="text-slate-400 font-mono">
                            {ch}
                          </span>
                        );
                      }
                      const isStressed =
                        stressIndex === idx ||
                        (stressIndex === null && ipaPreview.stressedWord.includes(`${ch}\u0301`));
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setStressIndex(idx)}
                          className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                            isStressed
                              ? 'bg-blue-700 text-white'
                              : 'bg-white border border-slate-300 text-slate-800 hover:border-blue-500'
                          }`}
                          title="Imposta l’accento tonico su questa vocale"
                        >
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium text-slate-700 mb-1">Anteprima Corsivo</div>
                  <div className="bg-white border border-slate-300 rounded px-2 py-1.5 flex items-center justify-center">
                    <GlyphPreviewSvg
                      text={word}
                      style="corsivo"
                      showBaseline
                      className="w-full h-14"
                      strokeColor="#1D4ED8"
                      strokeWidth={2.8}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-700 mb-1">Anteprima Stampatello</div>
                  <div className="bg-white border border-slate-300 rounded px-2 py-1.5 flex items-center justify-center">
                    <GlyphPreviewSvg
                      text={word}
                      style="stampatello"
                      showBaseline
                      className="w-full h-14"
                      strokeWidth={2.8}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Built-in Cyrillic Virtual Keyboard */}
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Tastiera cirillica rapida
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setKeyboardUpper((u) => !u)}
                  className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                    keyboardUpper
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {keyboardUpper ? 'Maiuscole' : 'Minuscole'}
                </button>
                <button
                  type="button"
                  onClick={() => handleVirtualKey(' ')}
                  className="px-2.5 py-1 text-xs font-medium rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Spazio
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="px-2.5 py-1 text-xs font-medium rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <Delete className="w-3.5 h-3.5" />
                  <span>Canc</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-11 gap-1">
              {CYRILLIC_ALPHABET.map((item) => {
                const ch = keyboardUpper ? item.upper : item.lower;
                return (
                  <button
                    key={item.upper}
                    type="button"
                    onClick={() => handleVirtualKey(ch)}
                    className="h-9 rounded border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 text-sm font-medium text-slate-900 transition-colors flex items-center justify-center"
                    title={`${item.nameIt} (${item.ipa})`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Salva e pratica</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
