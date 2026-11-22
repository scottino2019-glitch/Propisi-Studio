export type ScriptStyle = 'corsivo' | 'stampatello';
export type LetterCase = 'minuscolo' | 'maiuscolo';
export type CurriculumStage = 'lettere' | 'accoppiamenti' | 'parole' | 'tabella';

export type LetterGroup =
  | 'vocali'
  | 'familiari'
  | 'falsi_amici'
  | 'uniche'
  | 'segni';

export interface AnchorPoint {
  x: number;
  y: number;
  kind?: 'low' | 'low-hook' | 'mid' | 'high';
}

export interface StrokePath {
  /** SVG path string in glyph-local coordinates (x: 0..advanceWidth, y: 0..100) */
  d: string;
  /** Optional pedagogical hint for this specific stroke */
  hint?: string;
}

export interface GlyphDefinition {
  char: string;
  advanceWidth: number;
  strokes: StrokePath[];
  entryAnchor?: AnchorPoint;
  exitAnchor?: AnchorPoint;
}

export interface LetterMeta {
  upper: string;
  lower: string;
  nameRu: string;
  nameIt: string;
  ipa: string;
  pronunciationIt: string;
  cursiveNote: string;
  printNote: string;
  group: LetterGroup;
  exampleWord: string;
  exampleTranslit: string;
  exampleMeaning: string;
}

export interface PairingLesson {
  id: string;
  text: string;
  translit: string;
  category: 'legatura_bassa' | 'legatura_alta' | 'trappole_visive' | 'sillabe';
  title: string;
  explanation: string;
  focusRule: string;
}

export interface WordEntry {
  id: string;
  word: string;
  stressedWord?: string;
  ipa?: string;
  translit: string;
  meaningIt: string;
  note?: string;
  isCustom: boolean;
  learned: boolean;
  createdAt: number;
}

export interface ComposedStroke {
  id: string;
  d: string;
  charIndex: number;
  char: string;
  strokeIndexInChar: number;
  isConnector: boolean;
  hint?: string;
}

export interface ComposedSequence {
  text: string;
  style: ScriptStyle;
  strokes: ComposedStroke[];
  totalWidth: number;
  viewBox: string;
  glyphBoxes: Array<{
    char: string;
    x: number;
    width: number;
    index: number;
  }>;
}
