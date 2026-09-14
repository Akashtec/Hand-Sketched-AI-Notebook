import React, { useState } from 'react';
import { Sparkles, Loader2, Compass, Zap } from 'lucide-react';

interface Props {
  onBrainstorm: (topic: string, mode?: string) => void;
  isLoading: boolean;
  currentTopic: string;
}

const PRESET_SPARKS = [
  'Mobile Coffee Loyalty & Pre-order',
  'Neighborhood Tool Sharing App',
  'Offline Distraction-Free Journal',
  'Freelancer Invoice & Time Tracker',
  'Eco-Friendly Habit & Carbon Counter',
];

export const BrainstormPromptBar: React.FC<Props> = ({
  onBrainstorm,
  isLoading,
  currentTopic,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('full_session');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isLoading) return;
    onBrainstorm(topicInput.trim(), selectedMode);
  };

  const handleSparkClick = (spark: string) => {
    setTopicInput(spark);
    onBrainstorm(spark, selectedMode);
  };

  return (
    <div className="p-4 bg-[#fffef9] sketch-border sketch-shadow mb-5">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Pencil Doodle Label */}
        <div className="flex items-center gap-2 text-stone-800 shrink-0">
          <span className="text-xl">✏️</span>
          <div>
            <h2 className="font-sketch text-lg font-bold leading-none">Brainstorm Topic</h2>
            <p className="font-hand text-xs text-stone-500">AI transforms your prompt into low-fidelity sketches</p>
          </div>
        </div>

        {/* Input Field with Hand-Sketched Border */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. A plant care app with friendly watering alerts..."
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-[#fbf9f2] sketch-border-3 text-stone-900 placeholder:text-stone-400 font-hand text-base focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Mode Selector */}
        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          disabled={isLoading}
          className="px-3 py-2 bg-stone-100 sketch-border text-stone-800 font-hand text-sm focus:outline-none cursor-pointer"
        >
          <option value="full_session">Full Notebook Sprint (Wireframes + Stickies + Flow)</option>
          <option value="wireframe_only">Wireframe Layouts Only</option>
          <option value="crazy_ideas">Wild Ideas & Stickies</option>
          <option value="critique">Critique & Risk Assessment</option>
        </select>

        {/* Inscribe / Generate Button */}
        <button
          type="submit"
          disabled={isLoading || !topicInput.trim()}
          className="px-5 py-2.5 bg-[#2b2b2b] hover:bg-stone-800 active:bg-black text-[#faf7ee] sketch-border font-sketch font-bold text-base flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed sketch-shadow-hover"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>Inking...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Inscribe Idea</span>
            </>
          )}
        </button>
      </form>

      {/* Idea Spark Pills */}
      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-dashed border-stone-300 overflow-x-auto text-xs">
        <span className="font-sketch font-bold text-stone-600 shrink-0 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Sparks:</span>
        </span>
        {PRESET_SPARKS.map((spark) => (
          <button
            key={spark}
            type="button"
            onClick={() => handleSparkClick(spark)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 hover:border-amber-400 border border-stone-300 rounded-full font-hand text-stone-700 whitespace-nowrap transition"
          >
            {spark}
          </button>
        ))}
      </div>
    </div>
  );
};
