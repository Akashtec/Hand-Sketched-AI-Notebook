import React from 'react';

// Hand-sketched SVG doodles with organic wobbly lines
export function PencilArrow({
  direction = 'right',
  className = 'w-12 h-6 text-[#2b2b2b]',
}: {
  direction?: 'right' | 'down' | 'curved';
  className?: string;
}) {
  if (direction === 'curved') {
    return (
      <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
          d="M10 50 C 35 15, 65 10, 85 25"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="1 0.5"
        />
        <path
          d="M72 16 L86 26 L80 40"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (direction === 'down') {
    return (
      <svg viewBox="0 0 40 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
          d="M20 5 Q 23 35 19 58"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M10 46 L19 60 L30 48"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M4 16 Q 40 14 70 15"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M58 6 L72 15 L59 24"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PencilScribble({ className = 'w-24 h-4 text-amber-400' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M4 14 Q 18 4 32 15 T 62 14 T 92 15 T 116 12"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PencilCircleDoodle({ className = 'w-10 h-10 text-rose-500' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M30 8 C 45 7, 54 18, 52 32 C 50 46, 38 53, 24 51 C 10 49, 7 36, 9 24 C 11 12, 23 8, 38 9 C 47 10, 52 17, 50 26"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PencilLightbulb({ className = 'w-6 h-6 text-amber-500' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M14 24 C 11 21, 9 17, 10 12 C 12 6, 20 5, 26 8 C 30 11, 31 17, 28 22 C 26 25, 24 25, 24 28 L 16 28 C 16 26, 15 25, 14 24 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 31 L23 31 M18 34 L22 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 11 L3 9 M33 11 L37 9 M20 4 L20 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PencilStar({ className = 'w-5 h-5 text-amber-500' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M15 3 L 18 11 L 27 12 L 20 18 L 22 27 L 15 22 L 7 27 L 10 18 L 3 12 L 12 11 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Paperclip({ className = 'w-6 h-10 text-stone-500' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M6 14 L 6 30 C 6 35, 18 35, 18 30 L 18 10 C 18 4, 10 4, 10 10 L 10 26 C 10 28, 14 28, 14 26 L 14 12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WireframeImagePlaceholder({ className = 'w-full h-24 text-stone-400' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center border-2 border-stone-400 border-dashed rounded bg-stone-100/50 ${className}`}>
      <svg className="w-8 h-8 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className="absolute bottom-1 right-2 text-xs font-hand text-stone-500">wireframe_img.png</span>
    </div>
  );
}
