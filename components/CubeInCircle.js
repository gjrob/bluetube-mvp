import React from 'react';

/**
 * A 3D cube contained inside a circular mask.
 * - circleSize: diameter of the circle
 * - cubeSize: edge length of the cube (slightly smaller than circleSize)
 * - tiltX: constant tilt on X axis
 * - spinSec: rotation duration (lower = faster)
 */
export default function CubeInCircle({
  circleSize = 160,
  cubeSize = 120,
  edge = 'rgba(56,189,248,.9)',  // light blue outline
  face = '#0a122e',              // dark face
  tiltX = -18,
  spinSec = 8
}) {
  const s = `${cubeSize}px`;
  return (
    <div
      className="circle-wrap"
      style={{
        '--circle': `${circleSize}px`,
        '--s': s,
        '--edge': edge,
        '--face': face,
        '--tiltX': `${tiltX}deg`,
        '--spinSec': `${spinSec}s`,
      }}
    >
      <div className="cube">
        <div className="face f" /><div className="face b" />
        <div className="face r" /><div className="face l" />
        <div className="face t" /><div className="face d" />
      </div>

      <style jsx>{`
        .circle-wrap{
          width: var(--circle);
          height: var(--circle);
          border-radius: 50%;
          /* keep everything INSIDE the circle */
          overflow: hidden;
          position: relative;
          display: flex; align-items: center; justify-content: center;

          /* subtle halo + inner vignette so the cube feels seated */
          background: radial-gradient(60% 60% at 50% 50%, rgba(56,189,248,.14), rgba(0,0,0,.08) 55%, rgba(0,0,0,.22) 100%);
          box-shadow:
            inset 0 0 60px rgba(56,189,248,.18),
            0 6px 26px rgba(56,189,248,.16);
          
          /* perspective from the circle so faces never “escape” visually */
          perspective: calc(var(--circle) * 4.5);
        }

        .cube{
          width: var(--s);
          height: var(--s);
          transform-style: preserve-3d;
          transform: rotateX(var(--tiltX)) rotateY(24deg);
          animation: spin var(--spinSec) linear infinite;
          will-change: transform;
        }

        .face{
          position:absolute; inset:0;
          background:
            linear-gradient(145deg, rgba(255,255,255,.035), rgba(0,0,0,.55)),
            var(--face);
          border: 1px solid var(--edge);
          box-shadow:
            inset 0 0 22px rgba(56,189,248,.10),
            0 0 6px rgba(56,189,248,.14);
          backface-visibility: hidden;
        }
        .f{ transform: translateZ(calc(var(--s)/2)); }
        .b{ transform: rotateY(180deg) translateZ(calc(var(--s)/2)); }
        .r{ transform: rotateY(90deg)  translateZ(calc(var(--s)/2)); }
        .l{ transform: rotateY(-90deg) translateZ(calc(var(--s)/2)); }
        .t{ transform: rotateX(90deg)  translateZ(calc(var(--s)/2)); }
        .d{ transform: rotateX(-90deg) translateZ(calc(var(--s)/2)); }

        @keyframes spin {
          from { transform: rotateX(var(--tiltX)) rotateY(0deg); }
          to   { transform: rotateX(var(--tiltX)) rotateY(360deg); }
        }

        @media (prefers-reduced-motion: reduce){
          .cube{ animation: none; }
        }
      `}</style>
    </div>
  );
}
