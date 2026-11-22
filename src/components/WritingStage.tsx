import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Grid,
  Pause,
  PenTool,
  Play,
  RotateCcw,
  SkipForward,
  Undo2,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import { ComposedSequence, ScriptStyle } from '../types/cyrillic';
import {
  evaluateStrokeDrawing,
  getStrokeEndpoints,
  Point2D,
} from '../utils/wordStrokeComposer';
import { speakRussian } from '../utils/speech';

interface WritingStageProps {
  sequence: ComposedSequence;
  scriptStyle: ScriptStyle;
  onCompleteItem?: () => void;
  onNextItem?: () => void;
  hasNextItem?: boolean;
  subtitleLabel?: string;
}

type PracticeMode = 'guidato' | 'libero';
type GhostVisibility = 'visibile' | 'sfumata' | 'memoria';

function pointsToSmoothSvgPath(pts: Point2D[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} L ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i].x + pts[i + 1].x) / 2;
    const midY = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

export const WritingStage: React.FC<WritingStageProps> = ({
  sequence,
  scriptStyle,
  onCompleteItem,
  onNextItem,
  hasNextItem,
  subtitleLabel,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [practiceMode, setPracticeMode] = useState<PracticeMode>('guidato');
  const [ghostMode, setGhostMode] = useState<GhostVisibility>('visibile');
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);

  // Guided tracing state
  const [activeStrokeIdx, setActiveStrokeIdx] = useState<number>(0);
  const [completedStrokePaths, setCompletedStrokePaths] = useState<Record<number, string>>({});
  const [isSequenceComplete, setIsSequenceComplete] = useState<boolean>(false);

  // Freehand drawing state
  const [freehandPaths, setFreehandPaths] = useState<string[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point2D[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Feedback message
  const [feedback, setFeedback] = useState<{
    type: 'info' | 'success' | 'error';
    text: string;
  } | null>(null);

  // Animation playback state: 'idle' | 'full' | 'single'
  const [demoMode, setDemoMode] = useState<'idle' | 'full' | 'single'>('idle');
  const [demoStrokeIdx, setDemoStrokeIdx] = useState<number>(0);
  const [demoProgress, setDemoProgress] = useState<number>(0); // 0..1 within demoStrokeIdx
  const [nibPoint, setNibPoint] = useState<Point2D | null>(null);

  const isPlayingDemo = demoMode !== 'idle';
  const totalStrokes = sequence.strokes.length;

  // Precompute endpoints & lengths for all strokes in the sequence
  const strokeMetrics = useMemo(() => {
    return sequence.strokes.map((st) => getStrokeEndpoints(st.d));
  }, [sequence]);

  // Reset state whenever the target character/word or script style changes
  useEffect(() => {
    setActiveStrokeIdx(0);
    setCompletedStrokePaths({});
    setIsSequenceComplete(false);
    setFreehandPaths([]);
    setCurrentPoints([]);
    setIsDrawing(false);
    setFeedback(null);
    // Play one-shot intro demonstration once, then stop cleanly
    setDemoStrokeIdx(0);
    setDemoProgress(0);
    setNibPoint(null);
    setDemoMode(sequence.strokes.length > 0 ? 'full' : 'idle');
  }, [sequence]);

  // One-shot animation loop (stops automatically at end or on user stop)
  useEffect(() => {
    if (demoMode === 'idle' || totalStrokes === 0) {
      setNibPoint(null);
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let lastTime = performance.now();
    let currentIdx = demoStrokeIdx;
    let progress = demoProgress;

    const svgNS = 'http://www.w3.org/2000/svg';
    const tempPath = document.createElementNS(svgNS, 'path');

    const step = (now: number) => {
      if (cancelled) return;

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const stroke = sequence.strokes[currentIdx];
      if (!stroke) {
        setDemoMode('idle');
        setNibPoint(null);
        return;
      }

      const len = strokeMetrics[currentIdx]?.length || 40;
      const baseDuration = stroke.isConnector
        ? Math.max(0.28, len / 110)
        : Math.max(0.55, Math.min(1.8, len / 65));
      const duration = baseDuration / speed;

      progress += dt / duration;

      if (progress >= 1) {
        if (demoMode === 'single') {
          setDemoProgress(1);
          setDemoMode('idle');
          setNibPoint(null);
          return;
        }
        if (currentIdx + 1 < totalStrokes) {
          currentIdx += 1;
          progress = 0;
          setDemoStrokeIdx(currentIdx);
          setDemoProgress(0);
        } else {
          setDemoStrokeIdx(totalStrokes - 1);
          setDemoProgress(1);
          setDemoMode('idle');
          setNibPoint(null);
          return;
        }
      } else {
        setDemoProgress(progress);
      }

      const activeSt = sequence.strokes[currentIdx];
      if (activeSt) {
        tempPath.setAttribute('d', activeSt.d);
        const totalL = tempPath.getTotalLength();
        if (totalL > 0) {
          const pt = tempPath.getPointAtLength(Math.min(1, Math.max(0, progress)) * totalL);
          setNibPoint({ x: pt.x, y: pt.y });
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, sequence, speed, totalStrokes]);

  const clientToSvgPoint = useCallback((clientX: number, clientY: number): Point2D | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const transformed = pt.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (demoMode !== 'idle') {
      setDemoMode('idle');
      setNibPoint(null);
    }
    const pt = clientToSvgPoint(e.clientX, e.clientY);
    if (!pt) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setCurrentPoints([pt]);
    setFeedback(null);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    const pt = clientToSvgPoint(e.clientX, e.clientY);
    if (!pt) return;
    setCurrentPoints((prev) => {
      const last = prev[prev.length - 1];
      if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 0.7) return prev;
      return [...prev, pt];
    });
  };

  const finishDrawingStroke = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length < 2) {
      setCurrentPoints([]);
      return;
    }

    const drawnPath = pointsToSmoothSvgPath(currentPoints);

    if (practiceMode === 'libero') {
      setFreehandPaths((prev) => [...prev, drawnPath]);
      setCurrentPoints([]);
      return;
    }

    // Guided mode evaluation
    if (isSequenceComplete || activeStrokeIdx >= totalStrokes) {
      setCurrentPoints([]);
      return;
    }

    const targetStroke = sequence.strokes[activeStrokeIdx];
    const tolerance = targetStroke.isConnector ? 13 : 12;
    const result = evaluateStrokeDrawing(targetStroke.d, currentPoints, tolerance);

    if (result.passed) {
      const nextCompleted = {
        ...completedStrokePaths,
        [activeStrokeIdx]: drawnPath,
      };
      setCompletedStrokePaths(nextCompleted);
      setCurrentPoints([]);

      if (activeStrokeIdx + 1 >= totalStrokes) {
        setIsSequenceComplete(true);
        setActiveStrokeIdx(totalStrokes);
        setFeedback({
          type: 'success',
          text: 'Ottimo lavoro! Tutti i tratti completati correttamente.',
        });
        onCompleteItem?.();
      } else {
        setActiveStrokeIdx(activeStrokeIdx + 1);
        setFeedback({
          type: 'success',
          text: `Tratto ${activeStrokeIdx + 1} completato.`,
        });
      }
    } else {
      setCurrentPoints([]);
      setFeedback({
        type: 'error',
        text: result.feedbackIt,
      });
    }
  };

  const handleTogglePlay = () => {
    if (isPlayingDemo) {
      setDemoMode('idle');
      setNibPoint(null);
    } else {
      setDemoStrokeIdx(0);
      setDemoProgress(0);
      setDemoMode('full');
    }
  };

  const handlePlaySingleStroke = () => {
    if (activeStrokeIdx >= totalStrokes) return;
    setDemoStrokeIdx(activeStrokeIdx);
    setDemoProgress(0);
    setDemoMode('single');
  };

  const handleResetCanvas = () => {
    setActiveStrokeIdx(0);
    setCompletedStrokePaths({});
    setIsSequenceComplete(false);
    setFreehandPaths([]);
    setCurrentPoints([]);
    setFeedback(null);
  };

  const handleUndo = () => {
    if (practiceMode === 'libero') {
      setFreehandPaths((prev) => prev.slice(0, -1));
      return;
    }
    if (activeStrokeIdx > 0) {
      const targetIdx = isSequenceComplete ? totalStrokes - 1 : activeStrokeIdx - 1;
      const copy = { ...completedStrokePaths };
      delete copy[targetIdx];
      setCompletedStrokePaths(copy);
      setActiveStrokeIdx(targetIdx);
      setIsSequenceComplete(false);
      setFeedback(null);
    }
  };

  const handleSkipStroke = () => {
    if (practiceMode !== 'guidato' || isSequenceComplete) return;
    const st = sequence.strokes[activeStrokeIdx];
    if (!st) return;
    setCompletedStrokePaths((prev) => ({
      ...prev,
      [activeStrokeIdx]: st.d,
    }));
    if (activeStrokeIdx + 1 >= totalStrokes) {
      setIsSequenceComplete(true);
      setActiveStrokeIdx(totalStrokes);
      onCompleteItem?.();
    } else {
      setActiveStrokeIdx(activeStrokeIdx + 1);
    }
    setFeedback({ type: 'info', text: 'Tratto mostrato dalla guida.' });
  };

  const handleSpeak = () => {
    const res = speakRussian(sequence.text);
    if (!res.ok && res.reason) {
      setFeedback({ type: 'info', text: res.reason });
    }
  };

  // Generate 65-deg slant lines across totalWidth
  const slantLines = useMemo(() => {
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    // tan(25deg) ~ 0.466 -> across height 96, dx ~ 44
    for (let x = -20; x < sequence.totalWidth + 50; x += 26) {
      lines.push({ x1: x + 36, y1: 6, x2: x, y2: 96 });
    }
    return lines;
  }, [sequence.totalWidth]);

  const activeStroke = sequence.strokes[activeStrokeIdx];
  const currentLivePath = useMemo(() => pointsToSmoothSvgPath(currentPoints), [currentPoints]);

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-md">
      {/* Top Workspace Control Strip */}
      <div className="px-4 py-3 border-b border-slate-700 bg-[#0F172A] flex flex-wrap items-center justify-between gap-3">
        {/* Practice Mode Switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 border border-slate-700 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setPracticeMode('guidato');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              practiceMode === 'guidato'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Tracciamento guidato</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPracticeMode('libero');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              practiceMode === 'libero'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Pratica libera</span>
          </button>
        </div>

        {/* Visual Helpers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-800 border border-slate-700 rounded-lg">
            {(['visibile', 'sfumata', 'memoria'] as GhostVisibility[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setGhostMode(mode)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors capitalize whitespace-nowrap shrink-0 ${
                  ghostMode === mode
                    ? 'bg-slate-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {mode === 'visibile' ? 'Guida visibile' : mode === 'sfumata' ? 'Sfumata' : 'Memoria'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowRuler((r) => !r)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showRuler
                ? 'bg-blue-950/80 border-blue-500 text-blue-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Mostra o nascondi le righe da quaderno propisi"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Righe propisi</span>
          </button>

          <button
            type="button"
            onClick={handleSpeak}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            title="Ascolta la pronuncia russa"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Ascolta</span>
          </button>
        </div>
      </div>

      {/* Interactive Propisi Paper Canvas */}
      <div className="relative bg-[#334155] px-4 py-4 sm:px-5 sm:py-5 flex flex-col items-center justify-center">
        {/* Clean unboxed metadata header inside canvas */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {scriptStyle === 'corsivo' ? 'Corsivo (Рукописный)' : 'Stampatello (Печатный)'}
            </span>
            <span aria-hidden="true">·</span>
            {subtitleLabel && (
              <>
                <span>{subtitleLabel}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="tabular-nums">
              {totalStrokes} {totalStrokes === 1 ? 'tratto' : 'tratti'}
            </span>
          </div>

          {practiceMode === 'guidato' && totalStrokes > 0 && (
            <div className="font-mono text-xs font-medium text-blue-200 tabular-nums">
              {isSequenceComplete
                ? `Completato (${totalStrokes}/${totalStrokes})`
                : `Tratto ${activeStrokeIdx + 1} di ${totalStrokes}`}
            </div>
          )}
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={sequence.viewBox}
            preserveAspectRatio="xMidYMid meet"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrawingStroke}
            onPointerCancel={finishDrawingStroke}
            className="writing-surface w-full h-[300px] sm:h-[360px] lg:h-[400px] mx-auto cursor-crosshair rounded-lg border-2 border-slate-200 bg-white shadow-lg"
            style={{
              minWidth: sequence.totalWidth > 320 ? `${Math.min(900, sequence.totalWidth * 1.9)}px` : undefined,
            }}
            aria-label={`Area di scrittura interattiva per ${sequence.text}`}
          >
            <defs>
              <marker
                id="stroke-arrow-active"
                markerWidth="5"
                markerHeight="5"
                refX="3.2"
                refY="2.5"
                orient="auto"
              >
                <path d="M 0 0.5 L 4.5 2.5 L 0 4.5 z" fill="#1D4ED8" />
              </marker>
              <marker
                id="stroke-arrow-demo"
                markerWidth="5"
                markerHeight="5"
                refX="3.2"
                refY="2.5"
                orient="auto"
              >
                <path d="M 0 0.5 L 4.5 2.5 L 0 4.5 z" fill="#2563EB" />
              </marker>
            </defs>

            {/* Layer 1: Authentic Propisi Ruled Lines */}
            {showRuler && (
              <g className="pointer-events-none">
                {/* 65-degree cursive slant grid */}
                {scriptStyle === 'corsivo' &&
                  slantLines.map((l, idx) => (
                    <line
                      key={`slant-${idx}`}
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke="#CBD5E1"
                      strokeOpacity={0.75}
                      strokeWidth="0.38"
                      strokeDasharray="1.5 1.5"
                    />
                  ))}

                {/* Ascender line (y=18) */}
                <line
                  x1={0}
                  y1={18}
                  x2={sequence.totalWidth}
                  y2={18}
                  stroke="#94A3B8"
                  strokeOpacity={0.65}
                  strokeWidth="0.45"
                  strokeDasharray="2 2"
                />
                {/* X-Height corridor (y=42) */}
                <line
                  x1={0}
                  y1={42}
                  x2={sequence.totalWidth}
                  y2={42}
                  stroke="#64748B"
                  strokeOpacity={0.65}
                  strokeWidth="0.55"
                />
                {/* Baseline (y=72) */}
                <line
                  x1={0}
                  y1={72}
                  x2={sequence.totalWidth}
                  y2={72}
                  stroke="#334155"
                  strokeOpacity={0.8}
                  strokeWidth="0.75"
                />
                {/* Descender line (y=92) */}
                <line
                  x1={0}
                  y1={92}
                  x2={sequence.totalWidth}
                  y2={92}
                  stroke="#94A3B8"
                  strokeOpacity={0.65}
                  strokeWidth="0.45"
                  strokeDasharray="2 2"
                />
              </g>
            )}

            {/* Layer 2: Ghost Template Paths */}
            {ghostMode !== 'memoria' && (
              <g className="pointer-events-none">
                {sequence.strokes.map((st, idx) => {
                  const isConnector = st.isConnector;
                  const opacity = ghostMode === 'visibile' ? (isConnector ? 0.45 : 0.65) : 0.22;
                  return (
                    <path
                      key={`ghost-${st.id}-${idx}`}
                      d={st.d}
                      fill="none"
                      stroke={isConnector ? '#93C5FD' : '#CBD5E1'}
                      strokeOpacity={opacity}
                      strokeWidth={isConnector ? 2.1 : 3.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={isConnector ? '1.5 1.5' : undefined}
                    />
                  );
                })}
              </g>
            )}

            {/* Layer 3: Guided Mode Active Stroke Highlight & Start Dots */}
            {practiceMode === 'guidato' && !isPlayingDemo && !isSequenceComplete && (
              <g className="pointer-events-none">
                {/* Active target stroke soft highlight */}
                {activeStroke && (
                  <>
                    <path
                      d={activeStroke.d}
                      fill="none"
                      stroke="#3B82F6"
                      strokeOpacity={0.35}
                      strokeWidth={4.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      markerEnd={
                        (strokeMetrics[activeStrokeIdx]?.length ?? 0) > 8
                          ? 'url(#stroke-arrow-active)'
                          : undefined
                      }
                    />
                  </>
                )}

                {/* Numbered starting dot for the active stroke */}
                {strokeMetrics[activeStrokeIdx] && (
                  <g>
                    <circle
                      cx={strokeMetrics[activeStrokeIdx].start.x}
                      cy={strokeMetrics[activeStrokeIdx].start.y}
                      r={3.4}
                      fill="#DC2626"
                      stroke="#FFFFFF"
                      strokeWidth={0.8}
                    />
                    <text
                      x={strokeMetrics[activeStrokeIdx].start.x}
                      y={strokeMetrics[activeStrokeIdx].start.y + 1.15}
                      textAnchor="middle"
                      fontSize="3.4"
                      fontWeight="700"
                      fill="#FFFFFF"
                      className="font-mono"
                    >
                      {activeStrokeIdx + 1}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* Layer 4: Completed User Strokes (Guided Mode) */}
            {practiceMode === 'guidato' && (
              <g className="pointer-events-none">
                {Object.entries(completedStrokePaths).map(([idxStr, d]) => (
                  <path
                    key={`done-${idxStr}`}
                    d={d}
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth={3.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>
            )}

            {/* Layer 5: Freehand User Strokes */}
            {practiceMode === 'libero' && (
              <g className="pointer-events-none">
                {freehandPaths.map((d, idx) => (
                  <path
                    key={`free-${idx}`}
                    d={d}
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth={3.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>
            )}

            {/* Layer 6: Active Drawing Stroke in Progress */}
            {currentLivePath && (
              <path
                d={currentLivePath}
                fill="none"
                stroke="#1D4ED8"
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none"
              />
            )}

            {/* Layer 7: Animated Full Demo Playback Overlay */}
            {isPlayingDemo && (
              <g className="pointer-events-none">
                {sequence.strokes.map((st, idx) => {
                  if (demoMode === 'full' && idx < demoStrokeIdx) {
                    return (
                      <path
                        key={`demo-done-${idx}`}
                        d={st.d}
                        fill="none"
                        stroke="#1D4ED8"
                        strokeWidth={3.1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  }
                  if (idx === demoStrokeIdx) {
                    return (
                      <path
                        key={`demo-curr-${idx}`}
                        d={st.d}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth={3.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                        strokeDasharray="1"
                        strokeDashoffset={1 - demoProgress}
                        markerEnd={
                          demoProgress > 0.9 && (strokeMetrics[idx]?.length ?? 0) > 8
                            ? 'url(#stroke-arrow-demo)'
                            : undefined
                        }
                      />
                    );
                  }
                  return null;
                })}

                {/* Active Demo Starting Dot */}
                {strokeMetrics[demoStrokeIdx] && (
                  <g>
                    <circle
                      cx={strokeMetrics[demoStrokeIdx].start.x}
                      cy={strokeMetrics[demoStrokeIdx].start.y}
                      r={3.2}
                      fill="#DC2626"
                      stroke="#FFFFFF"
                      strokeWidth={0.7}
                    />
                    <text
                      x={strokeMetrics[demoStrokeIdx].start.x}
                      y={strokeMetrics[demoStrokeIdx].start.y + 1.1}
                      textAnchor="middle"
                      fontSize="3.2"
                      fontWeight="700"
                      fill="#FFFFFF"
                      className="font-mono"
                    >
                      {demoStrokeIdx + 1}
                    </text>
                  </g>
                )}

                {/* Moving Pen Nib Indicator */}
                {nibPoint && (
                  <g>
                    <circle
                      cx={nibPoint.x}
                      cy={nibPoint.y}
                      r={3.5}
                      fill="#1D4ED8"
                      fillOpacity={0.22}
                    />
                    <circle
                      cx={nibPoint.x}
                      cy={nibPoint.y}
                      r={1.7}
                      fill="#1D4ED8"
                      stroke="#FFFFFF"
                      strokeWidth={0.6}
                    />
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>

        {/* Current Stroke Pedagogical Cue + Feedback Bar */}
        <div className="w-full mt-3 min-h-[40px] flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 text-sm">
            {feedback ? (
              <div
                className={`flex items-center gap-2 font-medium ${
                  feedback.type === 'success'
                    ? 'text-emerald-300'
                    : feedback.type === 'error'
                      ? 'text-rose-300'
                      : 'text-sky-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            ) : practiceMode === 'guidato' && activeStroke ? (
              <p className="text-slate-200 text-xs sm:text-sm">
                <span className="font-semibold text-white">
                  Tratto {activeStrokeIdx + 1}:
                </span>{' '}
                {activeStroke.hint || 'Segui la linea guida dal punto rosso alla freccia.'}
              </p>
            ) : (
              <p className="text-slate-300 text-xs sm:text-sm">
                Scrivi liberamente sul rigo usando mouse, dito o pennino.
              </p>
            )}
          </div>

          {isSequenceComplete && hasNextItem && onNextItem && (
            <button
              type="button"
              onClick={onNextItem}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Prossimo esercizio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Playback & Canvas Action Bar */}
      <div className="px-4 py-3 border-t border-slate-700 bg-[#0F172A] flex flex-wrap items-center justify-between gap-3">
        {/* Animation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            {isPlayingDemo ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Ferma guida</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Anima tratti</span>
              </>
            )}
          </button>

          {practiceMode === 'guidato' && !isSequenceComplete && (
            <button
              type="button"
              onClick={handlePlaySingleStroke}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Anima una volta sola il tratto corrente"
            >
              <Play className="w-3 h-3 text-blue-400" />
              <span>Mostra tratto</span>
            </button>
          )}

          {/* Speed selector */}
          <div className="flex items-center gap-0.5 p-0.5 bg-slate-800 border border-slate-700 rounded-lg">
            {([0.5, 1, 1.5] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                  speed === s
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          {practiceMode === 'guidato' && !isSequenceComplete && (
            <button
              type="button"
              onClick={handleSkipStroke}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Completa questo tratto automaticamente e passa al successivo"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Completa tratto</span>
            </button>
          )}
        </div>

        {/* Canvas Clear / Undo / Next Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={
              practiceMode === 'libero'
                ? freehandPaths.length === 0
                : activeStrokeIdx === 0 && !isSequenceComplete
            }
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Annulla</span>
          </button>

          <button
            type="button"
            onClick={handleResetCanvas}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pulisci foglio</span>
          </button>

          {onNextItem && hasNextItem && (
            <button
              type="button"
              onClick={onNextItem}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
              title="Elemento successivo"
            >
              <ChevronLeft className="w-3.5 h-3.5 hidden" />
              <span>Avanti</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
