import React from 'react';
import { motion } from 'motion/react';
import { History, Trash2, ChevronRight } from 'lucide-react';
import { DecisionHistoryItem } from '../types';

interface HistorySidebarProps {
  history: DecisionHistoryItem[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
}

export function HistorySidebar({ history, onSelect, onDelete, selectedId }: HistorySidebarProps) {
  return (
    <div className="w-80 bg-zinc-50 border-r border-zinc-200 h-screen flex flex-col overflow-hidden">
      <div className="p-6 border-b border-zinc-200 flex items-center gap-3 bg-white">
        <div className="bg-zinc-900 p-2 rounded-lg">
          <History className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-semibold text-zinc-900 tracking-tight">Past Decisions</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-zinc-500 mt-10 text-sm">
            No past decisions yet.
          </div>
        ) : (
          history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                selectedId === item.id 
                  ? 'bg-white border-zinc-300 shadow-sm' 
                  : 'bg-transparent border-transparent hover:bg-zinc-100 hover:border-zinc-200'
              }`}
              onClick={() => onSelect(item.id)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {item.dilemma}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                      {item.method}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
