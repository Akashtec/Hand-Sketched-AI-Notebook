import React from 'react';
import { FlowStep } from '../types';
import { PencilArrow } from './SketchSvgDoodles';

interface Props {
  steps: FlowStep[];
  onStepClick?: (step: FlowStep) => void;
}

export const FlowStepView: React.FC<Props> = ({ steps, onStepClick }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="p-4 bg-[#fffef9] sketch-border sketch-shadow my-6">
      <div className="flex items-center justify-between border-b-2 border-stone-300 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-stone-800"></span>
          <h3 className="font-sketch text-lg font-bold text-stone-900">
            User Journey & Interaction Flow
          </h3>
        </div>
        <span className="text-xs font-hand text-stone-500 italic">
          Step-by-step wireframe narrative
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 overflow-x-auto pb-3">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id || idx}>
            <div
              onClick={() => onStepClick?.(step)}
              className="flex-1 min-w-[210px] p-3.5 bg-stone-50/80 border-2 border-dashed border-stone-400 rounded-lg hover:bg-stone-100/90 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 text-xs font-sketch font-bold bg-[#2b2b2b] text-[#faf7ee] rounded">
                  Node 0{idx + 1}
                </span>
                <span className="text-xs font-hand text-stone-400">{step.wireframeSnippet || 'View'}</span>
              </div>

              <h4 className="font-sketch text-base font-bold text-stone-900 mt-1">{step.title}</h4>
              <p className="font-hand text-sm text-stone-600 mt-1 leading-snug">{step.detail}</p>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex flex-col items-center justify-center px-1 text-stone-600 select-none">
                <span className="text-[11px] font-caveat font-bold text-stone-500 mb-0.5">
                  {step.arrowLabel || 'Next'}
                </span>
                <PencilArrow direction="right" className="hidden lg:block w-12 h-6 text-stone-700" />
                <PencilArrow direction="down" className="lg:hidden w-6 h-8 text-stone-700 my-1" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
