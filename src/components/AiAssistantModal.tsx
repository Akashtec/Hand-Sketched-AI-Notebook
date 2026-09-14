import React, { useState } from 'react';
import { Sparkles, X, Lightbulb, AlertTriangle, ShieldCheck, Compass, Wand2, Plus } from 'lucide-react';
import { WireframeElement, StickyNote } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: string;
  onAddAiStickies: (stickies: Partial<StickyNote>[]) => void;
  onAddAiWireframe: (wireframe: Partial<WireframeElement>) => void;
}

export const AiAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTopic,
  onAddAiStickies,
  onAddAiWireframe,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleQuickAction = async (actionType: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai-expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          currentTopic,
          userPrompt: customPrompt,
        }),
      });
      const data = await res.json();

      if (data.stickies) {
        onAddAiStickies(data.stickies);
      } else if (data.newStickies) {
        onAddAiStickies(data.newStickies);
      }

      if (data.element) {
        onAddAiWireframe(data.element);
      } else if (data.newWireframes && data.newWireframes[0]) {
        onAddAiWireframe(data.newWireframes[0]);
      }

      onClose();
    } catch (e) {
      console.error('Failed AI expansion', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#fffef9] sketch-border sketch-shadow-lg p-6 text-stone-900">
        {/* Scotch tape on top */}
        <div className="scotch-tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" />

        <div className="flex items-center justify-between border-b-2 border-stone-300 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 border border-amber-300 rounded text-amber-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-sketch text-xl font-bold text-stone-900">Pencil AI Copilot</h3>
              <p className="font-hand text-xs text-stone-500">
                Brainstorming on: &ldquo;{currentTopic || 'Active Canvas'}&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Spark Actions */}
        <div className="space-y-2 mb-4">
          <p className="font-sketch text-xs font-bold text-stone-600 uppercase tracking-wider">
            Quick Ideation Injections:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickAction('crazy_ideas')}
              disabled={isProcessing}
              className="p-3 text-left bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition group"
            >
              <div className="flex items-center gap-2 font-sketch font-bold text-sm text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Wild Blue-Sky Ideas</span>
              </div>
              <p className="font-hand text-xs text-stone-600 mt-1">
                Drop 2 radical feature sticky notes onto canvas
              </p>
            </button>

            <button
              onClick={() => handleQuickAction('critique')}
              disabled={isProcessing}
              className="p-3 text-left bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition group"
            >
              <div className="flex items-center gap-2 font-sketch font-bold text-sm text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Devil&apos;s Advocate</span>
              </div>
              <p className="font-hand text-xs text-stone-600 mt-1">
                Uncover user friction & critical edge cases
              </p>
            </button>

            <button
              onClick={() => handleQuickAction('expand_wireframe')}
              disabled={isProcessing}
              className="p-3 text-left bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-lg transition group"
            >
              <div className="flex items-center gap-2 font-sketch font-bold text-sm text-sky-900">
                <Compass className="w-4 h-4 text-sky-600" />
                <span>Sub-Screen Wireframe</span>
              </div>
              <p className="font-hand text-xs text-stone-600 mt-1">
                Inscribe a secondary view with detailed controls
              </p>
            </button>

            <button
              onClick={() => handleQuickAction('user_questions')}
              disabled={isProcessing}
              className="p-3 text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition group"
            >
              <div className="flex items-center gap-2 font-sketch font-bold text-sm text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>User Test Checklist</span>
              </div>
              <p className="font-hand text-xs text-stone-600 mt-1">
                Questions to ask users during paper prototype tests
              </p>
            </button>
          </div>
        </div>

        {/* Custom AI Inscription Prompt */}
        <div className="pt-3 border-t border-dashed border-stone-300">
          <label className="block font-sketch text-xs font-bold text-stone-700 mb-1.5">
            Or ask custom notebook instruction:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Sketch a pricing tier table with 3 plans..."
              className="flex-1 px-3 py-2 bg-stone-50 sketch-border text-stone-800 placeholder:text-stone-400 font-hand text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              onClick={() => handleQuickAction('custom_prompt')}
              disabled={!customPrompt.trim() || isProcessing}
              className="px-4 py-2 bg-[#2b2b2b] hover:bg-stone-800 text-[#faf7ee] font-sketch font-bold text-sm rounded transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Inscribe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
