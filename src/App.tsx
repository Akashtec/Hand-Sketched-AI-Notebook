/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BrainstormSession,
  DrawingStroke,
  PaperStyle,
  ToolMode,
  WireframeElement,
  StickyNote,
} from './types';
import { NotebookToolbar } from './components/NotebookToolbar';
import { BrainstormPromptBar } from './components/BrainstormPromptBar';
import { WireframeElementView } from './components/WireframeElementView';
import { StickyNoteView } from './components/StickyNoteView';
import { FlowStepView } from './components/FlowStepView';
import { SketchCanvas } from './components/SketchCanvas';
import { AiAssistantModal } from './components/AiAssistantModal';
import { WireframeAnnotationModal } from './components/WireframeAnnotationModal';
import {
  PencilArrow,
  PencilScribble,
  PencilLightbulb,
  PencilStar,
  Paperclip,
} from './components/SketchSvgDoodles';
import { Sparkles, BookOpen, Layers, Zap, Download, RefreshCw, PenTool } from 'lucide-react';

const INITIAL_SESSION: BrainstormSession = {
  id: 'session-initial',
  topic: 'Hand-Drawn Brainstorm Notebook',
  summary:
    'Tactile low-fidelity brainstorming environment. Designed for rapid ideation with pencil wireframes, rough stickies, and freehand drawing.',
  corePitch:
    'Think faster by sketching: rough ideas remove fear of perfection, inviting real architectural critique.',
  targetAudience:
    'Designers, product builders, system architects, and creative brainstormers.',
  paperStyle: 'grid',
  wireframes: [
    {
      id: 'wf-1',
      type: 'mobile-screen',
      x: 0,
      y: 0,
      w: 320,
      h: 530,
      title: 'Coffee Roastery & Order Flow',
      subtitle: 'Mobile App Wireframe v1.0',
      badge: 'Main View',
      items: [
        '☕ Today\'s Single Origin brew showcase',
        '⚡ Instant "Bean Subscription" swipe card',
        '📍 Near-me roastery pickup status [Open]',
        '⭐ Loyalty bean punchcard (7 / 10 stamped)',
        '📱 Bottom Navigation: Home, Roast, Stash, Bag',
      ],
      annotations: [
        'Swipe right to claim free pour-over',
        'Haptic pencil vibration on checkout tap',
      ],
      sketchStyle: 'rough',
      rotation: -0.6,
    },
    {
      id: 'wf-2',
      type: 'browser-window',
      x: 0,
      y: 0,
      w: 360,
      h: 300,
      title: 'Roaster Community Dashboard',
      subtitle: 'Desktop portal for batch management',
      badge: 'Portal v1',
      items: [
        '📊 Daily bag production volume: 1,420 bags',
        '🚚 Courier dispatch tracking table',
        '🏷️ Flavor profile editor: [Citrus] [Nutty] [Floral]',
        '🔔 4 wholesale customer requests awaiting approval',
      ],
      annotations: ['Keep typography dense and monospace for drafting'],
      sketchStyle: 'rough',
      rotation: 0.8,
    },
    {
      id: 'wf-3',
      type: 'checkbox-list',
      x: 0,
      y: 0,
      w: 310,
      h: 240,
      title: 'Roastery Launch Spec',
      subtitle: 'Validation checklist',
      badge: 'Sprint 01',
      items: [
        '[X] Test offline cart caching in cafe basement',
        '[X] Verify QR pickup code scanning contrast',
        '[ ] Collect barista feedback on order dispatch speed',
        '[ ] Sketch alternative dark-mode packaging card',
      ],
      annotations: ['Tap checkbox to mark complete!'],
      sketchStyle: 'rough',
      rotation: -0.8,
    },
    {
      id: 'wf-4',
      type: 'chart-sketch',
      x: 0,
      y: 0,
      w: 320,
      h: 260,
      title: 'Repeat Order Cohort',
      subtitle: 'Weekly customer habit retention',
      badge: 'Metric Sketch',
      items: [
        'Retention spike at 3rd purchase (+38%)',
        'Target: 4.2 orders per member monthly',
      ],
      annotations: ['Rough pencil trendline overlay'],
      sketchStyle: 'rough',
      rotation: 0.6,
    },
  ],
  stickies: [
    {
      id: 'st-1',
      x: 0,
      y: 0,
      w: 240,
      h: 160,
      text: '💡 Core Insight: Most users order the exact same coffee every weekday morning. The "Reorder Last Cup" widget should be 1-tap from lockscreen!',
      category: 'idea',
      color: 'yellow',
      rotation: -1.8,
    },
    {
      id: 'st-2',
      x: 0,
      y: 0,
      w: 240,
      h: 160,
      text: '❓ Key Friction: What if the beans are out of stock right as they order? Offer automatic roast substitute with a discount scribble.',
      category: 'question',
      color: 'blue',
      rotation: 1.4,
    },
    {
      id: 'st-3',
      x: 0,
      y: 0,
      w: 240,
      h: 160,
      text: '⚡ Wild Idea: "Coffee Roulette" — let the head roaster pick a surprise bag each month with custom hand-written tasting notes!',
      category: 'wild',
      color: 'pink',
      rotation: -1.2,
    },
    {
      id: 'st-4',
      x: 0,
      y: 0,
      w: 240,
      h: 160,
      text: '⚠️ Risk: Do not over-gamify points — coffee lovers value craft, provenance, and freshness over cheap coupons.',
      category: 'risk',
      color: 'green',
      rotation: 2.1,
    },
  ],
  flowSteps: [
    {
      id: 'flow-1',
      title: '1. Morning Awakening',
      detail: 'Push notification: "Your morning Ethiopian roast is ready for 8:15 AM pickup."',
      wireframeSnippet: 'Lockscreen Widget',
      arrowLabel: '1-Tap Order',
    },
    {
      id: 'flow-2',
      title: '2. Roastery Arrival',
      detail: 'Geofence detects arrival; order counter displays customer sketch avatar.',
      wireframeSnippet: 'Barista Tablet View',
      arrowLabel: 'Proximity Ping',
    },
    {
      id: 'flow-3',
      title: '3. Hand-off & Stamp',
      detail: 'Barista hands cup; digital punchcard animates with rough pencil stamp.',
      wireframeSnippet: 'Mobile Stamp Card',
      arrowLabel: 'Reward Logged',
    },
    {
      id: 'flow-4',
      title: '4. Tasting Feedback',
      detail: 'Quick 2-second rate: "Nutty, bright, or too dark?" directly shapes next roast profile.',
      wireframeSnippet: 'Feedback Dial',
      arrowLabel: 'Loop Complete',
    },
  ],
  pencilNotes: [
    '"Rough sketches invite conversation; polished mockups invite critique." — Bill Buxton',
    'Rule of thumb: Spend 10 minutes on paper before spending 10 hours in code.',
    'Switch to [Pencil] or [Highlight] in the toolbar to draw freely anywhere on the page!',
  ],
  suggestedPrompts: [
    'Add a loyalty rewards wireframe',
    'Generate 4 user interview questions',
    'Design an offline backup screen',
    'Critique this flow from a busy morning commuter perspective',
  ],
};

export default function App() {
  const [session, setSession] = useState<BrainstormSession>(INITIAL_SESSION);
  const [drawingStrokes, setDrawingStrokes] = useState<DrawingStroke[]>([]);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('grid');
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [pencilColor, setPencilColor] = useState<string>('#2b2b2b');
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [annotatingElement, setAnnotatingElement] = useState<WireframeElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'wireframes' | 'stickies' | 'flow' | 'doodle'>('all');

  // Request new AI brainstorm session
  const handleBrainstorm = async (topic: string, mode = 'full_session') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          mode,
          currentSession: session,
        }),
      });

      if (!response.ok) {
        throw new Error('Brainstorm request failed');
      }

      const data: BrainstormSession = await response.json();
      setSession(data);
      if (data.paperStyle) {
        setPaperStyle(data.paperStyle);
      }
    } catch (err) {
      console.error('Error generating brainstorm:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new empty sticky note
  const handleAddSticky = (color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' = 'yellow') => {
    const newNote: StickyNote = {
      id: 'st-user-' + Date.now(),
      x: 0,
      y: 0,
      w: 240,
      h: 160,
      text: '✏️ New brainstorm note... Tap to edit!',
      category: 'idea',
      color,
      rotation: (Math.random() * 4 - 2),
    };
    setSession((prev) => ({
      ...prev,
      stickies: [newNote, ...prev.stickies],
    }));
  };

  // Add a wireframe component
  const handleAddWireframe = (typeStr: string) => {
    const type = typeStr as WireframeElement['type'];
    const newWf: WireframeElement = {
      id: 'wf-user-' + Date.now(),
      type,
      x: 0,
      y: 0,
      w: type === 'mobile-screen' ? 320 : 340,
      h: type === 'mobile-screen' ? 520 : 260,
      title: `New ${type.replace('-', ' ').toUpperCase()} Sketch`,
      subtitle: 'Drafted in notebook',
      badge: 'Draft v1',
      items: [
        'Component item 1',
        'Interactive button [Tap here]',
        'Pencil sketched data item',
      ],
      annotations: ['Hand-drawn spec note'],
      sketchStyle: 'rough',
      rotation: (Math.random() * 2 - 1),
    };

    setSession((prev) => ({
      ...prev,
      wireframes: [newWf, ...prev.wireframes],
    }));
  };

  // AI Expand single wireframe element
  const handleExpandWireframeAi = async (element: WireframeElement) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'expand_wireframe',
          currentTopic: session.topic,
          targetElement: element,
        }),
      });
      const data = await res.json();
      if (data.element) {
        setSession((prev) => ({
          ...prev,
          wireframes: [data.element, ...prev.wireframes],
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Add handwritten annotation to wireframe element
  const handleSaveAnnotation = (elementId: string, annotationText: string) => {
    setSession((prev) => ({
      ...prev,
      wireframes: prev.wireframes.map((wf) => {
        if (wf.id === elementId) {
          return {
            ...wf,
            annotations: [...(wf.annotations || []), annotationText],
          };
        }
        return wf;
      }),
    }));
  };

  // Delete annotation from wireframe element
  const handleDeleteAnnotation = (elementId: string, annotationIndex: number) => {
    setSession((prev) => ({
      ...prev,
      wireframes: prev.wireframes.map((wf) => {
        if (wf.id === elementId && wf.annotations) {
          return {
            ...wf,
            annotations: wf.annotations.filter((_, idx) => idx !== annotationIndex),
          };
        }
        return wf;
      }),
    }));
  };

  // Export session spec or print view
  const handleExport = () => {
    const jsonContent = JSON.stringify(session, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-notebook-spec.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Background pattern class based on paperStyle
  const getPaperBgClass = () => {
    switch (paperStyle) {
      case 'grid':
        return 'notebook-grid';
      case 'lined':
        return 'notebook-lined';
      case 'dots':
        return 'notebook-dots';
      case 'blank':
        return 'notebook-blank';
      default:
        return 'notebook-grid';
    }
  };

  return (
    <div className="min-h-screen bg-[#ede8d8] p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col font-hand">
      {/* Outer Notebook Desk Frame */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Notebook Cover Edge / Spiral Ring Header */}
        <div className="relative bg-[#3b3a36] text-[#f7f4ea] rounded-t-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t-4 border-l-4 border-r-4 border-[#2b2b29] shadow-xl">
          {/* Metal Spiral Rings (Visual repeat) */}
          <div className="absolute -top-3 left-6 right-6 flex justify-between pointer-events-none overflow-hidden h-6">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-5 rounded-full bg-gradient-to-r from-stone-400 via-stone-200 to-stone-600 border border-stone-800 shadow-sm transform -rotate-12"
              />
            ))}
          </div>

          {/* Notebook Branding & Volume Info */}
          <div className="flex items-center gap-3 mt-1">
            <div className="p-2 bg-[#2b2b29] border border-stone-600 rounded-lg text-amber-300">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sketch text-xl md:text-2xl font-bold tracking-wide text-[#faf7ee]">
                  SketchBrain AI
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono-code uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded">
                  Graphite & Wireframe Pad
                </span>
              </div>
              <p className="font-hand text-xs text-stone-300">
                Low-fidelity AI brainstorming notebook with tactile pencil drawings & UI wireframes
              </p>
            </div>
          </div>

          {/* Quick Page Info & Mode status */}
          <div className="flex items-center gap-3 text-xs font-hand text-stone-300">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2b2b29] rounded border border-stone-700">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Vol. 01 • Page 42</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-[#2b2b29] rounded border border-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini Brainstorming Active</span>
            </div>
          </div>
        </div>

        {/* The Open Notebook Page */}
        <div
          className={`relative flex-1 border-4 border-[#2b2b29] shadow-2xl transition-colors duration-200 ${getPaperBgClass()} p-4 sm:p-6 md:p-8 lg:p-10 rounded-b-2xl`}
        >
          {/* Notebook Red Margin Line (traditional notebook feel) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-16 w-[2px] bg-rose-300/70 pointer-events-none" />

          {/* Spiral Bind Hole Indicators along left margin */}
          <div className="hidden md:flex flex-col justify-between absolute top-12 bottom-12 left-5 w-4 pointer-events-none opacity-40">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-stone-400/40 border border-stone-600/30" />
            ))}
          </div>

          {/* Freehand Drawing Canvas (Positioned absolute over the notebook page) */}
          <SketchCanvas
            isDrawingEnabled={activeTool === 'pencil' || activeTool === 'highlighter' || activeTool === 'eraser'}
            activeTool={activeTool === 'highlighter' ? 'highlighter' : activeTool === 'eraser' ? 'eraser' : 'pencil'}
            activeColor={pencilColor}
            strokeWidth={strokeWidth}
            strokes={drawingStrokes}
            onStrokesChange={setDrawingStrokes}
          />

          {/* Notebook Top Controls */}
          <div className="relative z-20 space-y-4 mb-6">
            {/* Brainstorm Prompt Bar */}
            <BrainstormPromptBar
              onBrainstorm={handleBrainstorm}
              isLoading={isLoading}
              currentTopic={session.topic}
            />

            {/* Notebook Toolbar (Pencil, Highlighter, Paper Style, Add Wireframe, Add Sticky) */}
            <NotebookToolbar
              activeTool={activeTool}
              onSelectTool={setActiveTool}
              paperStyle={paperStyle}
              onSelectPaper={setPaperStyle}
              pencilColor={pencilColor}
              onSelectColor={setPencilColor}
              strokeWidth={strokeWidth}
              onSelectStrokeWidth={setStrokeWidth}
              onAddSticky={handleAddSticky}
              onAddWireframe={handleAddWireframe}
              onUndoDraw={() => setDrawingStrokes((prev) => prev.slice(0, -1))}
              onClearDraw={() => setDrawingStrokes([])}
              onExport={handleExport}
              onOpenAiPrompts={() => setIsAiModalOpen(true)}
              strokeCount={drawingStrokes.length}
            />
          </div>

          {/* Active Drawing Banner if in Draw Mode */}
          {(activeTool === 'pencil' || activeTool === 'highlighter' || activeTool === 'eraser') && (
            <div className="relative z-20 mb-4 p-2.5 bg-amber-100 border-2 border-amber-400 rounded-lg flex items-center justify-between text-xs font-hand text-amber-950 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">✏️</span>
                <span>
                  <strong>Draw Mode Active:</strong> Click and drag anywhere across the page to sketch with{' '}
                  {activeTool === 'pencil' ? 'graphite pencil' : activeTool === 'highlighter' ? 'highlighter marker' : 'eraser'}.
                </span>
              </div>
              <button
                onClick={() => setActiveTool('select')}
                className="px-3 py-1 bg-amber-900 text-white rounded font-sketch font-bold text-xs hover:bg-black transition"
              >
                Done Drawing (Switch to Select)
              </button>
            </div>
          )}

          {/* Notebook Page Header / Topic Title Card */}
          <div className="relative z-20 bg-[#fffef9] sketch-border sketch-shadow p-5 mb-8">
            <div className="scotch-tape -top-2.5 right-10 rotate-2" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-stone-200 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-sketch font-bold bg-[#2b2b29] text-[#faf7ee] rounded">
                    Active Brainstorm
                  </span>
                  <span className="font-hand text-xs text-stone-500">
                    Drafted: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="font-sketch text-2xl md:text-3xl font-bold text-[#2b2b2b] mt-1">
                  {session.topic}
                </h2>
              </div>

              {/* View Tabs Filter */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-300 text-xs font-hand">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded transition ${
                    activeTab === 'all' ? 'bg-[#2b2b2b] text-[#faf7ee] font-bold shadow-xs' : 'text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All Elements
                </button>
                <button
                  onClick={() => setActiveTab('wireframes')}
                  className={`px-3 py-1 rounded transition ${
                    activeTab === 'wireframes' ? 'bg-[#2b2b2b] text-[#faf7ee] font-bold shadow-xs' : 'text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  📱 Wireframes ({session.wireframes.length})
                </button>
                <button
                  onClick={() => setActiveTab('stickies')}
                  className={`px-3 py-1 rounded transition ${
                    activeTab === 'stickies' ? 'bg-[#2b2b2b] text-[#faf7ee] font-bold shadow-xs' : 'text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  💡 Stickies ({session.stickies.length})
                </button>
                <button
                  onClick={() => setActiveTab('flow')}
                  className={`px-3 py-1 rounded transition ${
                    activeTab === 'flow' ? 'bg-[#2b2b2b] text-[#faf7ee] font-bold shadow-xs' : 'text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  🗺️ User Flow ({session.flowSteps.length})
                </button>
              </div>
            </div>

            {/* Core Pitch & Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-stone-800">
              <div className="md:col-span-2">
                <h4 className="font-sketch text-xs font-bold text-stone-500 uppercase">Summary & Core Pitch</h4>
                <p className="font-hand text-base text-stone-800 mt-0.5 leading-snug">
                  {session.corePitch || session.summary}
                </p>
              </div>
              <div className="border-l-0 md:border-l-2 border-dashed border-stone-200 pl-0 md:pl-4">
                <h4 className="font-sketch text-xs font-bold text-stone-500 uppercase">Target Audience</h4>
                <p className="font-hand text-sm text-stone-700 mt-0.5">
                  {session.targetAudience}
                </p>
              </div>
            </div>
          </div>

          {/* USER FLOW STEPS (If activeTab is all or flow) */}
          {(activeTab === 'all' || activeTab === 'flow') && session.flowSteps.length > 0 && (
            <div className="relative z-20">
              <FlowStepView steps={session.flowSteps} />
            </div>
          )}

          {/* MAIN WIREFRAME STAGE */}
          {(activeTab === 'all' || activeTab === 'wireframes') && (
            <div className="relative z-20 mb-8">
              <div className="flex items-center justify-between mb-4 border-b-2 border-stone-300/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  <h3 className="font-sketch text-xl font-bold text-[#2b2b2b]">
                    Pencil-Style Wireframes & Layouts
                  </h3>
                </div>
                <span className="text-xs font-hand text-stone-500">
                  Click any element to inspect or expand with AI
                </span>
              </div>

              {session.wireframes.length === 0 ? (
                <div className="p-8 text-center bg-white/60 sketch-border-2 text-stone-500">
                  <p className="font-sketch text-lg">No wireframe sketches yet.</p>
                  <p className="font-hand text-sm mt-1">
                    Click &ldquo;+ Wireframe&rdquo; above or ask AI to generate an MVP screen!
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap items-start gap-6">
                  {session.wireframes.map((wf) => (
                    <WireframeElementView
                      key={wf.id}
                      element={wf}
                      isSelected={selectedElementId === wf.id}
                      onSelect={() => setSelectedElementId(wf.id)}
                      onOpenAnnotation={(el) => setAnnotatingElement(el)}
                      onUpdate={(updated) =>
                        setSession((prev) => ({
                          ...prev,
                          wireframes: prev.wireframes.map((w) => (w.id === updated.id ? updated : w)),
                        }))
                      }
                      onDelete={() =>
                        setSession((prev) => ({
                          ...prev,
                          wireframes: prev.wireframes.filter((w) => w.id !== wf.id),
                        }))
                      }
                      onExpandAi={handleExpandWireframeAi}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STICKY NOTES BRAINSTORM BOARD */}
          {(activeTab === 'all' || activeTab === 'stickies') && (
            <div className="relative z-20 mb-8">
              <div className="flex items-center justify-between mb-4 border-b-2 border-stone-300/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <h3 className="font-sketch text-xl font-bold text-[#2b2b2b]">
                    Brainstorm Sticky Notes & Questions
                  </h3>
                </div>
                <span className="text-xs font-hand text-stone-500">
                  Ideas, questions, risks, and blue-sky features
                </span>
              </div>

              {session.stickies.length === 0 ? (
                <div className="p-8 text-center bg-white/60 sketch-border-2 text-stone-500">
                  <p className="font-sketch text-lg">No sticky notes currently pinned.</p>
                  <p className="font-hand text-sm mt-1">
                    Click &ldquo;+ Sticky&rdquo; to add your own thoughts or click &ldquo;AI Sparks&rdquo;!
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap items-start gap-5">
                  {session.stickies.map((note) => (
                    <StickyNoteView
                      key={note.id}
                      note={note}
                      onUpdate={(updated) =>
                        setSession((prev) => ({
                          ...prev,
                          stickies: prev.stickies.map((n) => (n.id === updated.id ? updated : n)),
                        }))
                      }
                      onDelete={() =>
                        setSession((prev) => ({
                          ...prev,
                          stickies: prev.stickies.filter((n) => n.id !== note.id),
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MARGIN PENCIL SCRIBBLER & DESIGNER THOUGHTS */}
          {session.pencilNotes && session.pencilNotes.length > 0 && (
            <div className="relative z-20 mt-8 p-4 bg-amber-50/70 sketch-dashed text-stone-800">
              <div className="flex items-center gap-2 mb-2 font-sketch font-bold text-sm text-stone-700">
                <span>✏️ Architect&apos;s Margin Scribbles:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {session.pencilNotes.map((pnote, idx) => (
                  <div key={idx} className="font-caveat text-lg leading-snug text-stone-700 italic">
                    ~ {pnote}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUGGESTED NEXT AI INSPIRATIONS */}
          {session.suggestedPrompts && session.suggestedPrompts.length > 0 && (
            <div className="relative z-20 mt-6 pt-4 border-t border-dashed border-stone-300 flex flex-wrap items-center gap-2">
              <span className="font-sketch text-xs font-bold text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Next Sketch Sparks:</span>
              </span>
              {session.suggestedPrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBrainstorm(`${session.topic}: ${sp}`)}
                  className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded-full font-hand text-xs text-stone-700 transition hover:border-stone-500"
                >
                  &ldquo;{sp}&rdquo;
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Ideator / Copilot Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentTopic={session.topic}
        onAddAiStickies={(newNotes) => {
          const formatted = newNotes.map((n, idx) => ({
            id: 'st-ai-' + Date.now() + '-' + idx,
            x: 0,
            y: 0,
            w: 240,
            h: 160,
            text: n.text || 'AI Brainstorm Note',
            category: n.category || 'idea',
            color: n.color || 'yellow',
            rotation: (Math.random() * 4 - 2),
          }));
          setSession((prev) => ({
            ...prev,
            stickies: [...formatted, ...prev.stickies],
          }));
        }}
        onAddAiWireframe={(newWf) => {
          const formatted: WireframeElement = {
            id: 'wf-ai-' + Date.now(),
            type: newWf.type || 'card',
            x: 0,
            y: 0,
            w: 320,
            h: 280,
            title: newWf.title || 'AI Generated Wireframe',
            subtitle: newWf.subtitle || '',
            badge: newWf.badge || 'AI Spark',
            items: newWf.items || [],
            annotations: newWf.annotations || [],
            sketchStyle: 'rough',
            rotation: (Math.random() * 2 - 1),
          };
          setSession((prev) => ({
            ...prev,
            wireframes: [formatted, ...prev.wireframes],
          }));
        }}
      />

      {/* Wireframe Handwritten Annotation Modal */}
      <WireframeAnnotationModal
        isOpen={Boolean(annotatingElement)}
        element={
          annotatingElement
            ? session.wireframes.find((wf) => wf.id === annotatingElement.id) || annotatingElement
            : null
        }
        onClose={() => setAnnotatingElement(null)}
        onSaveAnnotation={handleSaveAnnotation}
        onDeleteAnnotation={handleDeleteAnnotation}
      />
    </div>
  );
}
