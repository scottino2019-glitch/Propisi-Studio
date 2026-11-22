import { CORSIVO_GLYPHS } from '../data/strokesCorsivo';
import { STAMPATELLO_GLYPHS } from '../data/strokesStampatello';
import { ComposedSequence, ComposedStroke, GlyphDefinition, ScriptStyle } from '../types/cyrillic';

/**
 * Shifts all x coordinates in a simple SVG path (supporting M, L, C, Q, Z) by offsetX.
 */
export function translateSvgPathX(d: string, offsetX: number): string {
  if (offsetX === 0) return d;
  const tokens = d.match(/[a-zA-Z]|[-+]?\d*\.?\d+/g);
  if (!tokens) return d;

  const out: string[] = [];
  let i = 0;
  let cmd = '';

  const shiftX = (val: string) => {
    const num = parseFloat(val) + offsetX;
    return Number.isInteger(num) ? String(num) : num.toFixed(2).replace(/\.?0+$/, '');
  };

  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[a-zA-Z]$/.test(token)) {
      cmd = token;
      out.push(cmd);
      i++;
      continue;
    }

    if (cmd === 'M' || cmd === 'L' || cmd === 'T') {
      out.push(shiftX(tokens[i]), tokens[i + 1]);
      i += 2;
    } else if (cmd === 'C') {
      out.push(
        shiftX(tokens[i]),
        tokens[i + 1],
        shiftX(tokens[i + 2]),
        tokens[i + 3],
        shiftX(tokens[i + 4]),
        tokens[i + 5]
      );
      i += 6;
    } else if (cmd === 'Q' || cmd === 'S') {
      out.push(
        shiftX(tokens[i]),
        tokens[i + 1],
        shiftX(tokens[i + 2]),
        tokens[i + 3]
      );
      i += 4;
    } else if (cmd === 'H') {
      out.push(shiftX(tokens[i]));
      i += 1;
    } else {
      out.push(token);
      i += 1;
    }
  }

  return out.join(' ');
}

function getGlyph(char: string, style: ScriptStyle): GlyphDefinition | undefined {
  const dict = style === 'corsivo' ? CORSIVO_GLYPHS : STAMPATELLO_GLYPHS;
  return dict[char] ?? dict[char.toLowerCase()];
}

function buildCorsivoConnector(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  entryKind?: string
): string {
  const dx = toX - fromX;
  if (entryKind === 'low-hook') {
    // Drop softly toward the lower hook entry
    const cp1x = fromX + dx * 0.45;
    const cp1y = Math.max(fromY, toY) + 3;
    const cp2x = fromX + dx * 0.7;
    const cp2y = toY + 1;
    return `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${toX.toFixed(1)} ${toY.toFixed(1)}`;
  }

  const cp1x = fromX + dx * 0.45;
  const cp1y = fromY - 2;
  const cp2x = fromX + dx * 0.55;
  const cp2y = toY + 2;
  return `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${toX.toFixed(1)} ${toY.toFixed(1)}`;
}

/**
 * Composes any Cyrillic string into a complete sequence of positioned SVG strokes.
 */
export function composeWordStrokes(text: string, style: ScriptStyle): ComposedSequence {
  const cleanText = text.trim();
  const strokes: ComposedStroke[] = [];
  const glyphBoxes: ComposedSequence['glyphBoxes'] = [];

  const paddingLeft = 14;
  const paddingRight = 14;
  let cursorX = paddingLeft;

  let prevExitGlobal: { x: number; y: number; kind?: string } | null = null;

  for (let idx = 0; idx < cleanText.length; idx++) {
    const ch = cleanText[idx];

    if (ch === ' ') {
      cursorX += 26;
      prevExitGlobal = null;
      continue;
    }

    const glyph = getGlyph(ch, style);
    if (!glyph) {
      continue;
    }

    // In corsivo lowercase, tighten inter-character spacing slightly so connections feel natural
    const isUpper = ch === ch.toUpperCase() && ch !== ch.toLowerCase();
    if (idx > 0 && prevExitGlobal && style === 'corsivo') {
      const kerningAdjust = isUpper ? 2 : -4;
      cursorX += kerningAdjust;
    } else if (idx > 0 && style === 'stampatello') {
      cursorX += 2;
    }

    const glyphX = cursorX;
    glyphBoxes.push({
      char: ch,
      x: glyphX,
      width: glyph.advanceWidth,
      index: idx,
    });

    // Add connector stroke in corsivo when previous glyph exited and current glyph has an entry anchor
    if (style === 'corsivo' && prevExitGlobal && glyph.entryAnchor) {
      const targetX = glyphX + glyph.entryAnchor.x;
      const targetY = glyph.entryAnchor.y;
      const dist = Math.hypot(targetX - prevExitGlobal.x, targetY - prevExitGlobal.y);

      if (dist > 2 && dist < 52) {
        strokes.push({
          id: `conn-${idx}`,
          d: buildCorsivoConnector(
            prevExitGlobal.x,
            prevExitGlobal.y,
            targetX,
            targetY,
            glyph.entryAnchor.kind
          ),
          charIndex: idx,
          char: ch,
          strokeIndexInChar: -1,
          isConnector: true,
          hint: `Legatura verso «${ch}»`,
        });
      }
    }

    glyph.strokes.forEach((st, sIdx) => {
      strokes.push({
        id: `g-${idx}-s-${sIdx}`,
        d: translateSvgPathX(st.d, glyphX),
        charIndex: idx,
        char: ch,
        strokeIndexInChar: sIdx,
        isConnector: false,
        hint: st.hint,
      });
    });

    prevExitGlobal = glyph.exitAnchor
      ? {
          x: glyphX + glyph.exitAnchor.x,
          y: glyph.exitAnchor.y,
          kind: glyph.exitAnchor.kind,
        }
      : null;

    cursorX += glyph.advanceWidth;
  }

  const totalWidth = Math.max(100, cursorX + paddingRight);

  return {
    text: cleanText,
    style,
    strokes,
    totalWidth,
    viewBox: `0 0 ${totalWidth} 100`,
    glyphBoxes,
  };
}

/**
 * Checks whether a string contains at least one supported Cyrillic character.
 */
export function hasCyrillicLetters(input: string): boolean {
  return /[А-Яа-яЁё]/.test(input);
}

/**
 * Strips unsupported non-Cyrillic characters except spaces.
 */
export function sanitizeCyrillicInput(input: string): string {
  return input.replace(/[^А-Яа-яЁё\s-]/g, '');
}

export interface Point2D {
  x: number;
  y: number;
}

export interface StrokeEvaluation {
  passed: boolean;
  coverage: number;
  startDistance: number;
  directionScore: number;
  feedbackIt: string;
}

/**
 * Samples points along an SVG path using an off-screen SVGPathElement and compares
 * the user's drawn stroke points (in the same SVG coordinate space).
 */
export function evaluateStrokeDrawing(
  svgPathD: string,
  userPoints: Point2D[],
  tolerance = 11
): StrokeEvaluation {
  if (userPoints.length < 2) {
    return {
      passed: false,
      coverage: 0,
      startDistance: 999,
      directionScore: 0,
      feedbackIt: 'Traccia un movimento continuo lungo la guida.',
    };
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const pathEl = document.createElementNS(svgNS, 'path');
  pathEl.setAttribute('d', svgPathD);
  const totalLen = pathEl.getTotalLength();

  if (totalLen < 2) {
    return {
      passed: true,
      coverage: 1,
      startDistance: 0,
      directionScore: 1,
      feedbackIt: 'Punto completato.',
    };
  }

  // Handle very short dot strokes (like dots on ё)
  if (totalLen < 8) {
    const mid = pathEl.getPointAtLength(totalLen / 2);
    const minDist = userPoints.reduce(
      (best, p) => Math.min(best, Math.hypot(p.x - mid.x, p.y - mid.y)),
      Infinity
    );
    const passed = minDist <= tolerance + 3;
    return {
      passed,
      coverage: passed ? 1 : 0,
      startDistance: minDist,
      directionScore: 1,
      feedbackIt: passed ? 'Tratto corretto!' : 'Avvicinati al punto indicato.',
    };
  }

  const sampleCount = Math.max(12, Math.min(48, Math.ceil(totalLen / 3)));
  const targetSamples: Point2D[] = [];
  for (let i = 0; i <= sampleCount; i++) {
    const pt = pathEl.getPointAtLength((i / sampleCount) * totalLen);
    targetSamples.push({ x: pt.x, y: pt.y });
  }

  const startPt = targetSamples[0];
  const endPt = targetSamples[targetSamples.length - 1];
  const userStart = userPoints[0];
  const userEnd = userPoints[userPoints.length - 1];

  // Check start proximity (allow starting within first 25% of user points or tolerance * 1.45)
  const startDistance = Math.hypot(userStart.x - startPt.x, userStart.y - startPt.y);

  // Compute how many target sample points were covered within tolerance
  let covered = 0;
  for (const t of targetSamples) {
    let minD = Infinity;
    for (const u of userPoints) {
      const d = Math.hypot(u.x - t.x, u.y - t.y);
      if (d < minD) minD = d;
      if (minD <= tolerance) break;
    }
    if (minD <= tolerance) covered++;
  }
  const coverage = covered / targetSamples.length;

  // Check direction alignment if start and end are distinct enough
  const pathChord = Math.hypot(endPt.x - startPt.x, endPt.y - startPt.y);
  let directionScore = 1;
  if (pathChord > 14) {
    const startToStart = Math.hypot(userStart.x - startPt.x, userStart.y - startPt.y);
    const startToEnd = Math.hypot(userStart.x - endPt.x, userStart.y - endPt.y);
    const endToEnd = Math.hypot(userEnd.x - endPt.x, userEnd.y - endPt.y);
    if (startToEnd < startToStart * 0.7 && endToEnd > startToEnd) {
      directionScore = 0;
    }
  }

  // Also ensure user didn't scribble wildly far away from the path
  let onTrackUserPts = 0;
  for (const u of userPoints) {
    let minD = Infinity;
    for (const t of targetSamples) {
      const d = Math.hypot(u.x - t.x, u.y - t.y);
      if (d < minD) minD = d;
    }
    if (minD <= tolerance * 1.6) onTrackUserPts++;
  }
  const precision = onTrackUserPts / userPoints.length;

  if (directionScore === 0) {
    return {
      passed: false,
      coverage,
      startDistance,
      directionScore,
      feedbackIt: 'Direzione invertita: parti dal cerchio rosso numerato.',
    };
  }

  if (startDistance > tolerance * 1.8 && coverage < 0.65) {
    return {
      passed: false,
      coverage,
      startDistance,
      directionScore,
      feedbackIt: 'Inizia dal punto di partenza indicato sulla guida.',
    };
  }

  if (coverage >= 0.62 && precision >= 0.55) {
    return {
      passed: true,
      coverage,
      startDistance,
      directionScore,
      feedbackIt: 'Tratto preciso!',
    };
  }

  return {
    passed: false,
    coverage,
    startDistance,
    directionScore,
    feedbackIt: 'Segui tutta la lunghezza del tratto fino alla freccia.',
  };
}

/**
 * Extracts start point and initial tangent angle (in degrees) of an SVG path for rendering the numbered start marker and arrow.
 */
export function getStrokeEndpoints(svgPathD: string): {
  start: Point2D;
  end: Point2D;
  endAngleDeg: number;
  length: number;
} {
  if (typeof document === 'undefined') {
    return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, endAngleDeg: 0, length: 0 };
  }
  const svgNS = 'http://www.w3.org/2000/svg';
  const pathEl = document.createElementNS(svgNS, 'path');
  pathEl.setAttribute('d', svgPathD);
  const length = pathEl.getTotalLength();
  if (length <= 0.1) {
    return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, endAngleDeg: 0, length: 0 };
  }
  const p0 = pathEl.getPointAtLength(0);
  const pEnd = pathEl.getPointAtLength(length);
  const pBefore = pathEl.getPointAtLength(Math.max(0, length - Math.min(4, length * 0.2)));
  const angle = (Math.atan2(pEnd.y - pBefore.y, pEnd.x - pBefore.x) * 180) / Math.PI;
  return {
    start: { x: p0.x, y: p0.y },
    end: { x: pEnd.x, y: pEnd.y },
    endAngleDeg: angle,
    length,
  };
}
