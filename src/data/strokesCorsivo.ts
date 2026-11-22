import { GlyphDefinition } from '../types/cyrillic';

export const CORSIVO_GLYPHS: Record<string, GlyphDefinition> = {
  // === MAIUSCOLE CORSIVE (Inclinazione ~65°) ===
  'А': {
    char: 'А',
    advanceWidth: 68,
    strokes: [
      { d: 'M 10 68 C 14 74 20 72 24 62 L 44 18 L 46 72 C 47 74 52 72 58 60', hint: 'Uncino iniziale, salita fino in cima, discesa sul gambo destro con uscita' },
      { d: 'M 21 52 C 30 48 40 48 53 50', hint: 'Taglio trasversale morbido al centro' },
    ],
    exitAnchor: { x: 58, y: 60, kind: 'low' },
  },
  'Б': {
    char: 'Б',
    advanceWidth: 64,
    strokes: [
      { d: 'M 42 18 L 28 62 C 25 71 17 74 12 68 C 9 63 14 55 24 55', hint: 'Asta inclinata con piccolo ricciolo sinistro alla base' },
      { d: 'M 26 20 C 38 15 54 16 56 23 C 58 29 48 33 40 31', hint: 'Cappello superiore ondulato verso destra' },
      { d: 'M 27 44 C 42 42 52 50 49 62 C 46 72 29 74 22 67', hint: 'Pancia inferiore arrotondata' },
    ],
    exitAnchor: { x: 49, y: 62, kind: 'low' },
  },
  'В': {
    char: 'В',
    advanceWidth: 64,
    strokes: [
      { d: 'M 38 18 L 22 68 C 20 73 14 72 13 66', hint: 'Asta inclinata dall’alto con piccolo uncino alla base' },
      { d: 'M 28 24 C 35 16 52 17 52 29 C 52 38 40 43 30 44 C 46 44 53 54 49 64 C 45 73 28 74 22 66', hint: 'Doppio occhiello fluido continuo verso il basso' },
    ],
    exitAnchor: { x: 50, y: 64, kind: 'low' },
  },
  'Г': {
    char: 'Г',
    advanceWidth: 56,
    strokes: [
      { d: 'M 38 20 L 24 64 C 21 72 14 74 10 68 C 8 64 12 58 17 58', hint: 'Asta principale inclinata con ricciolo finale a sinistra' },
      { d: 'M 24 22 C 33 16 46 16 50 23 C 52 27 47 31 43 29', hint: 'Cappello ondulato superiore' },
    ],
    exitAnchor: { x: 34, y: 62, kind: 'low' },
  },
  'Д': {
    char: 'Д',
    advanceWidth: 64,
    strokes: [
      { d: 'M 38 18 L 22 66 C 18 74 11 73 10 67 C 9 62 15 60 22 64 C 34 72 52 68 54 44 C 56 26 44 17 30 22', hint: 'Asta giù, piccolo occhiello alla base e grande curva avvolgente a destra' },
    ],
    exitAnchor: { x: 54, y: 58, kind: 'low' },
  },
  'Е': {
    char: 'Е',
    advanceWidth: 56,
    strokes: [
      { d: 'M 48 24 C 42 16 26 18 24 31 C 22 40 31 44 38 44 C 24 44 16 54 17 65 C 18 74 37 74 48 63', hint: 'Doppio arco fluido aperto a destra' },
    ],
    exitAnchor: { x: 48, y: 63, kind: 'low' },
  },
  'Ё': {
    char: 'Ё',
    advanceWidth: 56,
    strokes: [
      { d: 'M 48 24 C 42 16 26 18 24 31 C 22 40 31 44 38 44 C 24 44 16 54 17 65 C 18 74 37 74 48 63', hint: 'Doppio arco della Е maiuscola' },
      { d: 'M 32 9 L 34 12', hint: 'Primo punto superiore' },
      { d: 'M 44 9 L 46 12', hint: 'Secondo punto superiore' },
    ],
    exitAnchor: { x: 48, y: 63, kind: 'low' },
  },
  'Ж': {
    char: 'Ж',
    advanceWidth: 78,
    strokes: [
      { d: 'M 14 25 C 26 20 33 34 30 50 C 27 65 18 74 10 68', hint: 'Grande arco sinistro a C rovesciata' },
      { d: 'M 42 18 L 28 72', hint: 'Asta centrale inclinata' },
      { d: 'M 33 48 C 40 42 46 32 54 22 C 62 17 68 23 64 30 C 57 38 48 44 43 48 C 48 56 50 70 59 71 C 64 71 68 65 70 59', hint: 'Ala destra continua con gamba d’uscita' },
    ],
    exitAnchor: { x: 70, y: 59, kind: 'low' },
  },
  'З': {
    char: 'З',
    advanceWidth: 54,
    strokes: [
      { d: 'M 20 25 C 27 16 46 17 45 30 C 44 40 33 44 26 44 C 36 44 46 50 43 62 C 40 73 20 74 14 65', hint: 'Due archi continui aperti a sinistra' },
    ],
    exitAnchor: { x: 44, y: 62, kind: 'low' },
  },
  'И': {
    char: 'И',
    advanceWidth: 66,
    strokes: [
      { d: 'M 16 25 C 20 18 27 18 26 26 L 17 65 C 16 74 28 74 36 58 L 50 18 L 39 66 C 38 73 46 73 56 59', hint: 'Ricciolo alto, discesa, grande ansa in basso, salita e seconda discesa' },
    ],
    exitAnchor: { x: 56, y: 59, kind: 'low' },
  },
  'Й': {
    char: 'Й',
    advanceWidth: 66,
    strokes: [
      { d: 'M 16 25 C 20 18 27 18 26 26 L 17 65 C 16 74 28 74 36 58 L 50 18 L 39 66 C 38 73 46 73 56 59', hint: 'Corpo identico alla И maiuscola' },
      { d: 'M 30 9 C 35 14 44 14 49 9', hint: 'Archetto superiore' },
    ],
    exitAnchor: { x: 56, y: 59, kind: 'low' },
  },
  'К': {
    char: 'К',
    advanceWidth: 64,
    strokes: [
      { d: 'M 16 25 C 21 18 29 18 27 27 L 16 67 C 14 73 10 71 10 66', hint: 'Asta inclinata sinistra con ricciolo in alto e in basso' },
      { d: 'M 52 21 C 46 17 39 22 36 33 L 26 46 C 36 45 43 52 43 65 C 43 72 50 72 56 60', hint: 'Braccio superiore curvo e gamba inferiore d’uscita' },
    ],
    exitAnchor: { x: 56, y: 60, kind: 'low' },
  },
  'Л': {
    char: 'Л',
    advanceWidth: 66,
    strokes: [
      { d: 'M 10 67 C 14 74 21 71 25 60 L 45 18 L 43 66 C 42 73 50 73 58 60', hint: 'Uncino inferiore obbligatorio, salita alla punta e discesa fluida' },
    ],
    exitAnchor: { x: 58, y: 60, kind: 'low' },
  },
  'М': {
    char: 'М',
    advanceWidth: 80,
    strokes: [
      { d: 'M 9 67 C 13 74 20 71 24 60 L 40 18 L 38 66 C 37 73 44 72 48 60 L 63 18 L 58 66 C 57 73 65 73 72 60', hint: 'Uncino iniziale, prima punta, valle centrale, seconda punta e uscita' },
    ],
    exitAnchor: { x: 72, y: 60, kind: 'low' },
  },
  'Н': {
    char: 'Н',
    advanceWidth: 68,
    strokes: [
      { d: 'M 16 25 C 21 18 28 19 26 28 L 16 68 C 14 73 20 73 23 66', hint: 'Prima asta inclinata con piccolo ricciolo' },
      { d: 'M 54 18 L 42 66 C 40 73 48 73 58 60', hint: 'Seconda asta inclinata con codina finale' },
      { d: 'M 22 47 C 31 44 39 48 47 45', hint: 'Ponticello morbido di collegamento al centro' },
    ],
    exitAnchor: { x: 58, y: 60, kind: 'low' },
  },
  'О': {
    char: 'О',
    advanceWidth: 64,
    strokes: [
      { d: 'M 42 20 C 26 17 16 38 16 56 C 16 74 36 74 47 54 C 54 38 49 20 40 20', hint: 'Grande ovale inclinato in senso antiorario' },
    ],
    exitAnchor: { x: 48, y: 52, kind: 'mid' },
  },
  'П': {
    char: 'П',
    advanceWidth: 68,
    strokes: [
      { d: 'M 31 24 L 18 67 C 16 73 10 72 11 66', hint: 'Prima asta inclinata con ricciolo inferiore' },
      { d: 'M 52 24 L 40 66 C 38 73 47 73 56 60', hint: 'Seconda asta con codina d’uscita' },
      { d: 'M 20 26 C 32 16 49 16 58 24', hint: 'Tetto ondulato superiore da sinistra a destra' },
    ],
    exitAnchor: { x: 56, y: 60, kind: 'low' },
  },
  'Р': {
    char: 'Р',
    advanceWidth: 62,
    strokes: [
      { d: 'M 33 24 L 19 67 C 17 73 11 72 11 66', hint: 'Asta inclinata principale' },
      { d: 'M 20 26 C 32 16 53 16 53 31 C 53 45 36 49 26 45', hint: 'Cappello superiore che gira nell’occhiello destro' },
    ],
    exitAnchor: { x: 46, y: 46, kind: 'mid' },
  },
  'С': {
    char: 'С',
    advanceWidth: 58,
    strokes: [
      { d: 'M 47 26 C 41 17 24 19 19 41 C 14 63 23 74 39 70 C 44 68 48 64 51 59', hint: 'Grande curva a C inclinata in senso antiorario' },
    ],
    exitAnchor: { x: 51, y: 59, kind: 'low' },
  },
  'Т': {
    char: 'Т',
    advanceWidth: 74,
    strokes: [
      { d: 'M 30 24 L 18 67 C 16 73 11 72 11 66', hint: 'Prima asta inclinata sinistra' },
      { d: 'M 44 22 L 33 70', hint: 'Asta centrale' },
      { d: 'M 58 24 L 48 66 C 46 73 54 73 63 60', hint: 'Terza asta destra con uscita' },
      { d: 'M 19 25 C 34 16 54 16 66 24', hint: 'Cappello unico superiore che copre le tre aste' },
    ],
    exitAnchor: { x: 63, y: 60, kind: 'low' },
  },
  'У': {
    char: 'У',
    advanceWidth: 64,
    strokes: [
      { d: 'M 16 25 C 21 18 28 19 26 28 L 21 48 C 20 58 31 59 41 44 L 52 18 L 37 70 C 34 74 26 73 25 66', hint: 'Coppa superiore sinistra, salita a destra e discesa elegante sul rigo' },
    ],
    exitAnchor: { x: 46, y: 62, kind: 'low' },
  },
  'Ф': {
    char: 'Ф',
    advanceWidth: 76,
    strokes: [
      { d: 'M 32 30 C 16 30 12 62 27 62 C 37 62 41 44 37 32', hint: 'Ovale sinistro' },
      { d: 'M 46 15 L 33 75 C 31 80 25 80 23 75', hint: 'Asta centrale lunga e inclinata' },
      { d: 'M 42 32 C 58 28 65 56 49 62 C 40 64 36 55 37 44', hint: 'Ovale destro simmetrico' },
    ],
    exitAnchor: { x: 56, y: 60, kind: 'low' },
  },
  'Х': {
    char: 'Х',
    advanceWidth: 64,
    strokes: [
      { d: 'M 16 24 C 28 18 35 32 32 48 C 29 64 20 74 12 68', hint: 'Arco sinistro aperto a sinistra' },
      { d: 'M 52 24 C 40 18 33 32 34 48 C 35 64 44 74 55 62', hint: 'Arco destro tangente al centro con uscita' },
    ],
    exitAnchor: { x: 55, y: 62, kind: 'low' },
  },
  'Ц': {
    char: 'Ц',
    advanceWidth: 68,
    strokes: [
      { d: 'M 15 24 C 20 18 27 18 25 27 L 16 65 C 15 73 28 73 36 58 L 49 18 L 39 68 C 39 73 45 73 51 68 L 47 84 C 45 90 52 90 56 80 L 60 64', hint: 'Come la И maiuscola più piccolo occhiello discendente finale' },
    ],
    exitAnchor: { x: 60, y: 64, kind: 'low' },
  },
  'Ч': {
    char: 'Ч',
    advanceWidth: 62,
    strokes: [
      { d: 'M 15 25 C 20 18 27 19 25 28 L 21 46 C 20 55 34 55 44 43 L 52 18 L 39 66 C 38 73 47 73 54 60', hint: 'Coppa alta sinistra, risalita e asta destra fino al rigo' },
    ],
    exitAnchor: { x: 54, y: 60, kind: 'low' },
  },
  'Ш': {
    char: 'Ш',
    advanceWidth: 80,
    strokes: [
      { d: 'M 14 24 C 19 18 26 18 24 27 L 15 66 C 14 73 25 73 31 58 L 41 20 L 34 66 C 33 73 44 73 50 58 L 60 20 L 53 66 C 52 73 61 73 70 60', hint: 'Tre aste inclinate collegate da due curve morbide alla base' },
    ],
    exitAnchor: { x: 70, y: 60, kind: 'low' },
  },
  'Щ': {
    char: 'Щ',
    advanceWidth: 84,
    strokes: [
      { d: 'M 14 24 C 19 18 26 18 24 27 L 15 66 C 14 73 25 73 31 58 L 41 20 L 34 66 C 33 73 44 73 50 58 L 60 20 L 53 67 C 53 73 59 72 64 68 L 60 84 C 58 90 65 90 69 80 L 74 63', hint: 'Come la Ш maiuscola più l’occhiello discendente finale' },
    ],
    exitAnchor: { x: 74, y: 63, kind: 'low' },
  },
  'Ъ': {
    char: 'Ъ',
    advanceWidth: 64,
    strokes: [
      { d: 'M 14 24 C 24 18 33 18 35 24 L 22 68 C 21 73 43 74 47 59 C 50 47 39 43 29 51', hint: 'Cappello ondulato, discesa e occhiello basso chiuso a destra' },
    ],
    exitAnchor: { x: 48, y: 60, kind: 'low' },
  },
  'Ы': {
    char: 'Ы',
    advanceWidth: 78,
    strokes: [
      { d: 'M 30 18 L 17 68 C 16 74 37 74 41 59 C 44 47 32 44 23 51', hint: 'Prima parte: asta e occhiello inferiore chiuso' },
      { d: 'M 62 18 L 50 66 C 48 73 57 73 66 60', hint: 'Seconda asta verticale inclinata a destra' },
    ],
    exitAnchor: { x: 66, y: 60, kind: 'low' },
  },
  'Ь': {
    char: 'Ь',
    advanceWidth: 58,
    strokes: [
      { d: 'M 32 18 L 19 68 C 18 74 41 74 45 59 C 48 47 35 44 25 52', hint: 'Asta inclinata e morbido occhiello chiuso sul rigo' },
    ],
    exitAnchor: { x: 46, y: 60, kind: 'low' },
  },
  'Э': {
    char: 'Э',
    advanceWidth: 58,
    strokes: [
      { d: 'M 18 25 C 27 16 48 19 44 46 C 41 71 21 75 13 66', hint: 'Grande arco continuo aperto a sinistra' },
      { d: 'M 25 46 L 44 46', hint: 'Linguetta orizzontale centrale' },
    ],
    exitAnchor: { x: 44, y: 58, kind: 'low' },
  },
  'Ю': {
    char: 'Ю',
    advanceWidth: 80,
    strokes: [
      { d: 'M 30 18 L 16 68 C 14 73 10 71 10 66', hint: 'Asta sinistra inclinata' },
      { d: 'M 23 47 L 37 47', hint: 'Ponticello centrale verso l’ovale' },
      { d: 'M 55 20 C 39 18 33 44 36 60 C 39 74 57 74 65 54 C 71 38 66 21 55 20', hint: 'Grande ovale destro completo' },
    ],
    exitAnchor: { x: 66, y: 56, kind: 'low' },
  },
  'Я': {
    char: 'Я',
    advanceWidth: 64,
    strokes: [
      { d: 'M 10 67 C 14 73 20 71 24 62 L 36 38 C 24 38 22 22 36 18 C 46 16 52 22 50 32 L 42 66 C 41 73 49 73 56 60', hint: 'Uncino iniziale, occhiello superiore sinistro e gamba destra fino al rigo' },
    ],
    exitAnchor: { x: 56, y: 60, kind: 'low' },
  },

  // === MINUSCOLE CORSIVE (con punti di entrata e uscita per legature) ===
  'а': {
    char: 'а',
    advanceWidth: 48,
    entryAnchor: { x: 14, y: 60, kind: 'low' },
    exitAnchor: { x: 42, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 34 45 C 24 39 14 51 14 63 C 14 73 25 73 34 61 L 37 42 L 31 67 C 30 73 36 73 42 58', hint: 'Ovale antiorario poi risalita e gamba destra con codina' },
    ],
  },
  'б': {
    char: 'б',
    advanceWidth: 48,
    entryAnchor: { x: 14, y: 60, kind: 'low' },
    exitAnchor: { x: 41, y: 56, kind: 'mid' },
    strokes: [
      { d: 'M 33 45 C 22 39 13 51 14 63 C 15 73 28 73 34 60 C 37 52 33 45 30 37 C 28 28 32 19 45 19', hint: 'Ovale sul rigo, salita verso l’alto con baffo finale a destra' },
    ],
  },
  'в': {
    char: 'в',
    advanceWidth: 46,
    entryAnchor: { x: 10, y: 58, kind: 'low' },
    exitAnchor: { x: 39, y: 56, kind: 'mid' },
    strokes: [
      { d: 'M 10 58 C 22 45 38 25 36 18 C 35 14 28 16 25 27 L 15 65 C 14 73 30 74 34 62 C 37 53 28 49 21 54 C 28 57 35 58 39 56', hint: 'Grande asola alta (sembra una "b" latina) e piccolo occhiello inferiore' },
    ],
  },
  'г': {
    char: 'г',
    advanceWidth: 40,
    entryAnchor: { x: 14, y: 52, kind: 'mid' },
    exitAnchor: { x: 36, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 14 52 C 17 42 26 40 27 47 L 22 66 C 21 73 29 73 36 58', hint: 'Piccola onda curva arrotondata in alto e gamba con uscita' },
    ],
  },
  'д': {
    char: 'д',
    advanceWidth: 48,
    entryAnchor: { x: 14, y: 60, kind: 'low' },
    exitAnchor: { x: 42, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 34 45 C 24 39 14 51 14 63 C 14 73 25 73 34 61 L 37 42 L 26 89 C 24 95 16 94 17 87 C 18 79 29 71 42 58', hint: 'Ovale come la "а", poi asta discendente e cappio verso destra (simile a "g")' },
    ],
  },
  'е': {
    char: 'е',
    advanceWidth: 40,
    entryAnchor: { x: 12, y: 60, kind: 'low' },
    exitAnchor: { x: 36, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 12 60 C 22 53 31 46 29 42 C 27 39 21 43 18 53 C 15 66 21 74 30 67 C 33 65 35 61 36 58', hint: 'Asola inclinata continua identica alla "e" corsiva' },
    ],
  },
  'ё': {
    char: 'ё',
    advanceWidth: 40,
    entryAnchor: { x: 12, y: 60, kind: 'low' },
    exitAnchor: { x: 36, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 12 60 C 22 53 31 46 29 42 C 27 39 21 43 18 53 C 15 66 21 74 30 67 C 33 65 35 61 36 58', hint: 'Asola della "е"' },
      { d: 'M 22 30 L 24 33', hint: 'Primo punto superiore' },
      { d: 'M 32 30 L 34 33', hint: 'Secondo punto superiore' },
    ],
  },
  'ж': {
    char: 'ж',
    advanceWidth: 64,
    entryAnchor: { x: 12, y: 46, kind: 'mid' },
    exitAnchor: { x: 58, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 12 46 C 21 41 26 52 22 64 C 19 72 13 72 10 67', hint: 'Arco sinistro a C rovesciata' },
      { d: 'M 36 42 L 28 72', hint: 'Asta centrale inclinata' },
      { d: 'M 31 58 C 36 52 40 46 47 42 C 53 41 54 46 49 50 C 44 54 42 57 42 62 C 42 71 50 72 58 58', hint: 'Arco destro con uscita fluida' },
    ],
  },
  'з': {
    char: 'з',
    advanceWidth: 44,
    entryAnchor: { x: 15, y: 46, kind: 'mid' },
    exitAnchor: { x: 40, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 15 46 C 21 40 33 42 32 50 C 31 56 24 57 20 57 C 28 57 34 65 29 82 C 25 94 14 94 15 86 C 16 78 27 70 40 58', hint: 'Mezzo arco superiore poi cappio discendente sotto il rigo' },
    ],
  },
  'и': {
    char: 'и',
    advanceWidth: 50,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 45, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 13 66 C 12 73 20 73 27 61 L 37 42 L 31 66 C 30 73 37 73 45 58', hint: 'Due aste con curva dolce in basso (sembra una "u" latina!)' },
    ],
  },
  'й': {
    char: 'й',
    advanceWidth: 50,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 45, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 13 66 C 12 73 20 73 27 61 L 37 42 L 31 66 C 30 73 37 73 45 58', hint: 'Corpo identico alla "и" (forma di u)' },
      { d: 'M 22 30 C 26 35 34 35 38 30', hint: 'Archetto breve sopra la lettera' },
    ],
  },
  'к': {
    char: 'к',
    advanceWidth: 48,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 43, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 12 72', hint: 'Asta inclinata principale' },
      { d: 'M 15 58 C 21 51 28 42 35 42 C 39 42 40 46 37 49 C 33 52 26 54 22 55 C 31 55 34 61 33 67 C 32 72 37 72 43 58', hint: 'Ricciolo superiore e gambetta finale' },
    ],
  },
  'л': {
    char: 'л',
    advanceWidth: 46,
    entryAnchor: { x: 7, y: 67, kind: 'low-hook' },
    exitAnchor: { x: 41, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 7 67 C 10 73 16 72 19 63 L 29 42 L 26 66 C 25 73 33 73 41 58', hint: 'Uncino inferiore obbligatorio, salita alla punta, discesa e uscita' },
    ],
  },
  'м': {
    char: 'м',
    advanceWidth: 62,
    entryAnchor: { x: 7, y: 67, kind: 'low-hook' },
    exitAnchor: { x: 57, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 7 67 C 10 73 16 72 19 63 L 28 42 L 25 66 C 24 73 30 72 34 63 L 44 42 L 41 66 C 40 73 48 73 57 58', hint: 'Uncino inferiore obbligatorio, poi due punte uguali (senza uncino si confonde con "т"!)' },
    ],
  },
  'н': {
    char: 'н',
    advanceWidth: 50,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 45, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 12 72', hint: 'Prima asta inclinata' },
      { d: 'M 15 57 C 22 54 26 62 32 56 L 37 42 L 31 66 C 30 73 37 73 45 58', hint: 'Risalita a metà, ponticello, seconda asta e codina' },
    ],
  },
  'о': {
    char: 'о',
    advanceWidth: 44,
    entryAnchor: { x: 13, y: 60, kind: 'low' },
    exitAnchor: { x: 38, y: 48, kind: 'high' },
    strokes: [
      { d: 'M 32 45 C 22 39 13 51 13 62 C 13 73 27 73 33 60 C 37 51 33 43 27 44 C 27 49 32 50 38 48', hint: 'Ovale chiuso con piccolo nodo di uscita in alto' },
    ],
  },
  'п': {
    char: 'п',
    advanceWidth: 48,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 43, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 12 72', hint: 'Prima asta inclinata' },
      { d: 'M 16 56 C 21 44 30 40 35 44 L 30 66 C 29 73 36 73 43 58', hint: 'Arco superiore e seconda asta (identica alla "n" latina!)' },
    ],
  },
  'р': {
    char: 'р',
    advanceWidth: 48,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 43, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 9 92', hint: 'Asta lunga discendente sotto il rigo' },
      { d: 'M 16 56 C 21 44 30 40 35 44 L 30 66 C 29 73 36 73 43 58', hint: 'Arco superiore e gamba destra fino al rigo (sembra una "p" latina)' },
    ],
  },
  'с': {
    char: 'с',
    advanceWidth: 42,
    entryAnchor: { x: 13, y: 61, kind: 'low' },
    exitAnchor: { x: 37, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 33 45 C 24 39 13 48 13 61 C 13 73 27 73 37 58', hint: 'Curva a C inclinata (sembra "c" latina ma suona S!)' },
    ],
  },
  'т': {
    char: 'т',
    advanceWidth: 64,
    entryAnchor: { x: 18, y: 42, kind: 'mid' },
    exitAnchor: { x: 59, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 18 42 L 11 72', hint: 'Prima asta inclinata' },
      { d: 'M 15 56 C 20 44 28 40 33 44 L 27 72', hint: 'Primo arco e seconda asta' },
      { d: 'M 31 56 C 36 44 44 40 49 44 L 44 66 C 43 73 51 73 59 58', hint: 'Secondo arco e terza asta (sembra una "m" latina!)' },
    ],
  },
  'у': {
    char: 'у',
    advanceWidth: 48,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 44, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 13 65 C 12 73 22 73 28 59 L 36 42 L 26 89 C 24 95 16 94 17 87 C 18 79 30 70 44 58', hint: 'Coppa come "и", poi discesa sotto il rigo e cappio d’uscita (sembra una "y")' },
    ],
  },
  'ф': {
    char: 'ф',
    advanceWidth: 62,
    entryAnchor: { x: 11, y: 59, kind: 'low' },
    exitAnchor: { x: 56, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 30 46 C 20 40 11 50 11 61 C 11 72 23 72 29 60', hint: 'Ovale sinistro' },
      { d: 'M 36 37 L 25 92', hint: 'Asta centrale lunga discendente' },
      { d: 'M 33 47 C 44 40 53 48 51 60 C 49 71 38 72 32 63 C 38 72 48 71 56 58', hint: 'Ovale destro simmetrico con uscita fluida' },
    ],
  },
  'х': {
    char: 'х',
    advanceWidth: 48,
    entryAnchor: { x: 12, y: 45, kind: 'mid' },
    exitAnchor: { x: 42, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 12 45 C 20 40 24 48 22 58 C 20 68 14 73 9 67', hint: 'Semicerchio sinistro verso il basso' },
      { d: 'M 39 45 C 31 40 25 48 24 58 C 23 68 32 74 42 58', hint: 'Semicerchio destro tangente al centro con uscita' },
    ],
  },
  'ц': {
    char: 'ц',
    advanceWidth: 54,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 49, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 13 65 C 12 73 20 73 27 61 L 37 42 L 31 67 C 31 72 36 72 40 68 L 36 84 C 34 89 40 89 44 80 L 49 58', hint: 'Come la "и" più un breve occhiello discendente finale' },
    ],
  },
  'ч': {
    char: 'ч',
    advanceWidth: 46,
    entryAnchor: { x: 14, y: 44, kind: 'mid' },
    exitAnchor: { x: 41, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 14 44 C 15 55 24 56 34 42 L 28 66 C 27 73 34 73 41 58', hint: 'Piccola coppa alta sinistra poi gamba destra fino al rigo' },
    ],
  },
  'ш': {
    char: 'ш',
    advanceWidth: 64,
    entryAnchor: { x: 17, y: 42, kind: 'mid' },
    exitAnchor: { x: 59, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 17 42 L 11 66 C 10 73 18 73 24 61 L 33 42 L 27 66 C 26 73 34 73 40 61 L 49 42 L 44 66 C 43 73 51 73 59 58', hint: 'Tre aste con curve morbide in basso (come una "w" corsiva)' },
    ],
  },
  'щ': {
    char: 'щ',
    advanceWidth: 68,
    entryAnchor: { x: 17, y: 42, kind: 'mid' },
    exitAnchor: { x: 63, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 17 42 L 11 66 C 10 73 18 73 24 61 L 33 42 L 27 66 C 26 73 34 73 40 61 L 49 42 L 44 67 C 44 72 49 72 53 68 L 49 84 C 47 89 53 89 57 80 L 63 58', hint: 'Come la "ш" più l’occhiello discendente finale' },
    ],
  },
  'ъ': {
    char: 'ъ',
    advanceWidth: 50,
    entryAnchor: { x: 11, y: 45, kind: 'mid' },
    exitAnchor: { x: 42, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 11 45 C 16 40 22 41 23 46 L 17 67 C 16 74 34 73 37 61 C 39 52 29 50 22 55 C 24 67 36 70 42 58', hint: 'Piccolo cappello sinistro, discesa, occhiello chiuso e uscita morbida' },
    ],
  },
  'ы': {
    char: 'ы',
    advanceWidth: 62,
    entryAnchor: { x: 18, y: 42, kind: 'mid' },
    exitAnchor: { x: 56, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 18 42 L 12 67 C 11 74 29 73 32 61 C 34 52 24 50 18 55', hint: 'Prima metà identica al segno morbido "ь"' },
      { d: 'M 30 64 C 35 64 41 55 47 42 L 41 66 C 40 73 48 73 56 58', hint: 'Ponticello di legatura e asta finale' },
    ],
  },
  'ь': {
    char: 'ь',
    advanceWidth: 44,
    entryAnchor: { x: 19, y: 42, kind: 'mid' },
    exitAnchor: { x: 39, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 19 42 L 13 67 C 12 74 31 73 34 61 C 36 52 25 50 18 55 C 21 67 33 70 39 58', hint: 'Asta inclinata che chiude in un morbido occhiello destro con uscita' },
    ],
  },
  'э': {
    char: 'э',
    advanceWidth: 44,
    entryAnchor: { x: 14, y: 45, kind: 'mid' },
    exitAnchor: { x: 36, y: 57, kind: 'mid' },
    strokes: [
      { d: 'M 14 45 C 23 39 34 45 31 59 C 28 72 17 74 11 67', hint: 'Curva a C rovesciata aperta a sinistra' },
      { d: 'M 19 57 L 34 57', hint: 'Linguetta orizzontale centrale' },
    ],
  },
  'ю': {
    char: 'ю',
    advanceWidth: 62,
    entryAnchor: { x: 18, y: 42, kind: 'mid' },
    exitAnchor: { x: 52, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 18 42 L 12 72', hint: 'Asta verticale inclinata' },
      { d: 'M 15 57 L 28 57', hint: 'Ponticello centrale verso l’ovale' },
      { d: 'M 47 45 C 37 39 28 51 28 62 C 28 73 42 73 48 60 C 52 51 48 44 43 45', hint: 'Ovale destro chiuso in senso antiorario' },
    ],
  },
  'я': {
    char: 'я',
    advanceWidth: 48,
    entryAnchor: { x: 7, y: 67, kind: 'low-hook' },
    exitAnchor: { x: 43, y: 58, kind: 'low' },
    strokes: [
      { d: 'M 7 67 C 10 73 16 72 19 63 L 26 51 C 19 51 19 42 27 42 C 34 42 36 47 34 52 L 29 66 C 28 73 35 73 43 58', hint: 'Uncino inferiore obbligatorio, piccolo occhiello in alto a sinistra e gamba destra' },
    ],
  },
};
