import { GlyphDefinition } from '../types/cyrillic';

export const STAMPATELLO_GLYPHS: Record<string, GlyphDefinition> = {
  // === MAIUSCOLE ===
  'А': {
    char: 'А',
    advanceWidth: 60,
    strokes: [
      { d: 'M 30 18 L 12 72', hint: 'Asta diagonale sinistra dall’alto verso il basso' },
      { d: 'M 30 18 L 48 72', hint: 'Asta diagonale destra dall’alto verso il basso' },
      { d: 'M 18 52 L 42 52', hint: 'Trattino orizzontale centrale da sinistra a destra' },
    ],
  },
  'Б': {
    char: 'Б',
    advanceWidth: 56,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale principale' },
      { d: 'M 15 18 L 45 18', hint: 'Tettuccio orizzontale superiore' },
      { d: 'M 15 44 L 32 44 C 45 44 46 72 32 72 L 15 72', hint: 'Pancia inferiore arrotondata' },
    ],
  },
  'В': {
    char: 'В',
    advanceWidth: 56,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 15 18 L 32 18 C 43 18 43 44 31 44 L 15 44', hint: 'Occhiello superiore' },
      { d: 'M 15 44 L 33 44 C 46 44 46 72 32 72 L 15 72', hint: 'Occhiello inferiore leggermente più ampio' },
    ],
  },
  'Г': {
    char: 'Г',
    advanceWidth: 48,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 15 18 L 41 18', hint: 'Barra superiore verso destra' },
    ],
  },
  'Д': {
    char: 'Д',
    advanceWidth: 62,
    strokes: [
      { d: 'M 21 18 L 44 18 L 44 68', hint: 'Tetto superiore e gamba destra verticale' },
      { d: 'M 21 18 L 15 68', hint: 'Gamba sinistra leggermente inclinata' },
      { d: 'M 9 68 L 51 68', hint: 'Base orizzontale con sporgenze laterali' },
      { d: 'M 10 68 L 10 80', hint: 'Piedino sinistro sotto il rigo' },
      { d: 'M 50 68 L 50 80', hint: 'Piedino destro sotto il rigo' },
    ],
  },
  'Е': {
    char: 'Е',
    advanceWidth: 52,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 15 18 L 43 18', hint: 'Barra superiore' },
      { d: 'M 15 44 L 38 44', hint: 'Barra centrale' },
      { d: 'M 15 72 L 43 72', hint: 'Barra inferiore' },
    ],
  },
  'Ё': {
    char: 'Ё',
    advanceWidth: 52,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 15 18 L 43 18', hint: 'Barra superiore' },
      { d: 'M 15 44 L 38 44', hint: 'Barra centrale' },
      { d: 'M 15 72 L 43 72', hint: 'Barra inferiore' },
      { d: 'M 21 8 L 23 11', hint: 'Primo punto sopra la lettera' },
      { d: 'M 35 8 L 37 11', hint: 'Secondo punto sopra la lettera' },
    ],
  },
  'Ж': {
    char: 'Ж',
    advanceWidth: 74,
    strokes: [
      { d: 'M 37 18 L 37 72', hint: 'Asta centrale verticale' },
      { d: 'M 13 18 L 37 45 L 11 72', hint: 'Ala sinistra a V verso il centro' },
      { d: 'M 61 18 L 37 45 L 63 72', hint: 'Ala destra simmetrica' },
    ],
  },
  'З': {
    char: 'З',
    advanceWidth: 52,
    strokes: [
      { d: 'M 14 23 C 19 16 40 16 40 30 C 40 41 28 44 21 44', hint: 'Arco superiore aperto a sinistra' },
      { d: 'M 21 44 C 31 44 43 47 43 58 C 43 73 19 75 12 66', hint: 'Arco inferiore più ampio' },
    ],
  },
  'И': {
    char: 'И',
    advanceWidth: 60,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 15 72 L 45 18', hint: 'Diagonale dal basso a sinistra verso l’alto a destra' },
      { d: 'M 45 18 L 45 72', hint: 'Asta verticale destra' },
    ],
  },
  'Й': {
    char: 'Й',
    advanceWidth: 60,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 15 72 L 45 18', hint: 'Diagonale verso l’alto a destra' },
      { d: 'M 45 18 L 45 72', hint: 'Asta verticale destra' },
      { d: 'M 21 8 C 26 14 34 14 39 8', hint: 'Archetto breve sopra la lettera' },
    ],
  },
  'К': {
    char: 'К',
    advanceWidth: 56,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 44 18 L 16 47', hint: 'Braccio superiore verso il centro' },
      { d: 'M 22 41 L 46 72', hint: 'Gamba inferiore verso destra' },
    ],
  },
  'Л': {
    char: 'Л',
    advanceWidth: 58,
    strokes: [
      { d: 'M 21 18 C 20 45 17 66 10 72', hint: 'Gamba sinistra curva verso il basso' },
      { d: 'M 21 18 L 44 18 L 44 72', hint: 'Tetto piatto e asta verticale destra' },
    ],
  },
  'М': {
    char: 'М',
    advanceWidth: 68,
    strokes: [
      { d: 'M 13 72 L 17 18', hint: 'Asta sinistra dal basso verso l’alto' },
      { d: 'M 17 18 L 34 52', hint: 'Diagonale sinistra verso il centro' },
      { d: 'M 34 52 L 51 18', hint: 'Diagonale destra verso l’alto' },
      { d: 'M 51 18 L 55 72', hint: 'Asta destra verso il basso' },
    ],
  },
  'Н': {
    char: 'Н',
    advanceWidth: 58,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 43 18 L 43 72', hint: 'Asta verticale destra' },
      { d: 'M 15 44 L 43 44', hint: 'Barra trasversale centrale' },
    ],
  },
  'О': {
    char: 'О',
    advanceWidth: 60,
    strokes: [
      { d: 'M 30 18 C 12 18 11 72 30 72 C 49 72 48 18 30 18', hint: 'Ovale chiuso in senso antiorario' },
    ],
  },
  'П': {
    char: 'П',
    advanceWidth: 58,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 15 18 L 43 18 L 43 72', hint: 'Barra superiore e asta destra' },
    ],
  },
  'Р': {
    char: 'Р',
    advanceWidth: 54,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale sinistra' },
      { d: 'M 15 18 L 33 18 C 46 18 46 47 33 47 L 15 47', hint: 'Occhiello superiore' },
    ],
  },
  'С': {
    char: 'С',
    advanceWidth: 54,
    strokes: [
      { d: 'M 44 25 C 37 16 14 17 14 45 C 14 73 37 74 44 65', hint: 'Arco aperto a destra in senso antiorario' },
    ],
  },
  'Т': {
    char: 'Т',
    advanceWidth: 56,
    strokes: [
      { d: 'M 10 18 L 46 18', hint: 'Barra orizzontale superiore' },
      { d: 'M 28 18 L 28 72', hint: 'Asta verticale centrale' },
    ],
  },
  'У': {
    char: 'У',
    advanceWidth: 56,
    strokes: [
      { d: 'M 13 18 L 29 48', hint: 'Braccio sinistro obliquo' },
      { d: 'M 44 18 L 21 67 C 18 72 13 73 10 71', hint: 'Diagonale destra continua verso il basso' },
    ],
  },
  'Ф': {
    char: 'Ф',
    advanceWidth: 68,
    strokes: [
      { d: 'M 34 15 L 34 75', hint: 'Asta verticale centrale leggermente sporgente' },
      { d: 'M 34 26 C 12 26 12 64 34 64 C 56 64 56 26 34 26', hint: 'Grande cerchio centrato sull’asta' },
    ],
  },
  'Х': {
    char: 'Х',
    advanceWidth: 56,
    strokes: [
      { d: 'M 13 18 L 43 72', hint: 'Diagonale dall’alto a sinistra' },
      { d: 'M 43 18 L 13 72', hint: 'Diagonale dall’alto a destra' },
    ],
  },
  'Ц': {
    char: 'Ц',
    advanceWidth: 62,
    strokes: [
      { d: 'M 14 18 L 14 70 L 44 70', hint: 'Asta sinistra e base orizzontale' },
      { d: 'M 44 18 L 44 70', hint: 'Asta destra verticale' },
      { d: 'M 44 70 L 52 70 L 52 80', hint: 'Angolo e codina discendente destra' },
    ],
  },
  'Ч': {
    char: 'Ч',
    advanceWidth: 54,
    strokes: [
      { d: 'M 14 18 L 14 36 C 14 49 27 50 40 47', hint: 'Curva sinistra aperta verso l’alto' },
      { d: 'M 40 18 L 40 72', hint: 'Asta verticale destra completa' },
    ],
  },
  'Ш': {
    char: 'Ш',
    advanceWidth: 72,
    strokes: [
      { d: 'M 14 18 L 14 72 L 58 72', hint: 'Asta sinistra e base orizzontale' },
      { d: 'M 36 18 L 36 72', hint: 'Asta centrale verticale' },
      { d: 'M 58 18 L 58 72', hint: 'Asta destra verticale' },
    ],
  },
  'Щ': {
    char: 'Щ',
    advanceWidth: 76,
    strokes: [
      { d: 'M 14 18 L 14 70 L 56 70', hint: 'Asta sinistra e base' },
      { d: 'M 35 18 L 35 70', hint: 'Asta centrale' },
      { d: 'M 56 18 L 56 70', hint: 'Asta destra' },
      { d: 'M 56 70 L 64 70 L 64 80', hint: 'Codina discendente all’angolo destro' },
    ],
  },
  'Ъ': {
    char: 'Ъ',
    advanceWidth: 60,
    strokes: [
      { d: 'M 11 18 L 24 18 L 24 72', hint: 'Tettuccio sinistro e asta verticale' },
      { d: 'M 24 44 L 38 44 C 50 44 50 72 38 72 L 24 72', hint: 'Pancia inferiore chiusa' },
    ],
  },
  'Ы': {
    char: 'Ы',
    advanceWidth: 70,
    strokes: [
      { d: 'M 14 18 L 14 72', hint: 'Asta verticale sinistra' },
      { d: 'M 14 44 L 29 44 C 41 44 41 72 29 72 L 14 72', hint: 'Pancia inferiore del segno' },
      { d: 'M 54 18 L 54 72', hint: 'Seconda asta verticale a destra' },
    ],
  },
  'Ь': {
    char: 'Ь',
    advanceWidth: 52,
    strokes: [
      { d: 'M 15 18 L 15 72', hint: 'Asta verticale' },
      { d: 'M 15 44 L 30 44 C 43 44 43 72 30 72 L 15 72', hint: 'Pancia inferiore destra' },
    ],
  },
  'Э': {
    char: 'Э',
    advanceWidth: 54,
    strokes: [
      { d: 'M 13 24 C 21 16 43 18 43 45 C 43 72 21 74 13 66', hint: 'Arco aperto a sinistra' },
      { d: 'M 22 45 L 43 45', hint: 'Trattino orizzontale centrale' },
    ],
  },
  'Ю': {
    char: 'Ю',
    advanceWidth: 74,
    strokes: [
      { d: 'M 13 18 L 13 72', hint: 'Asta verticale sinistra' },
      { d: 'M 13 45 L 28 45', hint: 'Ponticello centrale verso l’ovale' },
      { d: 'M 46 18 C 28 18 28 72 46 72 C 64 72 64 18 46 18', hint: 'Ovale destro completo' },
    ],
  },
  'Я': {
    char: 'Я',
    advanceWidth: 56,
    strokes: [
      { d: 'M 41 18 L 41 72', hint: 'Asta verticale destra' },
      { d: 'M 41 18 L 24 18 C 12 18 12 45 24 45 L 41 45', hint: 'Occhiello superiore sinistro' },
      { d: 'M 26 45 L 12 72', hint: 'Gamba diagonale sinistra' },
    ],
  },

  // === MINUSCOLE ===
  'а': {
    char: 'а',
    advanceWidth: 50,
    strokes: [
      { d: 'M 14 46 C 19 41 37 41 37 51 L 37 72', hint: 'Arco superiore e asta destra' },
      { d: 'M 37 55 C 24 53 12 57 12 64 C 12 72 26 73 37 66', hint: 'Pancia inferiore sinistra' },
    ],
  },
  'б': {
    char: 'б',
    advanceWidth: 50,
    strokes: [
      { d: 'M 15 48 C 15 30 22 22 40 19', hint: 'Collo ascendente verso destra' },
      { d: 'M 26 42 C 13 42 13 72 26 72 C 40 72 40 42 26 42', hint: 'Ovale chiuso sul rigo' },
    ],
  },
  'в': {
    char: 'в',
    advanceWidth: 48,
    strokes: [
      { d: 'M 14 42 L 14 72', hint: 'Asta verticale sinistra' },
      { d: 'M 14 42 L 28 42 C 37 42 37 56 27 56 L 14 56', hint: 'Occhiello superiore' },
      { d: 'M 14 56 L 29 56 C 39 56 39 72 28 72 L 14 72', hint: 'Occhiello inferiore' },
    ],
  },
  'г': {
    char: 'г',
    advanceWidth: 42,
    strokes: [
      { d: 'M 14 42 L 14 72', hint: 'Asta verticale' },
      { d: 'M 14 42 L 34 42', hint: 'Barra superiore' },
    ],
  },
  'д': {
    char: 'д',
    advanceWidth: 54,
    strokes: [
      { d: 'M 17 42 L 37 42 L 37 71', hint: 'Tetto e asta destra' },
      { d: 'M 17 42 L 13 71', hint: 'Gamba sinistra inclinata' },
      { d: 'M 8 71 L 43 71', hint: 'Base orizzontale' },
      { d: 'M 9 71 L 9 80', hint: 'Piedino sinistro' },
      { d: 'M 42 71 L 42 80', hint: 'Piedino destro' },
    ],
  },
  'е': {
    char: 'е',
    advanceWidth: 48,
    strokes: [
      { d: 'M 12 56 L 38 56 C 38 40 12 40 12 57 C 12 73 33 74 37 67', hint: 'Barra centrale poi arco completo antiorario' },
    ],
  },
  'ё': {
    char: 'ё',
    advanceWidth: 48,
    strokes: [
      { d: 'M 12 56 L 38 56 C 38 40 12 40 12 57 C 12 73 33 74 37 67', hint: 'Corpo della "е"' },
      { d: 'M 18 32 L 20 35', hint: 'Primo punto superiore' },
      { d: 'M 30 32 L 32 35', hint: 'Secondo punto superiore' },
    ],
  },
  'ж': {
    char: 'ж',
    advanceWidth: 64,
    strokes: [
      { d: 'M 32 42 L 32 72', hint: 'Asta centrale' },
      { d: 'M 12 42 L 32 57 L 10 72', hint: 'Ala sinistra' },
      { d: 'M 52 42 L 32 57 L 54 72', hint: 'Ala destra' },
    ],
  },
  'з': {
    char: 'з',
    advanceWidth: 46,
    strokes: [
      { d: 'M 12 46 C 17 41 34 41 34 50 C 34 55 24 57 18 57', hint: 'Curva superiore' },
      { d: 'M 18 57 C 27 57 36 59 36 65 C 36 73 17 74 11 68', hint: 'Curva inferiore' },
    ],
  },
  'и': {
    char: 'и',
    advanceWidth: 52,
    strokes: [
      { d: 'M 13 42 L 13 72', hint: 'Asta sinistra' },
      { d: 'M 13 72 L 39 42', hint: 'Diagonale ascendente' },
      { d: 'M 39 42 L 39 72', hint: 'Asta destra' },
    ],
  },
  'й': {
    char: 'й',
    advanceWidth: 52,
    strokes: [
      { d: 'M 13 42 L 13 72', hint: 'Asta sinistra' },
      { d: 'M 13 72 L 39 42', hint: 'Diagonale ascendente' },
      { d: 'M 39 42 L 39 72', hint: 'Asta destra' },
      { d: 'M 18 32 C 22 37 30 37 34 32', hint: 'Archetto superiore' },
    ],
  },
  'к': {
    char: 'к',
    advanceWidth: 48,
    strokes: [
      { d: 'M 13 42 L 13 72', hint: 'Asta verticale' },
      { d: 'M 36 42 L 14 58', hint: 'Braccio superiore' },
      { d: 'M 19 55 L 38 72', hint: 'Gamba inferiore' },
    ],
  },
  'л': {
    char: 'л',
    advanceWidth: 50,
    strokes: [
      { d: 'M 18 42 C 17 57 14 68 9 72', hint: 'Gamba sinistra curva' },
      { d: 'M 18 42 L 38 42 L 38 72', hint: 'Tetto e asta destra' },
    ],
  },
  'м': {
    char: 'м',
    advanceWidth: 60,
    strokes: [
      { d: 'M 12 72 L 15 42', hint: 'Asta sinistra dal basso' },
      { d: 'M 15 42 L 30 61', hint: 'Diagonale verso il centro' },
      { d: 'M 30 61 L 45 42', hint: 'Diagonale ascendente' },
      { d: 'M 45 42 L 48 72', hint: 'Asta destra' },
    ],
  },
  'н': {
    char: 'н',
    advanceWidth: 50,
    strokes: [
      { d: 'M 13 42 L 13 72', hint: 'Asta sinistra' },
      { d: 'M 37 42 L 37 72', hint: 'Asta destra' },
      { d: 'M 13 57 L 37 57', hint: 'Barra centrale' },
    ],
  },
  'о': {
    char: 'о',
    advanceWidth: 50,
    strokes: [
      { d: 'M 25 42 C 10 42 10 72 25 72 C 40 72 40 42 25 42', hint: 'Ovale chiuso' },
    ],
  },
  'п': {
    char: 'п',
    advanceWidth: 50,
    strokes: [
      { d: 'M 13 42 L 13 72', hint: 'Asta sinistra' },
      { d: 'M 13 42 L 37 42 L 37 72', hint: 'Barra superiore e asta destra' },
    ],
  },
  'р': {
    char: 'р',
    advanceWidth: 50,
    strokes: [
      { d: 'M 14 42 L 14 89', hint: 'Asta discendente sotto il rigo' },
      { d: 'M 14 45 C 28 39 39 46 39 57 C 39 68 28 74 14 69', hint: 'Ovale a destra sul corpo centrale' },
    ],
  },
  'с': {
    char: 'с',
    advanceWidth: 46,
    strokes: [
      { d: 'M 37 47 C 31 40 12 41 12 57 C 12 73 31 74 37 67', hint: 'Curva aperta a destra' },
    ],
  },
  'т': {
    char: 'т',
    advanceWidth: 48,
    strokes: [
      { d: 'M 9 42 L 39 42', hint: 'Barra orizzontale superiore' },
      { d: 'M 24 42 L 24 72', hint: 'Asta verticale centrale' },
    ],
  },
  'у': {
    char: 'у',
    advanceWidth: 48,
    strokes: [
      { d: 'M 12 42 L 25 70', hint: 'Diagonale sinistra corta' },
      { d: 'M 38 42 L 21 83 C 18 89 14 91 10 89', hint: 'Diagonale lunga discendente sotto il rigo' },
    ],
  },
  'ф': {
    char: 'ф',
    advanceWidth: 58,
    strokes: [
      { d: 'M 29 40 L 29 90', hint: 'Asta verticale discendente' },
      { d: 'M 29 44 C 11 44 11 70 29 70 C 47 70 47 44 29 44', hint: 'Ovale centrato sull’asta' },
    ],
  },
  'х': {
    char: 'х',
    advanceWidth: 48,
    strokes: [
      { d: 'M 12 42 L 36 72', hint: 'Diagonale verso destra' },
      { d: 'M 36 42 L 12 72', hint: 'Diagonale verso sinistra' },
    ],
  },
  'ц': {
    char: 'ц',
    advanceWidth: 54,
    strokes: [
      { d: 'M 13 42 L 13 71 L 37 71', hint: 'Asta sinistra e base' },
      { d: 'M 37 42 L 37 71', hint: 'Asta destra' },
      { d: 'M 37 71 L 44 71 L 44 80', hint: 'Codina destra discendente' },
    ],
  },
  'ч': {
    char: 'ч',
    advanceWidth: 48,
    strokes: [
      { d: 'M 13 42 L 13 52 C 13 60 24 60 35 58', hint: 'Coppa sinistra' },
      { d: 'M 35 42 L 35 72', hint: 'Asta verticale destra' },
    ],
  },
  'ш': {
    char: 'ш',
    advanceWidth: 64,
    strokes: [
      { d: 'M 12 42 L 12 72 L 52 72', hint: 'Asta sinistra e base' },
      { d: 'M 32 42 L 32 72', hint: 'Asta centrale' },
      { d: 'M 52 42 L 52 72', hint: 'Asta destra' },
    ],
  },
  'щ': {
    char: 'щ',
    advanceWidth: 68,
    strokes: [
      { d: 'M 12 42 L 12 71 L 50 71', hint: 'Asta sinistra e base' },
      { d: 'M 31 42 L 31 71', hint: 'Asta centrale' },
      { d: 'M 50 42 L 50 71', hint: 'Asta destra' },
      { d: 'M 50 71 L 57 71 L 57 80', hint: 'Codina discendente' },
    ],
  },
  'ъ': {
    char: 'ъ',
    advanceWidth: 50,
    strokes: [
      { d: 'M 10 42 L 20 42 L 20 72', hint: 'Tettuccio e asta verticale' },
      { d: 'M 20 56 L 31 56 C 41 56 41 72 31 72 L 20 72', hint: 'Pancia inferiore' },
    ],
  },
  'ы': {
    char: 'ы',
    advanceWidth: 62,
    strokes: [
      { d: 'M 12 42 L 12 72', hint: 'Asta verticale sinistra' },
      { d: 'M 12 56 L 25 56 C 35 56 35 72 25 72 L 12 72', hint: 'Pancia inferiore' },
      { d: 'M 47 42 L 47 72', hint: 'Asta verticale destra' },
    ],
  },
  'ь': {
    char: 'ь',
    advanceWidth: 46,
    strokes: [
      { d: 'M 13 42 L 13 72', hint: 'Asta verticale' },
      { d: 'M 13 56 L 26 56 C 37 56 37 72 26 72 L 13 72', hint: 'Pancia inferiore' },
    ],
  },
  'э': {
    char: 'э',
    advanceWidth: 46,
    strokes: [
      { d: 'M 11 46 C 18 40 36 42 36 57 C 36 72 18 74 11 68', hint: 'Arco aperto a sinistra' },
      { d: 'M 19 57 L 36 57', hint: 'Trattino centrale' },
    ],
  },
  'ю': {
    char: 'ю',
    advanceWidth: 64,
    strokes: [
      { d: 'M 12 42 L 12 72', hint: 'Asta verticale sinistra' },
      { d: 'M 12 57 L 24 57', hint: 'Ponticello centrale' },
      { d: 'M 40 42 C 24 42 24 72 40 72 C 56 72 56 42 40 42', hint: 'Ovale destro completo' },
    ],
  },
  'я': {
    char: 'я',
    advanceWidth: 48,
    strokes: [
      { d: 'M 35 42 L 35 72', hint: 'Asta verticale destra' },
      { d: 'M 35 42 L 22 42 C 11 42 11 58 22 58 L 35 58', hint: 'Occhiello superiore sinistro' },
      { d: 'M 23 58 L 11 72', hint: 'Gamba sinistra diagonale' },
    ],
  },
};
