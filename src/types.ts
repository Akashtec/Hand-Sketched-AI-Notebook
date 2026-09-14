export type PaperStyle = 'grid' | 'lined' | 'dots' | 'blank';
export type ToolMode = 'select' | 'pencil' | 'highlighter' | 'eraser' | 'sticky' | 'wireframe' | 'arrow';
export type PencilColor = '#2b2b2b' | '#1e3a8a' | '#991b1b' | '#065f46' | '#b45309';

export interface DrawingPoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface DrawingStroke {
  id: string;
  points: DrawingPoint[];
  color: string;
  size: number;
  tool: 'pencil' | 'highlighter';
  opacity?: number;
}

export type WireframeType =
  | 'mobile-screen'
  | 'browser-window'
  | 'card'
  | 'button'
  | 'input'
  | 'navbar'
  | 'metric'
  | 'tabs'
  | 'checkbox-list'
  | 'avatar-profile'
  | 'search-bar'
  | 'chart-sketch';

export interface WireframeElement {
  id: string;
  type: WireframeType;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  placeholder?: string;
  badge?: string;
  items?: string[];
  annotations?: string[];
  sketchStyle?: 'rough' | 'clean' | 'draft';
  highlightColor?: string;
  rotation?: number; // small tilt for hand-drawn feel (-2 to 2 deg)
}

export interface StickyNote {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  category: 'idea' | 'question' | 'feature' | 'wild' | 'risk';
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
  rotation: number;
  author?: string;
}

export interface FlowStep {
  id: string;
  title: string;
  detail: string;
  wireframeSnippet: string;
  arrowLabel?: string;
}

export interface BrainstormSession {
  id: string;
  topic: string;
  summary: string;
  corePitch: string;
  targetAudience: string;
  wireframes: WireframeElement[];
  stickies: StickyNote[];
  flowSteps: FlowStep[];
  pencilNotes: string[];
  suggestedPrompts: string[];
  paperStyle: PaperStyle;
}

export interface AiBrainstormRequest {
  topic: string;
  mode?: 'full_session' | 'expand_node' | 'add_wireframe' | 'crazy_ideas' | 'critique';
  currentSession?: Partial<BrainstormSession>;
  targetType?: string;
  userInstructions?: string;
}
