import React from 'react';
import { PaperStyle, ToolMode } from '../types';
import {
  MousePointer,
  Pencil,
  Highlighter,
  Eraser,
  StickyNote as StickyIcon,
  LayoutTemplate,
  Grid,
  AlignJustify,
  Dot,
  FileText,
  RotateCcw,
  Download,
  Plus,
  Sparkles,
} from 'lucide-react';

interface Props {
  activeTool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
  paperStyle: PaperStyle;
  onSelectPaper: (style: PaperStyle) => void;
  pencilColor: string;
  onSelectColor: (color: string) => void;
  strokeWidth: number;
  onSelectStrokeWidth: (w: number) => void;
  onAddSticky: (color?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange') => void;
  onAddWireframe: (type: string) => void;
  onUndoDraw: () => void;
  onClearDraw: () => void;
  onExport: () => void;
  onOpenAiPrompts: () => void;
  strokeCount: number;
}

export const NotebookToolbar: React.FC<Props> = ({
  activeTool,
  onSelectTool,
  paperStyle,
  onSelectPaper,
  pencilColor,
  onSelectColor,
  strokeWidth,
  onSelectStrokeWidth,
  onAddSticky,
  onAddWireframe,
  onUndoDraw,
  onClearDraw,
  onExport,
  onOpenAiPrompts,
  strokeCount,
}) => {
  const colors = [
    { label: 'Graphite Pencil', val: '#2b2b2b', bg: 'bg-[#2b2b2b]' },
    { label: 'Blueprint Blue', val: '#1e3a8a', bg: 'bg-[#1e3a8a]' },
    { label: 'Editorial Red', val: '#b91c1c', bg: 'bg-[#b91c1c]' },
    { label: 'Forest Green', val: '#047857', bg: 'bg-[#047857]' },
    { label: 'Marker Yellow', val: 'rgba(250, 204, 21, 0.7)', bg: 'bg-yellow-400' },
    { label: 'Marker Pink', val: 'rgba(244, 114, 182, 0.7)', bg: 'bg-pink-400' },
  ];

  return (
    <div className="bg-[#fffef9] sketch-border sketch-shadow p-2.5 flex flex-wrap items-center justify-between gap-3 text-stone-800 select-none">
      {/* Primary Tool Modes */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-300">
        <button
          onClick={() => onSelectTool('select')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-hand transition ${
            activeTool === 'select'
              ? 'bg-[#2b2b2b] text-[#faf7ee] font-bold shadow-sm'
              : 'hover:bg-stone-200 text-stone-700'
          }`}
          title="Select and rearrange wireframe cards and sticky notes"
        >
          <MousePointer className="w-4 h-4" />
          <span>Select</span>
        </button>

        <button
          onClick={() => onSelectTool('pencil')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-hand transition ${
            activeTool === 'pencil'
              ? 'bg-[#2b2b2b] text-[#faf7ee] font-bold shadow-sm'
              : 'hover:bg-stone-200 text-stone-700'
          }`}
          title="Freehand pencil sketch over the notebook"
        >
          <Pencil className="w-4 h-4" />
          <span>Pencil</span>
        </button>

        <button
          onClick={() => onSelectTool('highlighter')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-hand transition ${
            activeTool === 'highlighter'
              ? 'bg-amber-400 text-amber-950 font-bold shadow-sm'
              : 'hover:bg-stone-200 text-stone-700'
          }`}
          title="Highlighter marker stroke"
        >
          <Highlighter className="w-4 h-4" />
          <span>Highlight</span>
        </button>

        <button
          onClick={() => onSelectTool('eraser')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm font-hand transition ${
            activeTool === 'eraser'
              ? 'bg-rose-700 text-white font-bold shadow-sm'
              : 'hover:bg-stone-200 text-stone-700'
          }`}
          title="Erase pencil strokes"
        >
          <Eraser className="w-4 h-4" />
          <span>Eraser</span>
        </button>
      </div>

      {/* Pencil / Ink Colors */}
      {(activeTool === 'pencil' || activeTool === 'highlighter') && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-50 rounded-lg border border-stone-300">
          <span className="text-xs font-hand text-stone-500 mr-1">Ink:</span>
          {colors.map((c) => (
            <button
              key={c.val}
              onClick={() => onSelectColor(c.val)}
              className={`w-5 h-5 rounded-full ${c.bg} border-2 transition ${
                pencilColor === c.val ? 'border-amber-500 scale-110 shadow-sm' : 'border-transparent'
              }`}
              title={c.label}
            />
          ))}

          <div className="w-[1px] h-4 bg-stone-300 mx-1.5" />

          <span className="text-xs font-hand text-stone-500 mr-1">Stroke:</span>
          {[2, 4, 8].map((w) => (
            <button
              key={w}
              onClick={() => onSelectStrokeWidth(w)}
              className={`px-1.5 py-0.5 text-xs font-mono-code rounded border ${
                strokeWidth === w ? 'bg-stone-800 text-white border-stone-800' : 'bg-white border-stone-300'
              }`}
            >
              {w === 2 ? 'Fine' : w === 4 ? 'Med' : 'Bold'}
            </button>
          ))}

          {strokeCount > 0 && (
            <>
              <div className="w-[1px] h-4 bg-stone-300 mx-1.5" />
              <button
                onClick={onUndoDraw}
                className="p-1 text-xs hover:bg-stone-200 rounded text-stone-600"
                title="Undo last stroke"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClearDraw}
                className="px-2 py-0.5 text-xs font-hand hover:bg-rose-100 text-rose-700 rounded border border-rose-200"
                title="Clear all hand sketches"
              >
                Clear Ink
              </button>
            </>
          )}
        </div>
      )}

      {/* Insert Wireframes & Stickies */}
      <div className="flex items-center gap-1.5">
        {/* Add Wireframe Dropdown / Button */}
        <div className="relative group">
          <button
            className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-400 rounded-lg text-sm font-hand font-bold text-stone-800 transition shadow-sm"
          >
            <LayoutTemplate className="w-4 h-4 text-stone-700" />
            <span>+ Wireframe</span>
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white sketch-border sketch-shadow py-1.5 w-48 z-40">
            <button
              onClick={() => onAddWireframe('mobile-screen')}
              className="w-full text-left px-3 py-1 text-sm font-hand hover:bg-stone-100 flex items-center gap-2"
            >
              <span>📱</span> Mobile App Screen
            </button>
            <button
              onClick={() => onAddWireframe('browser-window')}
              className="w-full text-left px-3 py-1 text-sm font-hand hover:bg-stone-100 flex items-center gap-2"
            >
              <span>💻</span> Browser Window
            </button>
            <button
              onClick={() => onAddWireframe('card')}
              className="w-full text-left px-3 py-1 text-sm font-hand hover:bg-stone-100 flex items-center gap-2"
            >
              <span>🏷️</span> Feature Card
            </button>
            <button
              onClick={() => onAddWireframe('checkbox-list')}
              className="w-full text-left px-3 py-1 text-sm font-hand hover:bg-stone-100 flex items-center gap-2"
            >
              <span>☑️</span> Checklist / Spec
            </button>
            <button
              onClick={() => onAddWireframe('search-bar')}
              className="w-full text-left px-3 py-1 text-sm font-hand hover:bg-stone-100 flex items-center gap-2"
            >
              <span>🔍</span> Search & Filters
            </button>
            <button
              onClick={() => onAddWireframe('chart-sketch')}
              className="w-full text-left px-3 py-1 text-sm font-hand hover:bg-stone-100 flex items-center gap-2"
            >
              <span>📊</span> Metrics & Graph
            </button>
          </div>
        </div>

        {/* Add Sticky Note */}
        <div className="relative group">
          <button
            onClick={() => onAddSticky('yellow')}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-200 hover:bg-amber-300 border border-amber-400 rounded-lg text-sm font-hand font-bold text-amber-950 transition shadow-sm"
          >
            <StickyIcon className="w-4 h-4 text-amber-900" />
            <span>+ Sticky</span>
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex gap-1 p-1 bg-white sketch-border sketch-shadow z-40">
            <button
              onClick={() => onAddSticky('yellow')}
              className="w-6 h-6 rounded bg-[#fef08a] border border-amber-400"
              title="Yellow Note"
            />
            <button
              onClick={() => onAddSticky('pink')}
              className="w-6 h-6 rounded bg-[#fbcfe8] border border-pink-400"
              title="Pink Note"
            />
            <button
              onClick={() => onAddSticky('blue')}
              className="w-6 h-6 rounded bg-[#bae6fd] border border-sky-400"
              title="Blue Note"
            />
            <button
              onClick={() => onAddSticky('green')}
              className="w-6 h-6 rounded bg-[#bbf7d0] border border-emerald-400"
              title="Green Note"
            />
            <button
              onClick={() => onAddSticky('orange')}
              className="w-6 h-6 rounded bg-[#fed7aa] border border-orange-400"
              title="Orange Note"
            />
          </div>
        </div>

        {/* AI Ideator Prompt Trigger */}
        <button
          onClick={onOpenAiPrompts}
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border border-amber-400 rounded-lg text-sm font-sketch font-bold text-amber-950 transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-800" />
          <span>AI Sparks</span>
        </button>
      </div>

      {/* Notebook Paper Selector & Export */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-300">
          <button
            onClick={() => onSelectPaper('grid')}
            className={`p-1.5 rounded transition ${
              paperStyle === 'grid' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Grid / Graph Paper"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectPaper('lined')}
            className={`p-1.5 rounded transition ${
              paperStyle === 'lined' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Ruled Lined Paper"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectPaper('dots')}
            className={`p-1.5 rounded transition ${
              paperStyle === 'dots' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Dot Grid Paper"
          >
            <Dot className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectPaper('blank')}
            className={`p-1.5 rounded transition ${
              paperStyle === 'blank' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Blank Paper"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-900 text-[#faf7ee] rounded-lg text-sm font-hand font-bold transition shadow-sm"
          title="Export / Download Notebook Spec"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
