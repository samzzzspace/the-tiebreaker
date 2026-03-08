import React, { useRef } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Printer, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Decision } from '../types';

interface AnalysisViewerProps {
  decision: Decision;
  onBack: () => void;
}

export function AnalysisViewer({ decision, onBack }: AnalysisViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col h-full max-h-[90vh]"
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-600"
            title="Back to New Decision"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight line-clamp-1">
              {decision.dilemma}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-200 px-2 py-0.5 rounded-full">
                {decision.method}
              </span>
              <span className="text-xs text-zinc-400">
                {new Date(decision.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 overflow-y-auto flex-1 print:p-0 print:overflow-visible" ref={contentRef}>
        <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-p:leading-relaxed prose-li:marker:text-zinc-400">
          <ReactMarkdown>{decision.analysis}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
