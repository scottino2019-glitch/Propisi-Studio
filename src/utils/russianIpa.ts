export interface CharIpaBreakdown {
  char: string;
  ipa: string;
  noteIt?: string;
}

export interface WordIpaResult {
  ipa: string;
  stressedWord: string;
  breakdown: CharIpaBreakdown[];
}

// Known stress positions (0-based index of stressed vowel character) for starter words & pairings
const KNOWN_STRESS_INDEX: Record<string, number> = {
  'привет': 4,     // приве́т
  'спасибо': 4,    // спаси́бо
  'мама': 1,       // ма́ма
  'мир': 1,        // ми́р
  'дом': 1,        // до́м
  'вода': 3,       // вода́
  'молоко': 5,     // молоко́
  'книга': 2,      // кни́га
  'хлеб': 2,       // хле́б
  'любовь': 4,     // любо́вь
  'хорошо': 5,     // хорошо́
  'москва': 5,     // Москва́
  'да': 1,         // да́
  'нет': 1,        // не́т
  'арбуз': 3,      // арбу́з
  'брат': 2,       // бра́т
  'город': 1,      // го́род
  'лес': 1,        // ле́с
  'ёж': 0,         // ёж
  'жизнь': 1,      // жи́знь
  'зима': 3,       // зима́
  'имя': 0,        // и́мя
  'чай': 1,        // ча́й
  'луна': 3,       // луна́
  'нос': 1,        // но́с
  'окно': 3,       // окно́
  'рука': 3,       // рука́
  'слово': 2,      // сло́во
  'тут': 1,        // ту́т
  'утро': 0,       // у́тро
  'фото': 1,       // фо́то
  'цветок': 4,     // цвето́к
  'час': 1,        // ча́с
  'школа': 2,      // шко́ла
  'щука': 1,       // щу́ка
  'объект': 3,     // объе́кт
  'сыр': 1,        // сы́р
  'тетрадь': 4,    // тетра́дь
  'это': 0,        // э́то
  'юг': 0,         // ю́г
  'яблоко': 0,     // я́блоко
};

const VOWELS = new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я']);
const SOFTENING_VOWELS = new Set(['е', 'ё', 'и', 'ю', 'я']);
const ALWAYS_HARD = new Set(['ж', 'ш', 'ц']);
const ALWAYS_SOFT = new Set(['ч', 'щ', 'й']);

const BASE_CONSONANT_IPA: Record<string, string> = {
  б: 'b',
  в: 'v',
  г: 'ɡ',
  д: 'd',
  ж: 'ʐ',
  з: 'z',
  й: 'j',
  к: 'k',
  л: 'ɫ',
  м: 'm',
  н: 'n',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  ф: 'f',
  х: 'x',
  ц: 't͡s',
  ч: 't͡ɕ',
  ш: 'ʂ',
  щ: 'ɕː',
};

const FINAL_DEVOICING: Record<string, string> = {
  б: 'p',
  в: 'f',
  г: 'k',
  д: 't',
  ж: 'ʂ',
  з: 's',
};

function findStressIndex(rawWord: string): { cleanChars: string[]; stressCharIdx: number } {
  // Check for explicit combining acute accent U+0301
  const chars = Array.from(rawWord);
  const cleanChars: string[] = [];
  let explicitStressIdx = -1;

  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === '\u0301') {
      if (cleanChars.length > 0) {
        explicitStressIdx = cleanChars.length - 1;
      }
    } else {
      cleanChars.push(chars[i]);
    }
  }

  const lowerJoined = cleanChars.join('').toLowerCase();

  if (explicitStressIdx >= 0) {
    return { cleanChars, stressCharIdx: explicitStressIdx };
  }

  // 'ё' is always stressed in Russian
  const yoIdx = cleanChars.findIndex((c) => c.toLowerCase() === 'ё');
  if (yoIdx >= 0) {
    return { cleanChars, stressCharIdx: yoIdx };
  }

  if (lowerJoined in KNOWN_STRESS_INDEX) {
    return { cleanChars, stressCharIdx: KNOWN_STRESS_INDEX[lowerJoined] };
  }

  // Fallback: if single vowel, stress that vowel; otherwise first vowel
  const vowelIndices = cleanChars
    .map((c, idx) => (VOWELS.has(c.toLowerCase()) ? idx : -1))
    .filter((idx) => idx >= 0);

  if (vowelIndices.length === 1) {
    return { cleanChars, stressCharIdx: vowelIndices[0] };
  }
  if (vowelIndices.length > 1) {
    return { cleanChars, stressCharIdx: vowelIndices[0] };
  }

  return { cleanChars, stressCharIdx: -1 };
}

export function getRussianIpa(input: string): WordIpaResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ipa: '[]', stressedWord: '', breakdown: [] };
  }

  // Handle multi-word phrases recursively separated by space
  if (trimmed.includes(' ')) {
    const parts = trimmed.split(/\s+/);
    const subResults = parts.map((p) => getRussianIpa(p));
    return {
      ipa: `[${subResults.map((r) => r.ipa.slice(1, -1)).join(' ')}]`,
      stressedWord: subResults.map((r) => r.stressedWord).join(' '),
      breakdown: subResults.flatMap((r, idx) =>
        idx === 0 ? r.breakdown : [{ char: ' ', ipa: ' ' }, ...r.breakdown]
      ),
    };
  }

  const { cleanChars, stressCharIdx } = findStressIndex(trimmed);
  const breakdown: CharIpaBreakdown[] = [];
  const ipaSegments: string[] = [];

  // Build stressed display string
  const stressedWord = cleanChars
    .map((ch, i) => (i === stressCharIdx ? `${ch}\u0301` : ch))
    .join('');

  // Count vowels to know if single-syllable or pre-tonic
  for (let i = 0; i < cleanChars.length; i++) {
    const raw = cleanChars[i];
    const ch = raw.toLowerCase();
    const prev = i > 0 ? cleanChars[i - 1].toLowerCase() : '';
    const next = i + 1 < cleanChars.length ? cleanChars[i + 1].toLowerCase() : '';

    if (ch === 'ъ') {
      breakdown.push({
        char: raw,
        ipa: '—',
        noteIt: 'Segno duro muto: mantiene dura la consonante precedente',
      });
      continue;
    }

    if (ch === 'ь') {
      breakdown.push({
        char: raw,
        ipa: 'ʲ',
        noteIt: 'Segno morbido: addolcisce (palatalizza) la consonante precedente',
      });
      continue;
    }

    if (VOWELS.has(ch)) {
      const isStressed = i === stressCharIdx;
      const isInitialOrAfterVowelOrSign =
        i === 0 || VOWELS.has(prev) || prev === 'ь' || prev === 'ъ';
      const afterAlwaysHard = ALWAYS_HARD.has(prev);

      let vowelIpa = '';
      let noteIt = '';

      if (ch === 'а') {
        if (isStressed) {
          vowelIpa = 'a';
          noteIt = '«a» aperta tonica';
        } else {
          vowelIpa = i + 1 === stressCharIdx || i === 0 ? 'ɐ' : 'ə';
          noteIt = '«a» atona ridotta';
        }
      } else if (ch === 'о') {
        if (isStressed) {
          vowelIpa = 'o';
          noteIt = '«o» tonica piena';
        } else if (i === 0 || i + 1 === stressCharIdx || i + 2 === stressCharIdx) {
          vowelIpa = 'ɐ';
          noteIt = 'Riduzione vocalica (akan’e): si legge come una «a» breve';
        } else {
          vowelIpa = 'ə';
          noteIt = '«o» atona ridotta (schwa)';
        }
      } else if (ch === 'у') {
        vowelIpa = isStressed ? 'u' : 'ʊ';
        noteIt = '«u» arrotondata';
      } else if (ch === 'ы') {
        vowelIpa = 'ɨ';
        noteIt = 'Vocale dura centrale (lingua arretrata)';
      } else if (ch === 'э') {
        vowelIpa = isStressed ? 'ɛ' : 'ɨ';
        noteIt = '«e» aperta senza suono «i» iniziale';
      } else if (ch === 'и') {
        if (afterAlwaysHard) {
          vowelIpa = 'ɨ';
          noteIt = 'Dopo ж/ш/ц suona dura come [ɨ]';
        } else {
          vowelIpa = isStressed ? 'i' : 'ɪ';
          noteIt = isStressed ? '«i» piena' : '«i» breve atona';
        }
      } else if (ch === 'е') {
        const prefix = isInitialOrAfterVowelOrSign ? 'j' : '';
        if (isStressed) {
          vowelIpa = `${prefix}${afterAlwaysHard ? 'ɛ' : 'e'}`;
          noteIt = prefix ? '«ie» tonica' : '«e» che addolcisce la consonante precedente';
        } else {
          vowelIpa = `${prefix}${afterAlwaysHard ? 'ɨ' : 'ɪ'}`;
          noteIt = '«e» atona ridotta verso una «i» breve';
        }
      } else if (ch === 'ё') {
        const prefix = isInitialOrAfterVowelOrSign ? 'j' : '';
        vowelIpa = `${prefix}o`;
        noteIt = 'Sempre tonica: «io» aperta';
      } else if (ch === 'ю') {
        const prefix = isInitialOrAfterVowelOrSign ? 'j' : '';
        vowelIpa = `${prefix}${isStressed ? 'u' : 'ʊ'}`;
        noteIt = prefix ? '«iu» piena' : '«u» che addolcisce la consonante';
      } else if (ch === 'я') {
        const prefix = isInitialOrAfterVowelOrSign ? 'j' : '';
        if (isStressed) {
          vowelIpa = `${prefix}a`;
          noteIt = prefix ? '«ia» tonica' : '«a» che addolcisce la consonante';
        } else {
          vowelIpa = `${prefix}ɪ`;
          noteIt = '«я» atona ridotta verso «i» breve';
        }
      }

      if (isStressed && cleanChars.filter((c) => VOWELS.has(c.toLowerCase())).length > 1) {
        ipaSegments.push(`ˈ${vowelIpa}`);
      } else {
        ipaSegments.push(vowelIpa);
      }
      breakdown.push({ char: raw, ipa: vowelIpa, noteIt });
      continue;
    }

    // Consonant handling
    let base = BASE_CONSONANT_IPA[ch];
    if (!base) {
      breakdown.push({ char: raw, ipa: raw });
      ipaSegments.push(raw);
      continue;
    }

    let noteIt = '';
    const isWordFinal = i === cleanChars.length - 1;
    const isBeforeSoftSignFinal = i === cleanChars.length - 2 && next === 'ь';
    const isSoftened =
      !ALWAYS_HARD.has(ch) &&
      !ALWAYS_SOFT.has(ch) &&
      (SOFTENING_VOWELS.has(next) || next === 'ь');

    // Final obstruent devoicing (e.g., хлеб -> [p], любовь -> [fʲ], ёж -> [ʂ])
    if ((isWordFinal || isBeforeSoftSignFinal) && FINAL_DEVOICING[ch]) {
      base = FINAL_DEVOICING[ch];
      noteIt = `Desonorizzazione finale: «${ch}» si pronuncia [${base}] a fine parola`;
    }

    // Special case: что -> [ʂto]
    if (ch === 'ч' && cleanChars.join('').toLowerCase() === 'что') {
      base = 'ʂ';
      noteIt = 'Eccezione fonetica: in «что» si pronuncia [ʂ]';
    }

    // Palatalized 'л' uses clear 'lʲ' instead of velarized 'ɫ'
    if (ch === 'л' && isSoftened) {
      base = 'l';
    }

    const fullConsonant = isSoftened ? `${base}ʲ` : base;
    if (!noteIt && isSoftened) {
      noteIt = `Consonante addolcita (palatalizzata) prima di «${next}»`;
    }

    ipaSegments.push(fullConsonant);
    breakdown.push({ char: raw, ipa: fullConsonant, noteIt });
  }

  return {
    ipa: `[${ipaSegments.join('')}]`,
    stressedWord,
    breakdown,
  };
}

export const IPA_KEY_RULES = [
  {
    symbol: '[ʲ]',
    title: 'Palatalizzazione (Consonante dolce)',
    description:
      'Quando una consonante precede ь, е, ё, и, ю o я, la lingua si solleva verso il palato aggiungendo un leggero suono «i» simultaneo.',
    example: 'привет → [prʲɪˈvʲet]',
  },
  {
    symbol: '[ɐ] / [ə]',
    title: 'Riduzione vocalica (Akan’e)',
    description:
      'Le vocali «о» ed «а» non accentate perdono il timbro pieno e si pronunciano come una «a» breve [ɐ] o neutra [ə].',
    example: 'молоко → [məɫɐˈko]',
  },
  {
    symbol: '[p t k f s ʂ]',
    title: 'Desonorizzazione a fine parola',
    description:
      'In coda di parola le consonanti sonore б, д, г, в, з, ж diventano sorde (p, t, k, f, s, sh).',
    example: 'любовь → [lʲʊˈbofʲ]',
  },
  {
    symbol: '[ɫ] vs [lʲ]',
    title: 'La «л» dura e dolce',
    description:
      'La «л» dura [ɫ] si articola con la parte posteriore della lingua abbassata; seguita da vocale dolce o ь diventa [lʲ].',
    example: 'луна [ɫʊˈna] vs лес [lʲes]',
  },
];
