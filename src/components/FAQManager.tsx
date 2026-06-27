import React, { useState } from 'react';
import { FAQItem, TopicPreset } from '../types';
import { TOPIC_PRESETS } from '../data/defaultFAQs';
import { Plus, Trash2, Edit2, Check, X, Search, BookOpen, Sparkles, RefreshCw, Brain, Cpu, CreditCard, MessageSquare, User, Globe } from 'lucide-react';

const getPresetIcon = (iconName: string) => {
  switch (iconName) {
    case 'Brain': return <Brain className="w-3.5 h-3.5 mb-1 text-indigo-400" />;
    case 'Cpu': return <Cpu className="w-3.5 h-3.5 mb-1 text-emerald-400" />;
    case 'CreditCard': return <CreditCard className="w-3.5 h-3.5 mb-1 text-amber-400" />;
    case 'MessageSquare': return <MessageSquare className="w-3.5 h-3.5 mb-1 text-teal-400" />;
    case 'User': return <User className="w-3.5 h-3.5 mb-1 text-rose-400" />;
    case 'Globe': return <Globe className="w-3.5 h-3.5 mb-1 text-sky-400" />;
    default: return <BookOpen className="w-3.5 h-3.5 mb-1 text-zinc-400" />;
  }
};

interface FAQManagerProps {
  faqs: FAQItem[];
  setFaqs: (faqs: FAQItem[]) => void;
  activePresetId: string;
  setActivePresetId: (id: string) => void;
  onReset: () => void;
}

export default function FAQManager({
  faqs,
  setFaqs,
  activePresetId,
  setActivePresetId,
  onReset
}: FAQManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Add FAQ form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq => {
    const query = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query)
    );
  });

  const handleStartEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setEditCategory(faq.category || 'General');
  };

  const handleSaveEdit = (id: string) => {
    if (!editQuestion.trim() || !editAnswer.trim()) return;
    setFaqs(
      faqs.map(faq =>
        faq.id === id
          ? { ...faq, question: editQuestion.trim(), answer: editAnswer.trim(), category: editCategory.trim() }
          : faq
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newFaq: FAQItem = {
      id: `custom-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory.trim() || 'General'
    };

    setFaqs([...faqs, newFaq]);
    setNewQuestion('');
    setNewAnswer('');
    setNewCategory('General');
    setShowAddForm(false);
  };

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const preset = TOPIC_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setFaqs(preset.faqs);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/20 border-r border-zinc-800">
      {/* Preset Selector */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/40">
        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          FAQ Topic Preset
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-2">
          {TOPIC_PRESETS.map(preset => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400 font-medium shadow-sm'
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-300'
                }`}
              >
                {getPresetIcon(preset.icon)}
                <span className="text-xs font-semibold line-clamp-1 mt-0.5">{preset.name.split(' ')[0]}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                  {preset.faqs.length} FAQs
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
          <p className="line-clamp-1 italic text-[11px] text-zinc-400">
            {TOPIC_PRESETS.find(p => p.id === activePresetId)?.description}
          </p>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium ml-2 cursor-pointer transition-colors shrink-0"
            title="Reset active FAQ dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* FAQ Management Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 text-zinc-100 text-sm border border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-sm shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* Add FAQ Overlay Form */}
      {showAddForm && (
        <form onSubmit={handleAddFaq} className="p-4 bg-indigo-500/5 border-b border-zinc-800 animate-fadeIn">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Create Custom FAQ Item
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. General, Troubleshooting, Security"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Question</label>
              <input
                type="text"
                placeholder="What is your question?"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Answer</label>
              <textarea
                placeholder="Provide the matching answer..."
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-md transition-colors"
              >
                Create FAQ
              </button>
            </div>
          </div>
        </form>
      )}

      {/* FAQ List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
            <BookOpen className="w-10 h-10 stroke-[1.5] mb-2 text-zinc-600" />
            <p className="text-sm font-medium">No FAQs Found</p>
            <p className="text-xs mt-0.5">Try searching something else or create a custom one.</p>
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isEditing = editingId === faq.id;
            return (
              <div
                key={faq.id}
                className={`p-3.5 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all ${
                  isEditing ? 'ring-2 ring-indigo-500/20 border-indigo-500 bg-zinc-900' : ''
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">
                        Category:
                      </span>
                      <input
                        type="text"
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        className="flex-1 px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                        Question:
                      </span>
                      <input
                        type="text"
                        value={editQuestion}
                        onChange={e => setEditQuestion(e.target.value)}
                        className="w-full px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-indigo-500 focus:outline-none font-medium text-zinc-100"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                        Answer:
                      </span>
                      <textarea
                        value={editAnswer}
                        onChange={e => setEditAnswer(e.target.value)}
                        rows={3}
                        className="w-full px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs focus:border-indigo-500 focus:outline-none text-zinc-300 resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSaveEdit(faq.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300 rounded hover:bg-emerald-950/30 transition-colors"
                        title="Save Changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-block px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 text-[9px] font-bold uppercase tracking-wider rounded">
                        {faq.category || 'General'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(faq)}
                          className="p-1 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-200 leading-snug mb-1">
                      {faq.question}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="p-4 bg-zinc-900/40 border-t border-zinc-850 text-center text-xs text-zinc-500">
        Total database size: <strong className="text-zinc-300 font-semibold">{faqs.length}</strong> items
      </div>
    </div>
  );
}
