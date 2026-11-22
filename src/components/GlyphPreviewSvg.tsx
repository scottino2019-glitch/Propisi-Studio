import React, { useMemo } from 'react';
import { ScriptStyle } from '../types/cyrillic';
import { composeWordStrokes } from '../utils/wordStrokeComposer';

interface GlyphPreviewSvgProps {
  text: string;
  style: ScriptStyle;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  showBaseline?: boolean;
}

export const GlyphPreviewSvg: React.FC<GlyphPreviewSvgProps> = ({
  text,
  style,
  className = 'w-14 h-12',
  strokeColor = '#0F172A',
  strokeWidth = 3.2,
  showBaseline = false,
}) => {
  const composed = useMemo(() => composeWordStrokes(text, style), [text, style]);

  return (
    <svg
      viewBox={composed.viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden="true"
    >
      {showBaseline && (
        <>
          <line
            x1={0}
            y1={42}
            x2={composed.totalWidth}
            y2={42}
            stroke="#E2E8F0"
            strokeWidth={0.8}
          />
          <line
            x1={0}
            y1={72}
            x2={composed.totalWidth}
            y2={72}
            stroke="#CBD5E1"
            strokeWidth={0.9}
          />
        </>
      )}
      {composed.strokes.map((st) => (
        <path
          key={st.id}
          d={st.d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={st.isConnector ? strokeWidth * 0.72 : strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};
