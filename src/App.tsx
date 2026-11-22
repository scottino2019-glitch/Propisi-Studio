import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Plus,
  Search,
  Trash2,
  Volume2,
} from 'lucide-react';
import { AddWordModal } from './components/AddWordModal';
import { AlphabetChart } from './components/AlphabetChart';
import { GlyphPreviewSvg } from './components/GlyphPreviewSvg';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { WritingStage } from './components/WritingStage';
import {
  INITIAL_WORDS,
  PAIRING_CATEGORY_LABELS,
  PAIRING_LESSONS,
} from './data/curriculum';
import { CYRILLIC_ALPHABET, GROUP_LABELS } from './data/cyrillicAlphabet';
import {
  CurriculumStage,
  LetterCase,
  LetterGroup,
  PairingLesson,
  ScriptStyle,
  WordEntry,
} from './types/cyrillic';
import { speakRussian } from './utils/speech';
import { composeWordStrokes } from './utils/wordStrokeComposer';

const STORAGE_WORDS_KEY = 'propisi_studio_words_v1';
const STORAGE_PRACTICED_KEY = 'propisi_studio_practiced_v1';

export default function App() {
  const [stage, setStage] = useState<CurriculumStage>('lettere');
  const [scriptStyle, setScriptStyle] = useState<ScriptStyle>('corsivo');
  const [letterCase, setLetterCase] = useState<LetterCase>('minuscolo');

  // Stage 1: Single Letters
  const [letterGroup, setLetterGroup] = useState<'tutte' | LetterGroup>('tutte');
  const [selectedUpperLetter, setSelectedUpperLetter] = useState<string>('А');
  const [practicedItems, setPracticedItems] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PRACTICED_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Stage 2: Pairings
  const [pairingCategory, setPairingCategory] = useState<
    'tutte' | PairingLesson['category']
  >('tutte');
  const [selectedPairingId, setSelectedPairingId] = useState<string>(PAIRING_LESSONS[0].id);

  // Stage 3: Words + Custom Study List
  const [words, setWords] = useState<WordEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_WORDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback to initial words
    }
    return INITIAL_WORDS;
  });
  const [selectedWordId, setSelectedWordId] = useState<string>(() => words[0]?.id || 'w-privet');
  const [wordFilter, setWordFilter] = useState<'tutte' | 'custom' | 'da_ripassare' | 'apprese'>('tutte');
  const [wordSearch, setWordSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Persist custom/learned words & practiced progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WORDS_KEY, JSON.stringify(words));
    } catch {
      // ignore storage quota errors
    }
  }, [words]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRACTICED_KEY, JSON.stringify(practicedItems));
    } catch {
      // ignore
    }
  }, [practicedItems]);

  // Filtered lists
  const filteredLetters = useMemo(
    () =>
      CYRILLIC_ALPHABET.filter(
        (l) => letterGroup === 'tutte' || l.group === letterGroup
      ),
    [letterGroup]
  );

  const selectedLetterMeta = useMemo(
    () =>
      CYRILLIC_ALPHABET.find((l) => l.upper === selectedUpperLetter) ??
      CYRILLIC_ALPHABET[0],
    [selectedUpperLetter]
  );

  const filteredPairings = useMemo(
    () =>
      PAIRING_LESSONS.filter(
        (p) => pairingCategory === 'tutte' || p.category === pairingCategory
      ),
    [pairingCategory]
  );

  const selectedPairing = useMemo(
    () =>
      PAIRING_LESSONS.find((p) => p.id === selectedPairingId) ?? PAIRING_LESSONS[0],
    [selectedPairingId]
  );

  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      if (wordFilter === 'custom' && !w.isCustom) return false;
      if (wordFilter === 'da_ripassare' && w.learned) return false;
      if (wordFilter === 'apprese' && !w.learned) return false;
      if (wordSearch.trim()) {
        const q = wordSearch.trim().toLowerCase();
        return (
          w.word.toLowerCase().includes(q) ||
          w.meaningIt.toLowerCase().includes(q) ||
          w.translit.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [words, wordFilter, wordSearch]);

  const selectedWord = useMemo(
    () => words.find((w) => w.id === selectedWordId) ?? words[0],
    [words, selectedWordId]
  );

  // Determine active text & sequence for WritingStage
  const activeText = useMemo(() => {
    if (stage === 'lettere') {
      return letterCase === 'maiuscolo'
        ? selectedLetterMeta.upper
        : selectedLetterMeta.lower;
    }
    if (stage === 'accoppiamenti') {
      return selectedPairing.text;
    }
    return selectedWord?.word || 'привет';
  }, [stage, letterCase, selectedLetterMeta, selectedPairing, selectedWord]);

  const activeSequence = useMemo(
    () => composeWordStrokes(activeText, scriptStyle),
    [activeText, scriptStyle]
  );

  // Handlers for progression & completion
  const handleMarkCompleted = () => {
    const key =
      stage === 'lettere'
        ? `L-${selectedLetterMeta.upper}-${letterCase}-${scriptStyle}`
        : stage === 'accoppiamenti'
          ? `P-${selectedPairing.id}-${scriptStyle}`
          : `W-${selectedWord?.id}-${scriptStyle}`;

    setPracticedItems((prev) => ({ ...prev, [key]: true }));
    if (stage === 'parole' && selectedWord && !selectedWord.learned) {
      setWords((prev) =>
        prev.map((w) => (w.id === selectedWord.id ? { ...w, learned: true } : w))
      );
    }
  };

  const handleNextItem = () => {
    if (stage === 'lettere') {
      const idx = filteredLetters.findIndex((l) => l.upper === selectedLetterMeta.upper);
      if (idx >= 0 && idx + 1 < filteredLetters.length) {
        setSelectedUpperLetter(filteredLetters[idx + 1].upper);
      }
    } else if (stage === 'accoppiamenti') {
      const idx = filteredPairings.findIndex((p) => p.id === selectedPairing.id);
      if (idx >= 0 && idx + 1 < filteredPairings.length) {
        setSelectedPairingId(filteredPairings[idx + 1].id);
      }
    } else if (stage === 'parole') {
      const idx = filteredWords.findIndex((w) => w.id === selectedWord?.id);
      if (idx >= 0 && idx + 1 < filteredWords.length) {
        setSelectedWordId(filteredWords[idx + 1].id);
      }
    }
  };

  const hasNextItem = useMemo(() => {
    if (stage === 'lettere') {
      const idx = filteredLetters.findIndex((l) => l.upper === selectedLetterMeta.upper);
      return idx >= 0 && idx + 1 < filteredLetters.length;
    }
    if (stage === 'accoppiamenti') {
      const idx = filteredPairings.findIndex((p) => p.id === selectedPairing.id);
      return idx >= 0 && idx + 1 < filteredPairings.length;
    }
    if (stage === 'parole') {
      const idx = filteredWords.findIndex((w) => w.id === selectedWord?.id);
      return idx >= 0 && idx + 1 < filteredWords.length;
    }
    return false;
  }, [
    stage,
    filteredLetters,
    selectedLetterMeta,
    filteredPairings,
    selectedPairing,
    filteredWords,
    selectedWord,
  ]);

  const handleAddCustomWord = (
    word: string,
    translit: string,
    meaningIt: string,
    note?: string
  ) => {
    const newEntry: WordEntry = {
      id: `custom-${Date.now()}`,
      word,
      translit,
      meaningIt,
      note,
      isCustom: true,
      learned: false,
      createdAt: Date.now(),
    };
    setWords((prev) => [newEntry, ...prev]);
    setSelectedWordId(newEntry.id);
    setWordFilter('tutte');
    setWordSearch('');
    setStage('parole');
  };

  const handleToggleWordLearned = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, learned: !w.learned } : w))
    );
  };

  const handleDeleteWord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWords((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      if (selectedWordId === id && remaining.length > 0) {
        setSelectedWordId(remaining[0].id);
      }
      return remaining;
    });
  };

  const lettersPracticedCount = useMemo(() => {
    const unique = new Set<string>();
    Object.entries(practicedItems).forEach(([k, v]) => {
      if (v && k.startsWith('L-')) {
        unique.add(k.split('-')[1]);
      }
    });
    return unique.size;
  }, [practicedItems]);

  const learnedWordsCount = useMemo(
    () => words.filter((w) => w.learned).length,
    [words]
  );

  return (
    <div className="min-h-screen bg-[#CBD5E1] text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="bg-[#0B1120] text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => setStage('lettere')}
            className="text-xl font-semibold tracking-tight text-white font-display whitespace-nowrap shrink-0 cursor-pointer"
          >
            Propisi Studio
          </button>

          {/* Zone 2: Clean single-line text nav links */}
          <nav
            aria-label="Percorso di apprendimento"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {(
              [
                { id: 'lettere', label: 'Singole Lettere' },
                { id: 'accoppiamenti', label: 'Accoppiamenti' },
                { id: 'parole', label: 'Parole e Lista' },
                { id: 'tabella', label: 'Tabella Alfabeto' },
              ] as Array<{ id: CurriculumStage; label: string }>
            ).map((nav) => (
              <button
                key={nav.id}
                type="button"
                onClick={() => setStage(nav.id)}
                className={`py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  stage === nav.id
                    ? 'text-white border-blue-400'
                    : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi parola</span>
            </button>
          </div>
        </div>

        {/* Mobile navigation row */}
        <div className="md:hidden border-t border-slate-800 px-3 py-2 flex items-center gap-4 overflow-x-auto text-xs font-medium bg-slate-900">
          {(
            [
              { id: 'lettere', label: 'Singole Lettere' },
              { id: 'accoppiamenti', label: 'Accoppiamenti' },
              { id: 'parole', label: 'Parole e Lista' },
              { id: 'tabella', label: 'Tabella Alfabeto' },
            ] as Array<{ id: CurriculumStage; label: string }>
          ).map((nav) => (
            <button
              key={nav.id}
              type="button"
              onClick={() => setStage(nav.id)}
              className={`py-1 whitespace-nowrap shrink-0 ${
                stage === nav.id
                  ? 'text-blue-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
        {stage === 'tabella' ? (
          <AlphabetChart
            onSelectLetter={(upperChar) => {
              setSelectedUpperLetter(upperChar);
              setStage('lettere');
            }}
          />
        ) : (
          <div className="space-y-5">
            {/* Workspace Toolbar: Stage Breadcrumb + Script Style & Case Toggles */}
            <div className="bg-white border border-slate-400/70 rounded-xl px-5 py-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>
                    {stage === 'lettere'
                      ? 'Stadio 1 · Singole Lettere'
                      : stage === 'accoppiamenti'
                        ? 'Stadio 2 · Accoppiamenti e Legature'
                        : 'Stadio 3 · Parole e Vocabolario Personale'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {lettersPracticedCount}/33 lettere praticate
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {learnedWordsCount}/{words.length} parole apprese
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display tracking-tight">
                  {stage === 'lettere' && (
                    <>
                      Lettera {selectedLetterMeta.upper} {selectedLetterMeta.lower} —{' '}
                      <span className="text-blue-700">{selectedLetterMeta.nameIt}</span>
                    </>
                  )}
                  {stage === 'accoppiamenti' && (
                    <>
                      Legatura «{selectedPairing.text}» —{' '}
                      <span className="text-blue-700">{selectedPairing.title}</span>
                    </>
                  )}
                  {stage === 'parole' && selectedWord && (
                    <>
                      {selectedWord.word}{' '}
                      <span className="text-slate-400 font-normal text-xl">
                        ({selectedWord.meaningIt})
                      </span>
                    </>
                  )}
                </h1>
              </div>

              {/* Script Mode Segmented Controls (Corsivo vs Stampatello, Maiuscolo vs Minuscolo) + PWA Install */}
              <div className="flex flex-wrap items-center gap-3">
                <PWAInstallButton />
                <div
                  className="flex items-center gap-1 p-1 bg-slate-200 border border-slate-300 rounded-lg"
                  role="group"
                  aria-label="Stile di scrittura"
                >
                  <button
                    type="button"
                    onClick={() => setScriptStyle('corsivo')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      scriptStyle === 'corsivo'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Corsivo (Рукописный)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScriptStyle('stampatello')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      scriptStyle === 'stampatello'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Stampatello (Печатный)
                  </button>
                </div>

                {stage === 'lettere' && (
                  <div
                    className="flex items-center gap-1 p-1 bg-slate-200 border border-slate-300 rounded-lg"
                    role="group"
                    aria-label="Maiuscolo o minuscolo"
                  >
                    <button
                      type="button"
                      onClick={() => setLetterCase('minuscolo')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        letterCase === 'minuscolo'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Minuscolo ({selectedLetterMeta.lower})
                    </button>
                    <button
                      type="button"
                      onClick={() => setLetterCase('maiuscolo')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        letterCase === 'maiuscolo'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Maiuscolo ({selectedLetterMeta.upper})
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Two-Zone Sandbox Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT ZONE (8 cols): Interactive Writing Canvas + Pedagogical Notes */}
              <div className="lg:col-span-8 space-y-5">
                <WritingStage
                  sequence={activeSequence}
                  scriptStyle={scriptStyle}
                  onCompleteItem={handleMarkCompleted}
                  onNextItem={handleNextItem}
                  hasNextItem={hasNextItem}
                  subtitleLabel={
                    stage === 'lettere'
                      ? letterCase === 'maiuscolo'
                        ? 'Maiuscolo'
                        : 'Minuscolo'
                      : stage === 'accoppiamenti'
                        ? PAIRING_CATEGORY_LABELS[selectedPairing.category]
                        : selectedWord?.translit
                  }
                />

                {/* Contextual Comparison & Calligraphic Guide Card */}
                <div className="bg-white border border-slate-400/70 rounded-xl p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center shadow-sm">
                  {/* Side-by-side Stampatello vs Corsivo vector reference */}
                  <div className="md:col-span-5 grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setScriptStyle('stampatello')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setScriptStyle('stampatello');
                      }}
                      className={`rounded-lg border p-3 text-center cursor-pointer transition-colors ${
                        scriptStyle === 'stampatello'
                          ? 'border-slate-900 bg-slate-100 ring-1 ring-slate-900/15'
                          : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-slate-700 mb-1">
                        Stampatello
                      </div>
                      <GlyphPreviewSvg
                        text={activeText}
                        style="stampatello"
                        showBaseline
                        className="w-full h-14"
                        strokeWidth={2.9}
                      />
                    </div>
                    <div
                      onClick={() => setScriptStyle('corsivo')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setScriptStyle('corsivo');
                      }}
                      className={`rounded-lg border p-3 text-center cursor-pointer transition-colors ${
                        scriptStyle === 'corsivo'
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600/20'
                          : 'border-blue-200 bg-blue-50/50 hover:border-blue-400'
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-blue-800 mb-1">
                        Corsivo
                      </div>
                      <GlyphPreviewSvg
                        text={activeText}
                        style="corsivo"
                        showBaseline
                        className="w-full h-14"
                        strokeColor="#1D4ED8"
                        strokeWidth={2.9}
                      />
                    </div>
                  </div>

                  {/* Detailed Pedagogical Explanation */}
                  <div className="md:col-span-7 space-y-2">
                    {stage === 'lettere' && (
                      <>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono text-slate-800 font-medium">
                            IPA {selectedLetterMeta.ipa}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Nome russo: {selectedLetterMeta.nameRu}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Esempio:{' '}
                            <button
                              type="button"
                              onClick={() => speakRussian(selectedLetterMeta.exampleWord)}
                              className="text-blue-700 hover:underline font-medium inline-flex items-center gap-1"
                            >
                              <span>{selectedLetterMeta.exampleWord}</span>
                              <Volume2 className="w-3 h-3" />
                            </button>{' '}
                            ({selectedLetterMeta.exampleMeaning})
                          </span>
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed">
                          <strong className="font-semibold">Pronuncia:</strong>{' '}
                          {selectedLetterMeta.pronunciationIt}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          <strong className="font-semibold text-slate-800">
                            {scriptStyle === 'corsivo' ? 'Consiglio corsivo:' : 'Nota stampatello:'}
                          </strong>{' '}
                          {scriptStyle === 'corsivo'
                            ? selectedLetterMeta.cursiveNote
                            : selectedLetterMeta.printNote}
                        </p>
                      </>
                    )}

                    {stage === 'accoppiamenti' && (
                      <>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{PAIRING_CATEGORY_LABELS[selectedPairing.category]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">/{selectedPairing.translit}/</span>
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed">
                          {selectedPairing.explanation}
                        </p>
                        <p className="text-sm text-blue-800 bg-blue-50/70 border border-blue-100 rounded-lg px-3 py-2">
                          <strong className="font-semibold">Regola chiave:</strong>{' '}
                          {selectedPairing.focusRule}
                        </p>
                      </>
                    )}

                    {stage === 'parole' && selectedWord && (
                      <>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono text-slate-800 font-medium">
                            [{selectedWord.translit}]
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Significato: {selectedWord.meaningIt}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {selectedWord.learned ? 'Parola appresa' : 'In studio'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {selectedWord.note ||
                            'Osserva come i tratti di collegamento in corsivo uniscono le lettere mantenendo costante l’inclinazione e il rigo di base.'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT ZONE (4 cols): Stage Selector & Custom Word Deck */}
              <aside className="lg:col-span-4 bg-[#F1F5F9] border border-slate-400/70 rounded-xl overflow-hidden flex flex-col max-h-[760px] shadow-sm">
                {/* Stage Switcher inside Deck */}
                <div className="p-3 border-b border-slate-700 bg-[#1E293B] grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStage('lettere')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg transition-colors text-center whitespace-nowrap ${
                      stage === 'lettere'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                    }`}
                  >
                    1. Lettere
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage('accoppiamenti')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg transition-colors text-center whitespace-nowrap ${
                      stage === 'accoppiamenti'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                    }`}
                  >
                    2. Legature
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage('parole')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg transition-colors text-center whitespace-nowrap ${
                      stage === 'parole'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                    }`}
                  >
                    3. Parole
                  </button>
                </div>

                {/* STAGE 1 DECK: 33 Single Letters */}
                {stage === 'lettere' && (
                  <div className="p-4 flex-1 overflow-y-auto space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(GROUP_LABELS) as Array<'tutte' | LetterGroup>).map(
                        (grp) => (
                          <button
                            key={grp}
                            type="button"
                            onClick={() => setLetterGroup(grp)}
                            className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap ${
                              letterGroup === grp
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {GROUP_LABELS[grp]}
                          </button>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-2">
                      {filteredLetters.map((item) => {
                        const isSelected = item.upper === selectedLetterMeta.upper;
                        const isDone =
                          practicedItems[
                            `L-${item.upper}-${letterCase}-${scriptStyle}`
                          ];
                        const displayChar =
                          letterCase === 'maiuscolo' ? item.upper : item.lower;

                        return (
                          <button
                            key={item.upper}
                            type="button"
                            onClick={() => setSelectedUpperLetter(item.upper)}
                            className={`relative rounded-lg border p-2 flex flex-col items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600/20'
                                : 'border-slate-300 bg-white hover:border-slate-400 text-slate-800'
                            }`}
                          >
                            {isDone && (
                              <Check
                                className="w-3 h-3 text-emerald-600 absolute top-1.5 right-1.5"
                                aria-label="Completata"
                              />
                            )}
                            <span className="text-lg font-semibold leading-tight">
                              {displayChar}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {item.ipa}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STAGE 2 DECK: Pairings & Ligatures */}
                {stage === 'accoppiamenti' && (
                  <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPairingCategory('tutte')}
                        className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                          pairingCategory === 'tutte'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        Tutti ({PAIRING_LESSONS.length})
                      </button>
                      {(
                        Object.keys(PAIRING_CATEGORY_LABELS) as Array<
                          PairingLesson['category']
                        >
                      ).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setPairingCategory(cat)}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                            pairingCategory === cat
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {PAIRING_CATEGORY_LABELS[cat]}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {filteredPairings.map((pair) => {
                        const isSelected = pair.id === selectedPairing.id;
                        const isDone =
                          practicedItems[`P-${pair.id}-${scriptStyle}`];
                        return (
                          <button
                            key={pair.id}
                            type="button"
                            onClick={() => setSelectedPairingId(pair.id)}
                            className={`w-full text-left rounded-lg border p-3 transition-colors flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600/20'
                                : 'border-slate-300 bg-white hover:border-slate-400'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-base font-semibold text-slate-900">
                                  {pair.text}
                                </span>
                                <span className="text-xs font-mono text-slate-500">
                                  /{pair.translit}/
                                </span>
                                {isDone && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-600 truncate mt-0.5">
                                {pair.title}
                              </p>
                            </div>
                            <GlyphPreviewSvg
                              text={pair.text}
                              style={scriptStyle}
                              className="w-16 h-10 shrink-0"
                              strokeColor={isSelected ? '#1D4ED8' : '#334155'}
                              strokeWidth={3.1}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STAGE 3 DECK: Words & Custom Study List */}
                {stage === 'parole' && (
                  <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={wordSearch}
                          onChange={(e) => setWordSearch(e.target.value)}
                          placeholder="Cerca parola o traduzione..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nuova</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          { id: 'tutte', label: `Tutte (${words.length})` },
                          {
                            id: 'custom',
                            label: `Mie parole (${words.filter((w) => w.isCustom).length})`,
                          },
                          {
                            id: 'da_ripassare',
                            label: `Da studiare (${words.filter((w) => !w.learned).length})`,
                          },
                          {
                            id: 'apprese',
                            label: `Apprese (${learnedWordsCount})`,
                          },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setWordFilter(tab.id)}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap ${
                            wordFilter === tab.id
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {filteredWords.length === 0 ? (
                      <div className="py-10 text-center space-y-2 border border-dashed border-slate-300 bg-white/60 rounded-lg">
                        <BookOpen className="w-5 h-5 text-slate-400 mx-auto" />
                        <p className="text-xs text-slate-600">
                          Nessuna parola trovata con questo filtro.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(true)}
                          className="text-xs font-semibold text-blue-700 hover:underline"
                        >
                          Aggiungi una nuova parola
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredWords.map((item) => {
                          const isSelected = item.id === selectedWord?.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedWordId(item.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedWordId(item.id);
                                }
                              }}
                              className={`rounded-lg border p-3 transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600/20'
                                  : 'border-slate-300 bg-white hover:border-slate-400'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-base font-semibold text-slate-900 truncate">
                                    {item.word}
                                  </span>
                                  <span className="text-xs font-mono text-slate-500">
                                    {item.translit}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600 truncate mt-0.5">
                                  {item.meaningIt}
                                  {item.isCustom && (
                                    <span className="text-blue-700"> · Personale</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleWordLearned(item.id, e)}
                                  className={`p-1.5 rounded-md transition-colors ${
                                    item.learned
                                      ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                  }`}
                                  title={
                                    item.learned
                                      ? 'Segnata come appresa'
                                      : 'Segna come appresa'
                                  }
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                {item.isCustom && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteWord(item.id, e)}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Rimuovi parola personalizzata"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>

      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWord={handleAddCustomWord}
      />

      <OfflineIndicator />
    </div>
  );
}
