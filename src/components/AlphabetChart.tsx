import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { CYRILLIC_ALPHABET, GROUP_LABELS } from '../data/cyrillicAlphabet';
import { LetterCase, LetterGroup } from '../types/cyrillic';
import { IPA_KEY_RULES } from '../utils/russianIpa';
import { speakRussian } from '../utils/speech';
import { GlyphPreviewSvg } from './GlyphPreviewSvg';

interface AlphabetChartProps {
  onSelectLetter: (upperChar: string) => void;
}

export const AlphabetChart: React.FC<AlphabetChartProps> = ({ onSelectLetter }) => {
  const [groupFilter, setGroupFilter] = useState<'tutte' | LetterGroup>('tutte');
  const [letterCase, setLetterCase] = useState<LetterCase>('minuscolo');

  const filtered = CYRILLIC_ALPHABET.filter(
    (item) => groupFilter === 'tutte' || item.group === groupFilter
  );

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-400/70 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 font-display">
            Tavola comparativa dell’alfabeto cirillico
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Confronta stampatello e corsivo per ciascuna delle 33 lettere russe. Clicca su una scheda per esercitarti subito.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200 rounded-lg border border-slate-300">
            {(['minuscolo', 'maiuscolo'] as LetterCase[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setLetterCase(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize whitespace-nowrap shrink-0 ${
                  letterCase === c
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Russian IPA Phonetic Rules */}
      <section
        aria-label="Regole principali IPA del russo"
        className="bg-[#1E293B] border border-slate-700 rounded-xl p-5 text-white shadow-sm"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-white">
            Guida rapida alla pronuncia IPA russa
          </h3>
          <span className="text-xs text-slate-300">
            Alfabeto Fonetico Internazionale applicato al cirillico
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {IPA_KEY_RULES.map((rule) => (
            <div
              key={rule.symbol}
              className="bg-slate-800/90 border border-slate-700 rounded-lg p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-blue-300">
                  {rule.symbol}
                </span>
                <span className="font-mono text-[11px] text-slate-300">
                  {rule.example}
                </span>
              </div>
              <div className="text-xs font-semibold text-white">{rule.title}</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Group filter tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(Object.keys(GROUP_LABELS) as Array<'tutte' | LetterGroup>).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setGroupFilter(key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              groupFilter === key
                ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                : 'bg-white text-slate-700 border-slate-400/70 hover:border-slate-500 hover:text-slate-900'
            }`}
          >
            {GROUP_LABELS[key]}
          </button>
        ))}
      </div>

      {/* 33-letter grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const ch = letterCase === 'maiuscolo' ? item.upper : item.lower;
          return (
            <div
              key={item.upper}
              onClick={() => onSelectLetter(item.upper)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectLetter(item.upper);
                }
              }}
              className="group bg-white border border-slate-400/70 hover:border-blue-600 rounded-xl p-4 transition-colors cursor-pointer flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2 mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900">
                      {item.upper} {item.lower}
                    </span>
                    <span className="font-mono text-xs text-slate-500">{item.ipa}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakRussian(item.exampleWord);
                    }}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title={`Ascolta esempio: ${item.exampleWord}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stampatello vs Corsivo side-by-side vector preview */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-100 border border-slate-300 rounded-lg p-2 flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-slate-700 mb-1">Stampatello</span>
                    <GlyphPreviewSvg
                      text={ch}
                      style="stampatello"
                      showBaseline
                      className="w-14 h-12"
                      strokeWidth={3.1}
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-2 flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-blue-800 mb-1">Corsivo</span>
                    <GlyphPreviewSvg
                      text={ch}
                      style="corsivo"
                      showBaseline
                      className="w-14 h-12"
                      strokeColor="#1D4ED8"
                      strokeWidth={3.1}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {item.cursiveNote}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Es. <strong className="text-slate-800 font-medium">{item.exampleWord}</strong> ({item.exampleMeaning})
                </span>
                <span className="text-blue-700 font-medium group-hover:underline">Pratica</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
