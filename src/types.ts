export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface MatchScore {
  faqId: string;
  question: string;
  score: number;
  explanation: {
    queryTokens: string[];
    faqTokens: string[];
    intersection: string[];
    queryVector: number[];
    faqVector: number[];
  };
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  matchScore?: MatchScore;
  suggestedFAQs?: FAQItem[];
}

export interface TopicPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  faqs: FAQItem[];
}
