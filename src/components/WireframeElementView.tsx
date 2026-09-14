import React, { useState } from 'react';
import { WireframeElement } from '../types';
import { PencilScribble, WireframeImagePlaceholder } from './SketchSvgDoodles';
import { Sparkles, Trash2, Copy, Move, CheckSquare, Square, Edit3, Plus } from 'lucide-react';

interface Props {
  element: WireframeElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: WireframeElement) => void;
  onDelete: () => void;
  onExpandAi: (element: WireframeElement) => void;
  onOpenAnnotation?: (element: WireframeElement) => void;
}

export const WireframeElementView: React.FC<Props> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onExpandAi,
  onOpenAnnotation,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCardClick = () => {
    onSelect();
    if (onOpenAnnotation) {
      onOpenAnnotation(element);
    }
  };

  // Border style classes with hand-sketched irregularities
  const getSketchClass = () => {
    switch (element.type) {
      case 'mobile-screen':
        return 'rounded-[28px] border-[2.5px] border-[#2b2b2b] bg-[#fffef9] sketch-shadow-lg';
      case 'browser-window':
        return 'rounded-xl border-[2.5px] border-[#2b2b2b] bg-[#fffef9] sketch-shadow-lg';
      case 'card':
        return 'sketch-border bg-[#fffef9] sketch-shadow';
      case 'search-bar':
        return 'sketch-pill bg-[#fffef9] sketch-shadow-sm';
      case 'checkbox-list':
        return 'sketch-border-2 bg-[#fffef9] sketch-shadow';
      case 'chart-sketch':
        return 'sketch-border bg-[#fffef9] sketch-shadow';
      default:
        return 'sketch-border bg-[#fffef9] sketch-shadow';
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        transform: `rotate(${element.rotation || 0}deg)`,
      }}
      className={`relative group cursor-pointer transition-all duration-150 ${getSketchClass()} ${
        isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-[#f7f4ea]' : ''
      }`}
    >
      {/* Scotch tape on top corner for cards */}
      {(element.type === 'card' || element.type === 'checkbox-list') && (
        <div className="scotch-tape -top-2 left-1/2 -translate-x-1/2 -rotate-1 pointer-events-none" />
      )}

      {/* Floating Action Bar when selected or hovered */}
      <div className="absolute -top-10 right-2 hidden group-hover:flex items-center gap-1.5 bg-[#2b2b2b] text-[#f7f4ea] px-2 py-1 rounded-full text-xs shadow-md z-30 font-hand">
        {onOpenAnnotation && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAnnotation(element);
              }}
              className="flex items-center gap-1 hover:text-amber-300 px-1.5 py-0.5 rounded transition"
              title="Add handwritten pencil annotation"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Annotate</span>
            </button>
            <span className="text-stone-500">|</span>
          </>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpandAi(element);
          }}
          className="flex items-center gap-1 hover:text-amber-300 px-1.5 py-0.5 rounded transition"
          title="Ask AI to expand this wireframe component"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Expand</span>
        </button>
        <span className="text-stone-500">|</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="hover:text-rose-300 p-1 rounded transition"
          title="Remove element"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MOBILE SCREEN WIREFRAME */}
      {element.type === 'mobile-screen' && (
        <div className="p-3.5 min-w-[280px] max-w-[340px]">
          {/* Smartphone top bar & speaker notch */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-stone-300/80 mb-3 text-xs font-mono-code text-stone-500">
            <span>9:41</span>
            {/* Hand-drawn speaker & camera notch */}
            <div className="flex items-center gap-1.5 px-3 py-0.5 bg-stone-200/80 rounded-full border border-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-600"></span>
              <span className="w-8 h-1 rounded-full bg-stone-500"></span>
            </div>
            <span>100% ⚡</span>
          </div>

          {/* Screen Header */}
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[11px] font-hand font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 rounded">
                {element.badge || 'Screen View'}
              </span>
              <span className="text-xs font-hand text-stone-400 italic">wireframe</span>
            </div>
            <h3 className="font-sketch text-lg font-bold text-[#2b2b2b] mt-1 leading-tight">
              {element.title}
            </h3>
            {element.subtitle && (
              <p className="font-hand text-sm text-stone-600 mt-0.5">{element.subtitle}</p>
            )}
          </div>

          {/* Scribbled App Placeholder Image */}
          <div className="mb-3">
            <WireframeImagePlaceholder className="h-20" />
          </div>

          {/* Wireframe items / controls */}
          <div className="space-y-2 mb-4">
            {element.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 bg-stone-50 border border-dashed border-stone-300 rounded font-hand text-sm text-stone-800"
              >
                <div className="w-3.5 h-3.5 mt-0.5 border border-stone-500 rounded-sm flex items-center justify-center text-[10px]">
                  •
                </div>
                <span className="leading-snug flex-1">{item}</span>
              </div>
            ))}
          </div>

          {/* Smartphone Bottom Navigation Bar */}
          <div className="pt-2 border-t-2 border-stone-300/80 flex justify-around text-xs font-hand text-stone-600">
            <div className="flex flex-col items-center">
              <span className="w-4 h-4 border border-stone-600 rounded-sm flex items-center justify-center text-[10px]">⌂</span>
              <span>Home</span>
            </div>
            <div className="flex flex-col items-center font-bold text-stone-900">
              <span className="w-4 h-4 border-2 border-stone-900 rounded-sm flex items-center justify-center text-[10px]">✦</span>
              <span>Ideas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-4 h-4 border border-stone-600 rounded-sm flex items-center justify-center text-[10px]">☰</span>
              <span>Flow</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-4 h-4 border border-stone-600 rounded-sm flex items-center justify-center text-[10px]">⚙</span>
              <span>Spec</span>
            </div>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="flex justify-center mt-3">
            <div className="w-24 h-1 bg-stone-700 rounded-full" />
          </div>
        </div>
      )}

      {/* BROWSER WINDOW WIREFRAME */}
      {element.type === 'browser-window' && (
        <div className="p-3 min-w-[300px] max-w-[380px]">
          {/* Browser header bar with 3 dots */}
          <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b-2 border-stone-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-stone-600 bg-stone-200"></span>
              <span className="w-2.5 h-2.5 rounded-full border border-stone-600 bg-stone-200"></span>
              <span className="w-2.5 h-2.5 rounded-full border border-stone-600 bg-stone-200"></span>
            </div>
            <div className="flex-1 bg-stone-100 border border-stone-400 rounded px-2 py-0.5 text-xs font-mono-code text-stone-600 truncate">
              https://app.local/{element.title.toLowerCase().replace(/\s+/g, '-')}
            </div>
          </div>

          <div className="mb-2">
            <span className="px-2 py-0.5 text-[10px] font-hand uppercase bg-sky-100 text-sky-900 border border-sky-300 rounded">
              {element.badge || 'Desktop View'}
            </span>
            <h3 className="font-sketch text-lg font-bold text-[#2b2b2b] mt-1">{element.title}</h3>
            {element.subtitle && (
              <p className="font-hand text-xs text-stone-600">{element.subtitle}</p>
            )}
          </div>

          <div className="space-y-1.5 my-3">
            {element.items?.map((item, idx) => (
              <div
                key={idx}
                className="p-2 border border-dashed border-stone-300 rounded bg-stone-50/70 font-hand text-sm text-stone-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STANDARD WIREFRAME CARD */}
      {element.type === 'card' && (
        <div className="p-4 min-w-[240px] max-w-[320px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="px-2 py-0.5 text-xs font-hand font-semibold bg-stone-100 border border-stone-300 rounded">
              {element.badge || 'Wireframe Card'}
            </span>
            <span className="text-xs font-hand text-stone-400">#sketch</span>
          </div>

          <h3 className="font-sketch text-base font-bold text-[#2b2b2b]">{element.title}</h3>
          {element.subtitle && (
            <p className="font-hand text-xs text-stone-600 mb-2">{element.subtitle}</p>
          )}

          <div className="my-2.5 border-t border-dashed border-stone-300 pt-2 space-y-1.5">
            {element.items?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 font-hand text-sm text-stone-700">
                <span className="text-stone-400 select-none">→</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHECKBOX LIST / SPEC CHECKLIST */}
      {element.type === 'checkbox-list' && (
        <div className="p-4 min-w-[260px] max-w-[340px]">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-xs font-hand font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded">
              {element.badge || 'Pencil Spec Checklist'}
            </span>
            <span className="text-xs font-hand text-stone-400">interactive</span>
          </div>

          <h3 className="font-sketch text-base font-bold text-[#2b2b2b] mb-1">{element.title}</h3>

          <div className="space-y-2 mt-3">
            {element.items?.map((item, idx) => {
              const isChecked = checkedItems[idx] ?? item.startsWith('[X]');
              const cleanText = item.replace(/^\[[ Xx]\]\s*/, '');
              return (
                <div
                  key={idx}
                  onClick={(e) => toggleCheck(idx, e)}
                  className="flex items-center gap-2.5 p-1.5 rounded hover:bg-stone-100/80 transition cursor-pointer font-hand text-sm"
                >
                  <div className="w-5 h-5 border-2 border-[#2b2b2b] rounded-sm flex items-center justify-center text-xs font-bold text-emerald-700">
                    {isChecked ? '✓' : ''}
                  </div>
                  <span className={`flex-1 ${isChecked ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                    {cleanText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEARCH BAR WIREFRAME */}
      {element.type === 'search-bar' && (
        <div className="p-3 min-w-[260px] max-w-[320px]">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border-2 border-[#2b2b2b] rounded-full">
            <span className="text-stone-600 font-hand text-base">🔍</span>
            <input
              type="text"
              readOnly
              placeholder={element.placeholder || 'Type query to sketch...'}
              className="w-full bg-transparent font-hand text-sm outline-none text-stone-700 placeholder:text-stone-400"
            />
          </div>
          <div className="mt-2 text-xs font-hand text-stone-500 space-y-1">
            {element.items?.map((item, idx) => (
              <div key={idx} className="truncate">• {item}</div>
            ))}
          </div>
        </div>
      )}

      {/* SKETCH CHART / METRICS */}
      {element.type === 'chart-sketch' && (
        <div className="p-4 min-w-[260px] max-w-[340px]">
          <div className="flex items-center justify-between mb-1">
            <span className="px-2 py-0.5 text-xs font-hand bg-indigo-100 text-indigo-900 border border-indigo-300 rounded">
              {element.badge || 'Graph Sketch'}
            </span>
          </div>
          <h3 className="font-sketch text-base font-bold text-[#2b2b2b]">{element.title}</h3>

          {/* Rough hand-drawn SVG bar graph */}
          <div className="my-3 p-2 bg-stone-50 border border-stone-300 rounded">
            <svg viewBox="0 0 160 70" className="w-full h-16 text-[#2b2b2b]">
              {/* Axes */}
              <line x1="10" y1="5" x2="10" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="60" x2="155" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              {/* Hand-drawn bars with hatching */}
              <rect x="20" y="30" width="20" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <line x1="20" y1="35" x2="40" y2="45" stroke="currentColor" strokeWidth="1" />
              <line x1="20" y1="45" x2="40" y2="55" stroke="currentColor" strokeWidth="1" />

              <rect x="50" y="18" width="20" height="42" fill="rgba(254, 240, 138, 0.4)" stroke="currentColor" strokeWidth="1.8" />
              <rect x="80" y="25" width="20" height="35" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <rect x="110" y="10" width="20" height="50" fill="rgba(186, 230, 253, 0.5)" stroke="currentColor" strokeWidth="1.8" />

              {/* Trend scribble line */}
              <path d="M 30 30 Q 60 14, 90 22 T 120 8" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
          </div>

          <div className="space-y-1 font-hand text-xs text-stone-700">
            {element.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span>⚡</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pencil Annotations (Floating handwritten notes with scribble arrow) */}
      <div className="px-3 pb-3 pt-1 border-t border-stone-200/80 bg-amber-50/40 rounded-b-[24px]">
        <div className="flex items-center justify-between text-[11px] font-sketch font-bold text-amber-900 mb-0.5">
          <div className="flex items-center gap-1">
            <span>✏️ Hand Notes:</span>
            {element.annotations && element.annotations.length > 0 && (
              <span className="text-[10px] font-hand text-stone-500">
                ({element.annotations.length})
              </span>
            )}
          </div>
          {onOpenAnnotation && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAnnotation(element);
              }}
              className="text-[10px] font-hand hover:text-amber-800 text-stone-500 hover:underline flex items-center gap-0.5 transition"
            >
              <Plus className="w-3 h-3" />
              <span>Add Note</span>
            </button>
          )}
        </div>
        {element.annotations && element.annotations.length > 0 ? (
          <div className="space-y-1">
            {element.annotations.map((ann, idx) => (
              <p
                key={idx}
                className="font-hand text-sm text-stone-800 leading-snug tracking-wide"
                style={{ fontFamily: "'Patrick Hand', cursive, sans-serif" }}
              >
                ~ {ann}
              </p>
            ))}
          </div>
        ) : (
          <p
            onClick={(e) => {
              if (onOpenAnnotation) {
                e.stopPropagation();
                onOpenAnnotation(element);
              }
            }}
            className="font-hand text-xs text-stone-400 italic hover:text-stone-600 transition"
          >
            Click to add handwritten annotation...
          </p>
        )}
      </div>
    </div>
  );
};
