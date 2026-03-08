import React, { useState, useEffect } from 'react';
import { HistorySidebar } from './components/HistorySidebar';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisViewer } from './components/AnalysisViewer';
import { Decision, DecisionHistoryItem } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function App() {
  const [history, setHistory] = useState<DecisionHistoryItem[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/decisions');
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load history.');
    }
  };

  const handleSelectDecision = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setIsMobileMenuOpen(false);
    try {
      const res = await fetch(`/api/decisions/${id}`);
      if (!res.ok) throw new Error('Failed to fetch decision');
      const data = await res.json();
      setSelectedDecision(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load decision details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDecision = async (id: string) => {
    try {
      const res = await fetch(`/api/decisions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete decision');
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (selectedDecision?.id === id) {
        setSelectedDecision(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete decision.');
    }
  };

  const handleSubmitDecision = async (dilemma: string, method: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert decision analyst.

Analyze the following dilemma objectively.

Decision:
${dilemma}

Method:
${method}

Requirements:
* Use structured headings
* Provide deep reasoning
* Avoid vague advice
* Present clear arguments
* End with a final recommendation

Format the response in Markdown.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      const analysis = aiResponse.text;

      if (!analysis) {
        throw new Error('Failed to generate analysis from AI');
      }

      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemma, method, analysis }),
      });
      if (!res.ok) throw new Error('Failed to save analysis');
      const data = await res.json();
      setSelectedDecision(data);
      fetchHistory(); // Refresh history
    } catch (err) {
      console.error(err);
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-100 font-sans overflow-hidden">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md text-zinc-900 print:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 print:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <HistorySidebar
          history={history}
          onSelect={handleSelectDecision}
          onDelete={handleDeleteDecision}
          selectedId={selectedDecision?.id || null}
        />
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden print:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2"
            >
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-4 hover:text-red-200">
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-4 pt-16 md:p-8 md:pt-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {selectedDecision ? (
              <AnalysisViewer
                key="viewer"
                decision={selectedDecision}
                onBack={() => setSelectedDecision(null)}
              />
            ) : (
              <DecisionForm
                key="form"
                onSubmit={handleSubmitDecision}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
