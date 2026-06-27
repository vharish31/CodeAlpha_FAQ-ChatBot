import React, { useState, useEffect } from 'react';
import { FAQItem, MatchScore } from './types';
import { TOPIC_PRESETS } from './data/defaultFAQs';
import FAQManager from './components/FAQManager';
import ChatInterface from './components/ChatInterface';
import NLPVisualizer from './components/NLPVisualizer';
import { Sparkles, MessageSquare, Database, Settings, BarChart2, BookOpen, Layers, HelpCircle, GraduationCap } from 'lucide-react';

export default function App() {
  const [activePresetId, setActivePresetId] = useState<string>('ai-studio');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchScore | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  // Mobile navigation tab state
  const [mobileTab, setMobileTab] = useState<'chat' | 'database' | 'sandbox'>('chat');

  // Load the initial preset on startup
  useEffect(() => {
    const initialPreset = TOPIC_PRESETS.find(p => p.id === activePresetId) || TOPIC_PRESETS[0];
    setFaqs(initialPreset.faqs);
  }, []);

  // Handle resetting the database to the current preset's defaults
  const handleResetToPreset = () => {
    const preset = TOPIC_PRESETS.find(p => p.id === activePresetId);
    if (preset) {
      setFaqs(preset.faqs);
      setSelectedMatch(null);
      setLastQuery('');
    }
  };

  const handleSelectExplanation = (match: MatchScore, queryText?: string) => {
    setSelectedMatch(match);
    if (queryText) {
      setLastQuery(queryText);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100">
      {/* Universal Top Branding Nav Header */}
      <header className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-50 px-6 py-3 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-100 font-display tracking-wide uppercase flex items-center gap-1.5">
                LexiMatch FAQ Bot
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium">
                NLP Preprocessing & Vector Space Similarity Studio
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-lg border border-indigo-500/20">
              <Layers className="w-3.5 h-3.5" />
              <span className="font-semibold">Local Cosine Similarity Engine Active</span>
            </div>
            <span className="h-4 w-px bg-zinc-800"></span>
            <div className="text-[11px] text-zinc-400 font-medium">
              Preset: <strong className="text-zinc-200 font-semibold">{TOPIC_PRESETS.find(p => p.id === activePresetId)?.name}</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Main Responsive Layout Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
        
        {/* On Mobile & Tablets: Tab buttons bar */}
        <div className="lg:hidden flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 shadow-xs shrink-0 grid grid-cols-3 gap-1">
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            FAQ Chatbot
          </button>
          <button
            onClick={() => setMobileTab('database')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'database'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Database className="w-4 h-4" />
            Edit FAQs
          </button>
          <button
            onClick={() => setMobileTab('sandbox')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Inspect Math
          </button>
        </div>

        {/* Triple Layout Grid Panel Container */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px] lg:h-[calc(100vh-140px)] items-stretch">
          
          {/* COLUMN 1: FAQ database list & controller (Left column) */}
          <section className={`lg:col-span-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 overflow-hidden shadow-sm flex flex-col ${
            mobileTab === 'database' ? 'flex' : 'hidden lg:flex'
          }`}>
            <FAQManager
              faqs={faqs}
              setFaqs={setFaqs}
              activePresetId={activePresetId}
              setActivePresetId={setActivePresetId}
              onReset={handleResetToPreset}
            />
          </section>

          {/* COLUMN 2: Chat Assistant Frame (Middle column) */}
          <section className={`lg:col-span-4 h-full flex flex-col ${
            mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}>
            <ChatInterface
              faqs={faqs}
              onSelectExplanation={handleSelectExplanation}
              selectedMatch={selectedMatch}
            />
          </section>

          {/* COLUMN 3: Mathematical Visualizer Panel (Right column) */}
          <section className={`lg:col-span-4 h-full flex flex-col ${
            mobileTab === 'sandbox' ? 'flex' : 'hidden lg:flex'
          }`}>
            <NLPVisualizer
              lastQuery={lastQuery}
              selectedMatch={selectedMatch}
              faqs={faqs}
            />
          </section>

        </div>
      </main>
    </div>
  );
}
