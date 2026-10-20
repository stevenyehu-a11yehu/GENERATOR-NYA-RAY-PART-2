import React from 'react';

interface HalodocLogoProps {
  className?: string;
  height?: number | string;
  color?: string;
}

/**
 * Halodoc Official Logo (Stethoscope icon + 'halodoc' wordmark)
 * Directly matching the uploaded Halodoc-Logo.png
 */
export const HalodocLogo: React.FC<HalodocLogoProps> = ({
  className = '',
  height = 38,
  color = '#E0004D',
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 460 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height, width: 'auto', display: 'block' }}
        className="overflow-visible"
      >
        {/* ================= STETHOSCOPE ICON ================= */}
        <g stroke={color} strokeLinecap="round" strokeLinejoin="round">
          {/* Left Earpiece Cup */}
          <path
            d="M 18 40 L 32 40 M 18 40 C 18 56 36 60 48 53 C 48 44 48 40 48 40 L 36 40"
            strokeWidth="0"
            fill="none"
          />
          {/* Stethoscope Left Earpiece Terminal */}
          <path
            d="M 12 40 L 26 40"
            strokeWidth="8.5"
          />
          <path
            d="M 40 40 L 52 40"
            strokeWidth="8.5"
          />
          <path
            d="M 16 40 C 16 62 48 62 48 40"
            strokeWidth="8.5"
            fill="none"
          />

          {/* Right Earpiece / Sensor Ring */}
          <circle
            cx="94"
            cy="46"
            r="13"
            strokeWidth="8.5"
            fill="none"
          />

          {/* Stethoscope Main U-Tube (Connecting left cup and right sensor to the bottom) */}
          <path
            d="M 32 58 C 32 94 44 110 94 110 C 144 110 156 94 156 58"
            strokeWidth="0"
            fill="none"
          />
          {/* Real curve from uploaded logo:
              Left side of tube starts below left earpiece (x=32, y=55)
              goes down, sweeps across bottom to right stem at x=94, going up into stem to y=64 */}
          <path
            d="M 32 56 C 32 96 36 108 63 108 C 90 108 94 96 94 65"
            strokeWidth="8.5"
            fill="none"
          />
        </g>

        {/* ================= WORDMARK "halodoc" ================= */}
        {/* Custom drawn high-precision geometric glyphs */}
        <g fill={color}>
          {/* 'h' */}
          <path d="M 135 15 L 144 15 L 144 58 C 148 50 156 46 167 46 C 181 46 189 55 189 71 L 189 104 L 180 104 L 180 72 C 180 61 174 54 163 54 C 152 54 144 63 144 76 L 144 104 L 135 104 Z" />

          {/* 'a' */}
          <path d="M 226 48 L 226 56 C 221 50 213 46 203 46 C 189 46 179 57 179 75 C 179 93 189 105 204 105 C 213 105 221 101 226 95 L 226 104 L 235 104 L 235 48 Z M 207 97 C 195 97 188 88 188 75 C 188 63 195 54 207 54 C 219 54 226 63 226 75 C 226 88 219 97 207 97 Z" />

          {/* 'l' */}
          <path d="M 249 15 L 258 15 L 258 104 L 249 104 Z" />

          {/* 'o' (first) */}
          <path d="M 296 46 C 279 46 267 59 267 75 C 267 92 279 105 296 105 C 313 105 325 92 325 75 C 325 59 313 46 296 46 Z M 296 97 C 285 97 277 87 277 75 C 277 63 285 54 296 54 C 307 54 315 63 315 75 C 315 87 307 97 296 97 Z" />

          {/* 'd' */}
          <path d="M 374 15 L 365 15 L 365 55 C 360 49 352 46 342 46 C 327 46 316 58 316 75 C 316 93 327 105 342 105 C 352 105 360 101 365 95 L 365 104 L 374 104 Z M 345 97 C 334 97 326 87 326 75 C 326 63 334 54 345 54 C 356 54 365 63 365 75 C 365 87 356 97 345 97 Z" />

          {/* 'o' (second) */}
          <path d="M 405 46 C 388 46 376 59 376 75 C 376 92 388 105 405 105 C 422 105 434 92 434 75 C 434 59 422 46 405 46 Z M 405 97 C 394 97 386 87 386 75 C 386 63 394 54 405 54 C 416 54 424 63 424 75 C 424 87 416 97 405 97 Z" />

          {/* 'c' */}
          <path d="M 469 61 L 462 66 C 458 58 452 54 445 54 C 434 54 426 63 426 75 C 426 88 434 97 445 97 C 452 97 458 93 462 86 L 469 91 C 464 100 455 105 444 105 C 428 105 416 92 416 75 C 416 58 428 46 444 46 C 455 46 464 52 469 61 Z" />
        </g>
      </svg>
    </div>
  );
};
