import React, { useState } from 'react';
import { StickyNote } from '../types';
import { Trash2, Edit3, Check } from 'lucide-react';

interface Props {
  note: StickyNote;
  onUpdate: (updated: StickyNote) => void;
  onDelete: () => void;
}

export const StickyNoteView: React.FC<Props> = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.text);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-[#fef08a] border-[#eab308] text-[#422006]';
      case 'pink':
        return 'bg-[#fbcfe8] border-[#f472b6] text-[#701a75]';
      case 'blue':
        return 'bg-[#bae6fd] border-[#38bdf8] text-[#0c4a6e]';
      case 'green':
        return 'bg-[#bbf7d0] border-[#4ade80] text-[#14532d]';
      case 'orange':
        return 'bg-[#fed7aa] border-[#fb923c] text-[#7c2d12]';
      default:
        return 'bg-[#fef08a] border-[#eab308] text-[#422006]';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'idea':
        return '💡 Idea';
      case 'question':
        return '❓ Question';
      case 'feature':
        return '🚀 Feature';
      case 'wild':
        return '⚡ Wild Idea';
      case 'risk':
        return '⚠️ Risk';
      default:
        return '📝 Note';
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdate({ ...note, text });
  };

  return (
    <div
      style={{
        transform: `rotate(${note.rotation || 0}deg)`,
      }}
      className={`relative group p-4 w-[240px] min-h-[160px] border-2 rounded-sm shadow-md transition-all duration-150 sketch-shadow-hover select-none ${getColorClasses(
        note.color
      )}`}
    >
      {/* Tape strip at top */}
      <div className="scotch-tape -top-2.5 left-1/2 -translate-x-1/2 rotate-1" />

      {/* Action buttons (hover) */}
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="p-1 rounded bg-black/10 hover:bg-black/20 text-current transition"
            title="Done editing"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded bg-black/10 hover:bg-black/20 text-current transition"
            title="Edit note"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-1 rounded bg-black/10 hover:bg-red-500/30 text-current transition"
          title="Delete note"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category badge */}
      <div className="mb-2">
        <span className="text-[11px] font-hand font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/10">
          {getCategoryLabel(note.category)}
        </span>
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          rows={4}
          className="w-full bg-transparent font-caveat text-lg leading-snug outline-none resize-none border-b border-black/20"
        />
      ) : (
        <p className="font-caveat text-xl leading-snug whitespace-pre-wrap">
          {note.text}
        </p>
      )}

      {/* Post-it folded corner visual */}
      <div className="absolute bottom-0 right-0 w-4 h-4 overflow-hidden">
        <div className="w-8 h-8 bg-black/10 transform rotate-45 translate-x-3 translate-y-3" />
      </div>
    </div>
  );
};
