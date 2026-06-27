import React, { useState, useEffect } from 'react';
import { FAQItem, MatchScore } from '../types';
import { preprocessText, calculateCosineSimilarity, STOPWORDS } from '../utils/nlp';
import { Sliders, HelpCircle, Code, ListFilter, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface NLPVisualizerProps {
  lastQuery: string;
  selectedMatch: MatchScore | null;
  faqs: FAQItem[];
}

export default function NLPVisualizer({
  lastQuery,
  selectedMatch,
  faqs
}: NLPVisualizerProps) {
  const [activeFaqId, setActiveFaqId] = useState<string>('');
  const [customQuery, setCustomQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'vectorMath'>('pipeline');

  // Keep state updated when selectedMatch or lastQuery changes
  useEffect(() => {
    if (selectedMatch) {
      setActiveFaqId(selectedMatch.faqId);
    } else if (faqs.length > 0 && !activeFaqId) {
      setActiveFaqId(faqs[0].id);
    }
  }, [selectedMatch, faqs]);

  useEffect(() => {
    if (lastQuery) {
      setCustomQuery(lastQuery);
    }
  }, [lastQuery]);

  const currentQuery = customQuery || 'How do I upgrade my subscription plan?';
  const selectedFaq = faqs.find(f => f.id === activeFaqId) || faqs[0];

  // Run real-time NLP matching
  const queryPrep = preprocessText(currentQuery);
  const faqPrep = selectedFaq ? preprocessText(selectedFaq.question) : null;
  const similarityResult = selectedFaq ? calculateCosineSimilarity(currentQuery, selectedFaq.question) : null;

  // Find all stopwords extracted from query
  const rawWords = currentQuery.toLowerCase().replace(/[^\w\s']/g, ' ').split(/\s+/).filter(Boolean);
  const detectedStopwords = rawWords.filter(w => STOPWORDS.has(w.replace(/['’]/g, '')));

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 shadow-sm h-full flex flex-col overflow-hidden">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/25">
            <Sliders className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">NLP & Vector Math Sandbox</h2>
            <p className="text-[11px] text-zinc-400 font-normal">Real-time cosine similarity engine step-by-step</p>
          </div>
        </div>
        
        {/* Tab selector */}
        <div className="flex bg-zinc-950/60 border border-zinc-800 rounded-lg p-0.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'pipeline' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setActiveTab('vectorMath')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'vectorMath' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Vector Math
          </button>
        </div>
      </div>

      {/* Configuration row */}
      <div className="bg-zinc-900/60 rounded-xl p-3.5 my-4 border border-zinc-800 shrink-0 space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            Test Input Question:
          </label>
          <input
            type="text"
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            placeholder="Type any test query here..."
            className="w-full px-3 py-1.5 bg-zinc-950 text-xs border border-zinc-800 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-zinc-100 transition-all"
          />
        </div>

        {faqs.length > 0 && (
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Compare with FAQ Item:
            </label>
            <select
              value={activeFaqId}
              onChange={e => setActiveFaqId(e.target.value)}
              className="w-full px-3 py-1.5 bg-zinc-950 text-xs border border-zinc-800 rounded-lg outline-none focus:border-indigo-500 font-medium text-zinc-100 transition-all cursor-pointer"
            >
              {faqs.map(faq => (
                <option key={faq.id} value={faq.id} className="bg-zinc-900 text-zinc-100">
                  [{faq.category}] {faq.question}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {activeTab === 'pipeline' ? (
          /* PIPELINE TAB */
          <div className="space-y-4 animate-fadeIn">
            {/* 1. Normalization & Tokenization */}
            <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/30 shadow-xs">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-extrabold border border-indigo-500/20">1</span>
                Text Normalization & Tokenization
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] block">CLEANED TEXT (LOWERCASE & NO PUNCTUATION)</span>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800 font-mono text-zinc-300 mt-0.5">
                    "{queryPrep.cleaned || 'Empty'}"
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] block mt-2">RAW TOKENS</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {queryPrep.cleaned.split(' ').filter(Boolean).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono text-[11px] border border-zinc-750">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Stopword Filtering */}
            <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/30 shadow-xs">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-extrabold border border-indigo-500/20">2</span>
                Stopword Filtering
              </h3>
              <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                Removes common structural English words (e.g., 'what', 'how', 'is', 'a') to keep only the semantically heavy words.
              </p>
              <div className="space-y-3 text-xs">
                {detectedStopwords.length > 0 ? (
                  <div>
                    <span className="text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider block mb-1">REMOVED STOPWORDS</span>
                    <div className="flex flex-wrap gap-1">
                      {detectedStopwords.map((w, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-rose-950/20 border border-rose-900/40 text-rose-400 rounded font-mono text-[11px]">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-zinc-500 italic">No standard stopwords found in the query.</div>
                )}
                <div>
                  <span className="text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider block mb-1">RETAINED CONTENT TOKENS</span>
                  <div className="flex flex-wrap gap-1">
                    {queryPrep.tokens.length > 0 ? (
                      queryPrep.tokens.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 rounded font-mono text-[11px]">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-500 italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Suffix Stemming */}
            <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/30 shadow-xs">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-extrabold border border-indigo-500/20">3</span>
                Lightweight Suffix Stemming
              </h3>
              <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                Stems plurals, tenses, and modifiers (e.g. "pricing" → "price", "queries" → "query") so variations map to the same root semantic token.
              </p>
              <div className="space-y-2 text-xs">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="pb-1.5 font-normal">Original Word</th>
                      <th className="pb-1.5 font-normal">→ Stemmed Root</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryPrep.tokens.map((word, idx) => {
                      const stem = queryPrep.stemmed[idx];
                      const changed = word !== stem;
                      return (
                        <tr key={idx} className="border-b border-zinc-800/50 last:border-0">
                          <td className="py-1.5 text-zinc-400">{word}</td>
                          <td className="py-1.5 font-semibold">
                            <span className={changed ? 'text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-900/40' : 'text-zinc-300'}>
                              {stem}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* VECTOR MATH TAB */
          <div className="space-y-4 animate-fadeIn">
            {selectedFaq ? (
              <>
                {/* Score Summary Banner */}
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Similarity Match Score</span>
                    <h4 className="text-2xl font-black text-indigo-300 mt-0.5">
                      {similarityResult ? (similarityResult.score * 100).toFixed(1) : '0.0'}%
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Overlap Terms</span>
                    <p className="text-sm font-semibold text-zinc-300 mt-0.5">
                      {similarityResult?.explanation.intersection.length || 0} vocabulary stems
                    </p>
                  </div>
                </div>

                {/* Overlapping words visualizer */}
                <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/30">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-zinc-400" />
                    Overlapping Semantic Terms
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-zinc-500 font-mono text-[10px] block mb-1">INTERSECTING STEMS</span>
                      <div className="flex flex-wrap gap-1">
                        {similarityResult && similarityResult.explanation.intersection.length > 0 ? (
                           similarityResult.explanation.intersection.map((word, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 font-mono font-semibold rounded text-[11px]">
                              {word}
                            </span>
                          ))
                        ) : (
                          <span className="text-zinc-500 italic text-[11px]">None. No overlapping terms found.</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60">
                      <div>
                        <span className="text-zinc-500 font-mono text-[10px] block mb-1">QUERY VECTOR</span>
                        <div className="flex flex-wrap gap-1">
                          {queryPrep.stemmed.map((word, idx) => {
                            const isShared = similarityResult?.explanation.intersection.includes(word);
                            return (
                              <span key={idx} className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                                isShared ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {word}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono text-[10px] block mb-1">FAQ VECTOR</span>
                        <div className="flex flex-wrap gap-1">
                          {faqPrep?.stemmed.map((word, idx) => {
                            const isShared = similarityResult?.explanation.intersection.includes(word);
                            return (
                              <span key={idx} className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                                isShared ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {word}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Math Formulas */}
                <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/30 font-mono text-xs text-zinc-300 space-y-3.5">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-sans flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-zinc-400" />
                    Cosine Similarity Math
                  </h3>

                  <div>
                    <span className="text-zinc-500 text-[10px] block mb-1 font-bold">1. FORMULA</span>
                    <div className="bg-zinc-950 text-zinc-100 p-3 rounded-lg text-center font-bold font-sans border border-zinc-850 text-[13px]">
                      CosineSim(Q, F) = <span className="text-indigo-400">Q • F</span> / (<span className="text-emerald-400">||Q||</span> × <span className="text-amber-400">||F||</span>)
                    </div>
                  </div>

                  {similarityResult && (
                    <div className="space-y-2 text-[11px] leading-relaxed">
                      <div>
                        <span className="text-zinc-500 text-[10px] block font-bold">2. DOT PRODUCT (Q • F)</span>
                        <div className="bg-zinc-950 p-2 rounded border border-zinc-800 mt-1">
                          {similarityResult.explanation.intersection.length > 0 ? (
                            <span>
                              Sum of multiplied overlapping token occurrences:<br />
                              <span className="font-semibold text-indigo-400">
                                {similarityResult.explanation.intersection.map(word => "1×1").join(" + ")} = {similarityResult.explanation.intersection.length}
                              </span>
                            </span>
                          ) : (
                            <span className="text-zinc-500">No overlapping words, dot product is 0.</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-zinc-500 text-[10px] block font-bold">3. MAGNITUDE ||Q||</span>
                          <div className="bg-zinc-950 p-2 rounded border border-zinc-800 mt-1">
                            √({queryPrep.stemmed.map(() => "1²").join("+")}) = <span className="font-semibold text-emerald-400">√{queryPrep.stemmed.length} ≈ {Math.sqrt(queryPrep.stemmed.length).toFixed(3)}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block font-bold">4. MAGNITUDE ||F||</span>
                          <div className="bg-zinc-950 p-2 rounded border border-zinc-800 mt-1">
                            √({faqPrep?.stemmed.map(() => "1²").join("+")}) = <span className="font-semibold text-amber-400">√{faqPrep?.stemmed.length || 0} ≈ {Math.sqrt(faqPrep?.stemmed.length || 0).toFixed(3)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/60">
                        <span className="text-zinc-500 text-[10px] block font-bold">5. COMPUTED RATIO</span>
                        <div className="bg-indigo-950/20 p-2 rounded border border-indigo-900/40 mt-1 font-semibold text-indigo-300">
                          {similarityResult.explanation.intersection.length} / ({Math.sqrt(queryPrep.stemmed.length).toFixed(3)} × {Math.sqrt(faqPrep?.stemmed.length || 0).toFixed(3)}) = <span className="text-indigo-400 font-bold">{similarityResult.score}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-zinc-500 italic text-xs">
                Select an FAQ to display similarity metrics.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
