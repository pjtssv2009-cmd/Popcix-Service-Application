/**
 * POPCIX Original Brand Mascot - "PopHero & Sparky"
 * 
 * Friendly, rounded, energetic smart-home hero character.
 * Original vector SVG illustrations created exclusively for POPCIX.
 */

import React from 'react';

export type MascotMood = 'happy' | 'superhero' | 'waving' | 'celebrating' | 'thinking' | 'sleeping';

export interface MascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 120,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="7" fill="#000000" fillOpacity="0.08" />

        {/* Cape / Energy Aura */}
        {(mood === 'superhero' || mood === 'celebrating') && (
          <path
            d="M50 82C40 98 32 130 38 138C44 146 54 136 60 128L68 96"
            fill="#7C3AED"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}
        {(mood === 'superhero' || mood === 'celebrating') && (
          <path
            d="M110 82C120 98 128 130 122 138C116 146 106 136 100 128L92 96"
            fill="#7C3AED"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* Body (Smooth Pill / Rounded Capsule) */}
        <rect
          x="46"
          y="42"
          width="68"
          height="86"
          rx="34"
          fill="#FFFFFF"
          stroke="#111111"
          strokeWidth="4"
        />

        {/* Head Antenna with Orange Energy Spark */}
        <path d="M80 42V26" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="22" r="9" fill="#FFAA00" stroke="#111111" strokeWidth="3" />
        <path
          d="M80 16L81.5 20.5L86 22L81.5 23.5L80 28L78.5 23.5L74 22L78.5 20.5L80 16Z"
          fill="#FFFFFF"
        />

        {/* Visor / Face Screen */}
        <rect
          x="54"
          y="56"
          width="52"
          height="36"
          rx="18"
          fill="#111111"
        />

        {/* Eyes based on mood */}
        {mood === 'happy' && (
          <>
            <path
              d="M63 74C63 70 67 66 71 66C75 66 79 70 79 74"
              stroke="#FFAA00"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M81 74C81 70 85 66 89 66C93 66 97 70 97 74"
              stroke="#FFAA00"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </>
        )}

        {mood === 'superhero' && (
          <>
            <ellipse cx="69" cy="73" rx="5" ry="6" fill="#10B981" />
            <ellipse cx="91" cy="73" rx="5" ry="6" fill="#10B981" />
            <circle cx="71" cy="71" r="2" fill="#FFFFFF" />
            <circle cx="93" cy="71" r="2" fill="#FFFFFF" />
          </>
        )}

        {mood === 'celebrating' && (
          <>
            {/* Starry Eyes */}
            <path
              d="M69 66L70.5 71L75.5 72.5L70.5 74L69 79L67.5 74L62.5 72.5L67.5 71L69 66Z"
              fill="#FBBF24"
            />
            <path
              d="M91 66L92.5 71L97.5 72.5L92.5 74L91 79L89.5 74L84.5 72.5L89.5 71L91 66Z"
              fill="#FBBF24"
            />
          </>
        )}

        {mood === 'waving' && (
          <>
            <circle cx="69" cy="73" r="4.5" fill="#FFAA00" />
            <circle cx="91" cy="73" r="4.5" fill="#FFAA00" />
            <circle cx="71" cy="71" r="1.5" fill="#FFFFFF" />
            <circle cx="93" cy="71" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {mood === 'thinking' && (
          <>
            <circle cx="68" cy="70" r="4" fill="#0284C7" />
            <circle cx="92" cy="70" r="4" fill="#0284C7" />
            <path d="M76 78Q80 75 84 78" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {mood === 'sleeping' && (
          <>
            <path d="M64 74H74" stroke="#6B6B6B" strokeWidth="3" strokeLinecap="round" />
            <path d="M86 74H96" stroke="#6B6B6B" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* Blush Cheeks */}
        <circle cx="59" cy="79" r="3.5" fill="#FF5757" fillOpacity="0.4" />
        <circle cx="101" cy="79" r="3.5" fill="#FF5757" fillOpacity="0.4" />

        {/* Hero Chest Badge: POPCIX "P" Crest */}
        <circle cx="80" cy="107" r="13" fill="#000000" />
        <circle cx="80" cy="107" r="11" fill="#FFAA00" />
        <text
          x="80"
          y="112"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          fill="#000000"
        >
          P
        </text>

        {/* Arms */}
        {mood === 'waving' ? (
          <>
            {/* Left arm resting */}
            <path
              d="M48 94C38 98 38 112 46 116"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right arm waving up */}
            <path
              d="M112 88C124 74 134 60 138 48"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="138" cy="46" r="6" fill="#FFAA00" stroke="#111111" strokeWidth="3" />
          </>
        ) : mood === 'superhero' ? (
          <>
            {/* Hands on hips */}
            <path
              d="M48 92C34 94 32 110 46 114"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M112 92C126 94 128 110 114 114"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        ) : mood === 'celebrating' ? (
          <>
            {/* Both arms up in victory */}
            <path
              d="M48 88C34 74 26 60 22 48"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M112 88C126 74 134 60 138 48"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="22" cy="46" r="6" fill="#10B981" stroke="#111111" strokeWidth="3" />
            <circle cx="138" cy="46" r="6" fill="#10B981" stroke="#111111" strokeWidth="3" />
          </>
        ) : (
          <>
            {/* Standard friendly resting arms */}
            <path
              d="M48 94C38 98 38 112 46 116"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M112 94C122 98 122 112 114 116"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Feet */}
        <rect x="58" y="126" width="16" height="14" rx="7" fill="#111111" />
        <rect x="86" y="126" width="16" height="14" rx="7" fill="#111111" />
      </svg>
    </div>
  );
};
