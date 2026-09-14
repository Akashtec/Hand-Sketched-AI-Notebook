import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for realistic hand-sketched brainstorming sessions
function generateFallbackSession(topic: string) {
  const cleanTopic = topic.trim() || 'New Product Idea';
  return {
    id: 'session-' + Date.now(),
    topic: cleanTopic,
    summary: `Hand-sketched wireframe & ideation breakdown for "${cleanTopic}". Outlining core screens, interaction flow, and critical product stickies.`,
    corePitch: `A focused, delightful solution for ${cleanTopic} with tactile simplicity and intuitive micro-flows.`,
    targetAudience: 'Early adopters, creative brainstormers, and product builders seeking high-velocity clarity.',
    wireframes: [
      {
        id: 'wf-1',
        type: 'mobile-screen',
        x: 40,
        y: 40,
        w: 320,
        h: 520,
        title: `${cleanTopic} - Main App Screen`,
        subtitle: 'Primary user feed & quick actions',
        badge: 'MVP Screen 01',
        items: [
          '⚡ Top summary banner with live status',
          '🔍 Hand-drawn search bar with instant filter tag',
          '📋 Actionable priority card stack',
          '➕ Pencil sketch FAB for instant creation',
          '📱 Bottom nav: Home, Brainstorm, Library, Profile',
        ],
        annotations: [
          'Swipe left on card to reveal sketch notes',
          'Haptic pencil buzz on tap',
          'Offline-first cache indicator',
        ],
        sketchStyle: 'rough',
        rotation: -0.8,
      },
      {
        id: 'wf-2',
        type: 'card',
        x: 390,
        y: 40,
        w: 290,
        h: 240,
        title: 'Quick Ideation Widget',
        subtitle: 'Scratchpad component',
        badge: 'Component A',
        items: [
          '✏️ Freehand scribble thumbnail',
          '🏷️ Category: Core Hypothesis',
          '⭐ Priority score: 9.4 / 10',
          '💬 3 peer annotations pending',
        ],
        annotations: ['Double-tap to open full canvas view'],
        sketchStyle: 'rough',
        rotation: 1.2,
      },
      {
        id: 'wf-3',
        type: 'search-bar',
        x: 390,
        y: 310,
        w: 290,
        h: 180,
        title: 'Smart Doodle Search & Tagging',
        placeholder: 'Search sketches, tags, or concepts...',
        badge: 'Filter Bar',
        items: [
          'Tags: #wireframe #v1 #hypothesis #mobile',
          'Sort: [Recently Inked ▼]',
          'Status: [Draft] [Approved] [Scrapped]',
        ],
        annotations: ['Type "/" for instant command palette'],
        sketchStyle: 'rough',
        rotation: -1.0,
      },
      {
        id: 'wf-4',
        type: 'chart-sketch',
        x: 710,
        y: 40,
        w: 320,
        h: 270,
        title: 'Growth / Retention Wireframe Graph',
        subtitle: 'Rough weekly active loop projection',
        badge: 'Metric Sketch',
        items: [
          '📈 Week 1: Onboarding scribble delight (68%)',
          '📊 Week 4: Habit loop & export usage (42%)',
          '🎯 Target: 3 brainstorms logged per user/week',
        ],
        annotations: ['Visualized as rough hand-drawn bar chart'],
        sketchStyle: 'rough',
        rotation: 0.7,
      },
      {
        id: 'wf-5',
        type: 'checkbox-list',
        x: 710,
        y: 330,
        w: 320,
        h: 230,
        title: 'MVP Launch Checklist',
        subtitle: 'Things to validate before code',
        badge: 'Pencil Checklist',
        items: [
          '[X] Interview 5 target users with paper prototype',
          '[X] Test wireframe navigation readability',
          '[ ] Clarify primary conversion funnel',
          '[ ] Polish tactile haptic feedback & sound cues',
        ],
        annotations: ['Cross out with rough pencil strike when done!'],
        sketchStyle: 'rough',
        rotation: -0.5,
      },
    ],
    stickies: [
      {
        id: 'st-1',
        x: 40,
        y: 590,
        w: 220,
        h: 170,
        text: '💡 Wild Idea: What if the wireframe can automatically simulate realistic user gestures when previewed?',
        category: 'wild',
        color: 'yellow',
        rotation: -2.5,
      },
      {
        id: 'st-2',
        x: 290,
        y: 590,
        w: 220,
        h: 170,
        text: '❓ Key Question: How do users invite a collaborator into an active paper brainstorm without friction?',
        category: 'question',
        color: 'blue',
        rotation: 1.8,
      },
      {
        id: 'st-3',
        x: 540,
        y: 590,
        w: 220,
        h: 170,
        text: '🚀 Killer Feature: Export directly as rough hand-drawn SVG or printable PDF napkin sketch!',
        category: 'feature',
        color: 'pink',
        rotation: -1.2,
      },
      {
        id: 'st-4',
        x: 790,
        y: 590,
        w: 220,
        h: 170,
        text: '⚠️ Critical Risk: Avoid cluttering the screen with too many toggles — keep the sketch aesthetic calm & unhurried.',
        category: 'risk',
        color: 'green',
        rotation: 2.1,
      },
    ],
    flowSteps: [
      {
        id: 'flow-1',
        title: '1. Discovery & Spark',
        detail: 'User lands on fresh lined notebook paper. Prompts AI or rough-scribbles a single sentence idea.',
        wireframeSnippet: 'Blank Notebook Page -> Spark Dialog Box',
        arrowLabel: 'Pencil Scribble',
      },
      {
        id: 'flow-2',
        title: '2. Wireframe Assembly',
        detail: 'AI lays out wireframe screens, rough buttons, and sticky notes like an architect spreading tracing paper.',
        wireframeSnippet: 'Mobile Wireframe + Sticky Board',
        arrowLabel: 'Auto-Arranged',
      },
      {
        id: 'flow-3',
        title: '3. Sketch & Critique',
        detail: 'User doodles freehand pencil lines, adds arrows, asks for edge cases, and drags wireframes into user journeys.',
        wireframeSnippet: 'Active Canvas + Annotation Badges',
        arrowLabel: 'Iterate',
      },
      {
        id: 'flow-4',
        title: '4. Blueprint Export',
        detail: 'Export polished sketch deck or share notebook link to team standup.',
        wireframeSnippet: 'Exported Hand-Drawn Spec Sheet',
        arrowLabel: 'Ship Idea',
      },
    ],
    pencilNotes: [
      'Remember: "If it looks finished, people critique the font. If it looks sketched, they critique the idea."',
      'Keep wireframes low-fidelity to encourage fearless iteration.',
      'Margin scribble: Add quick shortcut keys [P]encil, [H]ighlight, [E]raser.',
    ],
    suggestedPrompts: [
      'Add a checkout & payment flow wireframe',
      'Generate 4 wild blue-sky feature ideas',
      'Critique this flow from a first-time user perspective',
      'Design an empty state screen with a friendly hand-drawn mascot',
    ],
    paperStyle: 'grid',
  };
}

// API: Health check
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({ status: 'ok', hasGeminiKey: hasKey });
});

// API: Generate Brainstorm Session using Gemini
app.post('/api/brainstorm', async (req, res) => {
  const { topic, mode = 'full_session', userInstructions, currentSession } = req.body;

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    console.log('No GEMINI_API_KEY set or using placeholder, returning rich fallback session');
    return res.json(generateFallbackSession(topic));
  }

  try {
    const promptText = `
You are an expert design thinker, architect, and product strategist who sketches on paper notebooks.
The user is brainstorming the following idea/problem:
"${topic.trim()}"

${userInstructions ? `User specific instructions: "${userInstructions}"` : ''}
${currentSession ? `Current session context: Topic: ${currentSession.topic || topic}` : ''}
Mode: ${mode}

Generate an authentic, highly detailed, hand-sketched wireframe brainstorming session.
Wireframe elements must represent genuine rough UI components (e.g. mobile-screen, browser-window, card, button, input, search-bar, checkbox-list, chart-sketch, metric, avatar-profile) with realistic titles, hand-drawn annotations, badges, and practical UX steps.
Stickies must include insightful product ideas, critical questions, blue-sky wild thinking, and potential risks.
Flow steps should represent a realistic user journey step-by-step.
Pencil notes should be handwritten designer thoughts or golden rules.

Produce structured JSON matching this schema:
{
  "topic": string,
  "summary": string,
  "corePitch": string,
  "targetAudience": string,
  "paperStyle": "grid" | "lined" | "dots" | "blank",
  "wireframes": [
    {
      "id": string,
      "type": "mobile-screen" | "browser-window" | "card" | "button" | "input" | "search-bar" | "checkbox-list" | "chart-sketch" | "metric",
      "x": number (40 to 1100),
      "y": number (40 to 900),
      "w": number (200 to 360),
      "h": number (140 to 520),
      "title": string,
      "subtitle": string,
      "badge": string,
      "items": string[] (3-6 bullet points of UI controls, buttons, or wireframe sections),
      "annotations": string[] (1-3 pencil annotations like "Tap here", "Swipe down to refresh", "Pencil note"),
      "sketchStyle": "rough" | "clean" | "draft",
      "rotation": number (-2.5 to 2.5)
    }
  ],
  "stickies": [
    {
      "id": string,
      "x": number,
      "y": number,
      "w": number (200 to 240),
      "h": number (150 to 190),
      "text": string (rich, thoughtful brainstorm sticky content),
      "category": "idea" | "question" | "feature" | "wild" | "risk",
      "color": "yellow" | "pink" | "blue" | "green" | "orange",
      "rotation": number (-3 to 3)
    }
  ],
  "flowSteps": [
    {
      "id": string,
      "title": string,
      "detail": string,
      "wireframeSnippet": string,
      "arrowLabel": string
    }
  ],
  "pencilNotes": string[],
  "suggestedPrompts": string[]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are a master product designer and sketchbook architect. You create high-impact, practical, low-fidelity wireframe diagrams, brainstorm sticky notes, and thoughtful design flows. Always return valid, well-structured JSON.',
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      return res.json(generateFallbackSession(topic));
    }

    // Ensure IDs and valid properties
    const session = {
      id: 'session-' + Date.now(),
      topic: parsedData.topic || topic,
      summary: parsedData.summary || `Hand-sketched brainstorming session for ${topic}`,
      corePitch: parsedData.corePitch || `Core concept for ${topic}`,
      targetAudience: parsedData.targetAudience || 'Target audience and primary users',
      paperStyle: parsedData.paperStyle || 'grid',
      wireframes: Array.isArray(parsedData.wireframes) ? parsedData.wireframes.map((wf: any, idx: number) => ({
        id: wf.id || `wf-${Date.now()}-${idx}`,
        type: wf.type || 'card',
        x: typeof wf.x === 'number' ? wf.x : 40 + (idx % 3) * 350,
        y: typeof wf.y === 'number' ? wf.y : 40 + Math.floor(idx / 3) * 320,
        w: typeof wf.w === 'number' ? wf.w : 300,
        h: typeof wf.h === 'number' ? wf.h : 260,
        title: wf.title || `Wireframe Element ${idx + 1}`,
        subtitle: wf.subtitle || '',
        badge: wf.badge || 'Draft',
        items: Array.isArray(wf.items) ? wf.items : [],
        annotations: Array.isArray(wf.annotations) ? wf.annotations : [],
        sketchStyle: wf.sketchStyle || 'rough',
        rotation: typeof wf.rotation === 'number' ? wf.rotation : (Math.random() * 3 - 1.5),
      })) : [],
      stickies: Array.isArray(parsedData.stickies) ? parsedData.stickies.map((st: any, idx: number) => ({
        id: st.id || `st-${Date.now()}-${idx}`,
        x: typeof st.x === 'number' ? st.x : 40 + (idx % 4) * 260,
        y: typeof st.y === 'number' ? st.y : 600 + Math.floor(idx / 4) * 200,
        w: typeof st.w === 'number' ? st.w : 220,
        h: typeof st.h === 'number' ? st.h : 170,
        text: st.text || 'Brainstorm note',
        category: st.category || 'idea',
        color: st.color || ['yellow', 'pink', 'blue', 'green', 'orange'][idx % 5],
        rotation: typeof st.rotation === 'number' ? st.rotation : (Math.random() * 4 - 2),
      })) : [],
      flowSteps: Array.isArray(parsedData.flowSteps) ? parsedData.flowSteps.map((fs: any, idx: number) => ({
        id: fs.id || `flow-${idx + 1}`,
        title: fs.title || `Step ${idx + 1}`,
        detail: fs.detail || '',
        wireframeSnippet: fs.wireframeSnippet || '',
        arrowLabel: fs.arrowLabel || 'Next',
      })) : [],
      pencilNotes: Array.isArray(parsedData.pencilNotes) ? parsedData.pencilNotes : [],
      suggestedPrompts: Array.isArray(parsedData.suggestedPrompts) ? parsedData.suggestedPrompts : [
        'Add a wireframe for settings & profile',
        'Generate 3 alternative monetizations',
        'Sketch a first-time user onboarding tour',
      ],
    };

    return res.json(session);
  } catch (err: any) {
    console.error('Error invoking Gemini API:', err);
    return res.json(generateFallbackSession(topic));
  }
});

// API: Quick AI expansion or wireframe generation
app.post('/api/ai-expand', async (req, res) => {
  const { action, currentTopic, targetElement } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Generate helpful fallback expansions
    if (action === 'expand_wireframe') {
      return res.json({
        type: 'wireframe',
        element: {
          id: 'wf-exp-' + Date.now(),
          type: 'card',
          x: 420,
          y: 200,
          w: 320,
          h: 280,
          title: `Detailed Breakdown: ${targetElement?.title || 'Component'}`,
          subtitle: 'Expanded sub-flow & interaction state',
          badge: 'Detail View',
          items: [
            '1. Primary touch interaction state',
            '2. Secondary expandable dropdown',
            '3. Validation alert with hand-drawn warning icon',
            '4. Subtle pencil underline for active tab',
          ],
          annotations: ['Pencil note: Test on mobile viewport first'],
          sketchStyle: 'rough',
          rotation: -1.1,
        },
      });
    }

    return res.json({
      type: 'sticky',
      stickies: [
        {
          id: 'st-exp-1-' + Date.now(),
          x: 200,
          y: 350,
          w: 220,
          h: 170,
          text: `💭 Deep Dive: How can we make ${currentTopic || 'this feature'} 3x simpler by removing 2 unnecessary clicks?`,
          category: 'idea',
          color: 'yellow',
          rotation: -1.5,
        },
        {
          id: 'st-exp-2-' + Date.now(),
          x: 450,
          y: 350,
          w: 220,
          h: 170,
          text: '⚡ Edge Case: What happens when the user has zero network connection or empty state data?',
          category: 'question',
          color: 'pink',
          rotation: 1.7,
        },
      ],
    });
  }

  try {
    const prompt = `
Action: ${action}
Topic: "${currentTopic || 'General Product Brainstorm'}"
Target: ${JSON.stringify(targetElement || {})}

Provide new hand-drawn wireframes or stickies to expand this brainstorm.
Format as JSON:
{
  "newWireframes": [
    {
      "type": "mobile-screen" | "browser-window" | "card" | "button" | "input" | "search-bar" | "checkbox-list" | "chart-sketch" | "metric",
      "title": string,
      "subtitle": string,
      "badge": string,
      "items": string[],
      "annotations": string[]
    }
  ],
  "newStickies": [
    {
      "text": string,
      "category": "idea" | "question" | "feature" | "wild" | "risk",
      "color": "yellow" | "pink" | "blue" | "green" | "orange"
    }
  ]
}
`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in ai-expand:', error);
    return res.status(500).json({ error: 'Expansion failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
