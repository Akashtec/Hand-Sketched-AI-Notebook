import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Edit3, Trash2 } from 'lucide-react';
import { WireframeElement } from '../types';

interface Props {
  isOpen: boolean;
  element: WireframeElement | null;
  onClose: () => void;
  onSaveAnnotation: (elementId: string, annotationText: string) => void;
  onDeleteAnnotation?: (elementId: string, annotationIndex: number) => void;
}

export const WireframeAnnotationModal: React.FC<Props> = ({
  isOpen,
  element,
  onClose,
  onSaveAnnotation,
  onDeleteAnnotation,
}) => {
  const [annotationText, setAnnotationText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAnnotationText('');
      // Focus textarea on modal open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, element?.id]);

  if (!isOpen || !element) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = annotationText.trim();
    if (!trimmed) return;
    onSaveAnnotation(element.id, trimmed);
    setAnnotationText('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#fefdf8] sketch-border sketch-shadow-lg p-5 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scotch tape accent on top */}
        <div className="scotch-tape -top-3 left-1/2 -translate-x-1/2 -rotate-1 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-300 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-100 border border-amber-300 rounded text-amber-900 text-sm">
              <Edit3 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-sketch text-base font-bold text-stone-900 leading-tight">
                Add Handwritten Note
              </h3>
              <p className="font-hand text-xs text-stone-500 truncate max-w-[240px]">
                Annotating: &ldquo;{element.title}&rdquo;
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing annotations if any */}
        {element.annotations && element.annotations.length > 0 && (
          <div className="mb-3 p-2.5 bg-amber-50/70 border border-dashed border-amber-300/80 rounded">
            <span className="block font-sketch text-[11px] font-bold text-amber-900 mb-1">
              Existing Notes on this Wireframe:
            </span>
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {element.annotations.map((ann, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-1.5 text-stone-700 font-hand text-sm leading-snug group"
                >
                  <span className="flex-1 font-hand text-stone-800">~ {ann}</span>
                  {onDeleteAnnotation && (
                    <button
                      type="button"
                      onClick={() => onDeleteAnnotation(element.id, idx)}
                      className="opacity-60 hover:opacity-100 text-stone-500 hover:text-rose-600 p-0.5 transition shrink-0"
                      title="Remove note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form with Patrick Hand styled textarea */}
        <form onSubmit={handleSubmit}>
          <label className="block font-sketch text-xs font-bold text-stone-700 mb-1">
            Write your pencil annotation:
          </label>
          <div className="relative">
            <textarea
              ref={inputRef}
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder="e.g. Swiping left reveals quick filter options, test with thumb reach..."
              className="w-full p-3 bg-[#fdfbf3] border-2 border-dashed border-stone-400 rounded-lg text-stone-900 placeholder:text-stone-400 font-hand text-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 resize-none leading-snug"
              style={{ fontFamily: "'Patrick Hand', cursive, sans-serif" }}
            />
          </div>

          {/* Quick preset suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2 mb-3">
            <span className="font-sketch text-[10px] text-stone-500">Quick suggestions:</span>
            {[
              'Check thumb reach ergonomics',
              'Needs empty state sketch',
              'Test offline network fallback',
              'Highlight primary action CTA',
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setAnnotationText(suggestion)}
                className="px-2 py-0.5 text-xs bg-stone-100 hover:bg-amber-100 border border-stone-300 rounded font-hand text-stone-700 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Modal Footer / Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-300">
            <span className="text-[11px] font-hand text-stone-500">
              Press <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px]">Ctrl+Enter</kbd> to save
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded font-hand text-stone-600 hover:bg-stone-100 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!annotationText.trim()}
                className="px-4 py-1.5 bg-[#2b2b2b] hover:bg-stone-800 active:bg-black text-[#faf7ee] font-sketch font-bold text-sm rounded transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 text-amber-300" />
                <span>Inscribe Note</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
