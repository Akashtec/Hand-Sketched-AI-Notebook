import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DrawingStroke, DrawingPoint } from '../types';

interface Props {
  isDrawingEnabled: boolean;
  activeTool: 'pencil' | 'highlighter' | 'eraser';
  activeColor: string;
  strokeWidth: number;
  strokes: DrawingStroke[];
  onStrokesChange: (strokes: DrawingStroke[]) => void;
  width?: number;
  height?: number;
}

export const SketchCanvas: React.FC<Props> = ({
  isDrawingEnabled,
  activeTool,
  activeColor,
  strokeWidth,
  strokes,
  onStrokesChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawing = useRef(false);
  const currentPoints = useRef<DrawingPoint[]>([]);

  // Adjust canvas resolution to parent size
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // We want the canvas to match the scrollable container's full scrollWidth & scrollHeight
    const w = Math.max(rect.width, container.scrollWidth, 1200);
    const h = Math.max(rect.height, container.scrollHeight, 1000);

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    renderStrokes(strokes);
  }, [strokes]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Render all strokes onto the 2D canvas
  const renderStrokes = useCallback((strokeList: DrawingStroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    strokeList.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      if (stroke.tool === 'highlighter') {
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = stroke.size || 18;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'bevel';
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = 0.88;
        ctx.lineWidth = stroke.size || 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      // Draw smooth quadratic curves between points
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
        const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
      }
      ctx.lineTo(
        stroke.points[stroke.points.length - 1].x,
        stroke.points[stroke.points.length - 1].y
      );
      ctx.stroke();
      ctx.restore();
    });
  }, []);

  useEffect(() => {
    renderStrokes(strokes);
  }, [strokes, renderStrokes]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): DrawingPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
    const pt = getCanvasCoords(e);
    if (!pt) return;

    isDrawing.current = true;
    currentPoints.current = [pt];

    if (activeTool === 'eraser') {
      // Erase strokes near point
      eraseNearPoint(pt.x, pt.y);
    }
  };

  const eraseNearPoint = (x: number, y: number) => {
    const eraseRadius = 25;
    const remaining = strokes.filter((stroke) => {
      return !stroke.points.some((p) => {
        const dist = Math.hypot(p.x - x, p.y - y);
        return dist < eraseRadius;
      });
    });
    if (remaining.length !== strokes.length) {
      onStrokesChange(remaining);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !isDrawingEnabled) return;
    const pt = getCanvasCoords(e);
    if (!pt) return;

    if (activeTool === 'eraser') {
      eraseNearPoint(pt.x, pt.y);
      return;
    }

    currentPoints.current.push(pt);

    // Live preview on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pts = currentPoints.current;
    if (pts.length > 1) {
      ctx.save();
      ctx.beginPath();
      const prev = pts[pts.length - 2];
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pt.x, pt.y);

      if (activeTool === 'highlighter') {
        ctx.strokeStyle = activeColor;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = strokeWidth * 3.5;
        ctx.lineCap = 'square';
      } else {
        ctx.strokeStyle = activeColor;
        ctx.globalAlpha = 0.88;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      ctx.stroke();
      ctx.restore();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (activeTool !== 'eraser' && currentPoints.current.length > 1) {
      const newStroke: DrawingStroke = {
        id: 'stroke-' + Date.now(),
        points: [...currentPoints.current],
        color: activeColor,
        size: activeTool === 'highlighter' ? strokeWidth * 3.5 : strokeWidth,
        tool: activeTool === 'highlighter' ? 'highlighter' : 'pencil',
      };
      onStrokesChange([...strokes, newStroke]);
    }
    currentPoints.current = [];
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-10 ${
        isDrawingEnabled ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
      }`}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="block"
      />
    </div>
  );
};
