import React, { useState, useRef, useEffect } from 'react';
import { FAQItem, Message, MatchScore } from '../types';
import { findBestMatch } from '../utils/nlp';
import { Send, Sparkles, AlertCircle, HelpCircle, ChevronRight, Eye, MessageSquare, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  faqs: FAQItem[];
  onSelectExplanation: (match: MatchScore, query: string) => void;
  selectedMatch: MatchScore | null;
}

export default function ChatInterface({
  faqs,
  onSelectExplanation,
  selectedMatch
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am your FAQ Intelligent Assistant. Ask me anything about this product or topic, and I'll match your question to the best answers in my knowledge base using local Natural Language Processing (NLP) & Cosine Similarity. 🚀",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Create user message
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate natural processing delay
    setTimeout(() => {
      const { bestMatch, allMatches } = findBestMatch(textToSend, faqs);

      let replyText = '';
      let matchScore: MatchScore | undefined;
      let suggestedFAQs: FAQItem[] = [];

      const threshold = 0.25;

      if (bestMatch && bestMatch.score >= threshold) {
        // High confidence match found
        const matchedFaq = faqs.find(f => f.id === bestMatch.faqId);
        replyText = matchedFaq ? matchedFaq.answer : "I found a match, but the details are unavailable.";
        matchScore = bestMatch;

        // Optionally, provide other top related suggestions
        const alternatives = allMatches
          .filter(m => m.faqId !== bestMatch.faqId && m.score > 0.1)
          .slice(0, 2);
        
        if (alternatives.length > 0) {
          suggestedFAQs = alternatives
            .map(alt => faqs.find(f => f.id === alt.faqId))
            .filter((f): f is FAQItem => f !== undefined);
        }
      } else {
        // Low confidence or no match
        replyText = "I couldn't find an exact answer in our current FAQs. Here are the closest questions I found in our database that might help you:";
        matchScore = bestMatch || undefined;

        // Get top 3 closest items regardless of score (if score > 0)
        suggestedFAQs = allMatches
          .slice(0, 3)
          .filter(m => m.score > 0.01)
          .map(m => faqs.find(f => f.id === m.faqId))
          .filter((f): f is FAQItem => f !== undefined);
        
        if (suggestedFAQs.length === 0) {
          replyText = "I couldn't find any relevant match in our FAQs. Try asking in a different way, or check our categories on the left!";
        }
      }

      const botMsg: Message = {
        id: `msg-${Date.now()}-bot`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchScore,
        suggestedFAQs
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      // Auto-select the explanation for the visualizer
      if (bestMatch) {
        onSelectExplanation(bestMatch, textToSend);
      }
    }, 750);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Quick suggestion chips based on existing database
  const getSuggestions = () => {
    // Return up to 3 random questions from the active FAQs
    return faqs.slice(0, 3).map(f => f.question);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/30 text-zinc-100 rounded-2xl overflow-hidden border border-zinc-800/80 shadow-xl">
      {/* Bot Chat Header */}
      <div className="px-5 py-4 bg-zinc-950/40 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">FAQ Intellect</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-zinc-400 font-medium">Local NLP Core Engine Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 font-mono rounded border border-zinc-700">
            Cosine Sim mode
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, index) => {
          const isBot = msg.sender === 'bot';
          return (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                {/* Chat Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isBot
                      ? 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800'
                      : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Suggestion Links inside Bot Message */}
                  {isBot && msg.suggestedFAQs && msg.suggestedFAQs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1.5">
                      <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Suggested Questions:
                      </p>
                      {msg.suggestedFAQs.map(faq => (
                        <button
                          key={faq.id}
                          onClick={() => handleSendMessage(faq.question)}
                          className="w-full text-left flex items-start gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-0.5"
                        >
                          <CornerDownRight className="w-3 h-3 mt-1 text-zinc-500 shrink-0" />
                          <span className="underline decoration-indigo-500/30 hover:decoration-indigo-300">
                            {faq.question}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Metadata & Actions */}
                <div className="flex items-center gap-3 mt-1.5 px-1 text-[10px] text-zinc-500 font-mono">
                  <span>{msg.timestamp}</span>
                  {isBot && msg.matchScore && (
                    <>
                      <span>•</span>
                      <span className={`font-semibold ${msg.matchScore.score >= 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        Sim score: {(msg.matchScore.score * 100).toFixed(0)}%
                      </span>
                      <span>•</span>
                      <button
                        onClick={() => msg.matchScore && onSelectExplanation(msg.matchScore, '')}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
                        title="View NLP Vector Matching details for this response"
                      >
                        <Eye className="w-3 h-3" /> Inspect NLP Math
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Input Prompts */}
      {messages.length === 1 && (
        <div className="px-5 pb-2 pt-1 bg-zinc-950/20 border-t border-zinc-800/80">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Try asking one of these questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {getSuggestions().map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-xs bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all text-left line-clamp-1 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Message Form */}
      <form onSubmit={handleFormSubmit} className="p-4 bg-zinc-950/60 border-t border-zinc-800 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-zinc-900 hover:bg-zinc-850/50 focus:bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm outline-none text-zinc-100 placeholder-zinc-600 focus:ring-4 focus:ring-indigo-500/10 transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/10 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
