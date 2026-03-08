import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (dilemma: string, method: string) => void;
  isLoading: boolean;
}

const METHODS = [
  { id: 'Pros & Cons', label: 'Pros & Cons', desc: 'Simple list of advantages and disadvantages.' },
  { id: 'SWOT Analysis', label: 'SWOT Analysis', desc: 'Strengths, Weaknesses, Opportunities, Threats.' },
  { id: 'Comparison Matrix', label: 'Comparison Matrix', desc: 'Compare multiple options against criteria.' },
  { id: 'First Principles', label: 'First Principles', desc: 'Break down the problem to its fundamental truths.' },
];

export function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [dilemma, setDilemma] = useState('');
  const [method, setMethod] = useState(METHODS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemma.trim()) return;
    onSubmit(dilemma, method);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-3">
          The Tiebreaker
        </h1>
        <p className="text-lg text-zinc-500 max-w-lg mx-auto">
          Input your dilemma and let AI analyze it using structured reasoning frameworks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
        <div className="space-y-3">
          <label htmlFor="dilemma" className="block text-sm font-semibold text-zinc-900 uppercase tracking-wider">
            What's your dilemma?
          </label>
          <textarea
            id="dilemma"
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            placeholder="e.g., Should I move to another city for a job?"
            className="w-full min-h-[120px] p-4 text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none placeholder:text-zinc-400"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-zinc-900 uppercase tracking-wider">
            Analysis Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  method === m.id
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100'
                }`}
              >
                <div className="font-semibold mb-1">{m.label}</div>
                <div className={`text-xs ${method === m.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {m.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !dilemma.trim()}
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Decision...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Decision
              <ArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
