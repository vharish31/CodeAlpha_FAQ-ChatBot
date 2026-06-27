import { FAQItem, MatchScore } from '../types';

// Standard English stopwords list
export const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 
  'can', 'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 
  'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 
  'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 
  'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 
  'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 
  'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 
  'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 
  'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'werent', 'what', 'whats', 
  'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 
  'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 
  'yourselves'
]);

/**
 * Clean text, remove special characters/punctuation, lowercase.
 */
export function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ') // Replace punctuation with space, preserving internal apostrophes
    .replace(/\s+/g, ' ')      // Consolidate multiple spaces
    .trim();
}

/**
 * Suffix stemmer rules to simplify/normalize English words.
 */
export function stemWord(word: string): string {
  let w = word.toLowerCase().replace(/['"’]/g, '').trim();
  if (w.length <= 2) return w;

  // Suffix rules for stemming
  if (w.endsWith('ing')) {
    w = w.slice(0, -3);
    if (w.length > 2 && w[w.length - 1] === w[w.length - 2]) {
      w = w.slice(0, -1); // e.g. running -> runn -> run
    }
    // Re-verify word ending patterns like 'e' recovery
    if (w.endsWith('at') || w.endsWith('bl') || w.endsWith('iz')) {
      w += 'e'; // e.g. creating -> creat -> create, enabling -> enabl -> enable
    }
  } else if (w.endsWith('ed')) {
    w = w.slice(0, -2);
    if (w.length > 2 && w[w.length - 1] === w[w.length - 2]) {
      w = w.slice(0, -1); // e.g. plugged -> plugg -> plug
    }
    if (w.endsWith('at') || w.endsWith('bl') || w.endsWith('iz')) {
      w += 'e';
    }
  } else if (w.endsWith('ies')) {
    w = w.slice(0, -3) + 'y'; // e.g. queries -> query
  } else if (w.endsWith('es') && !w.endsWith('aes') && !w.endsWith('ees') && !w.endsWith('oes')) {
    w = w.slice(0, -2); // e.g. boxes -> box
  } else if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is') && !w.endsWith('as')) {
    w = w.slice(0, -1); // e.g. accounts -> account
  } else if (w.endsWith('ment')) {
    w = w.slice(0, -4); // e.g. payment -> pay
  } else if (w.endsWith('fully')) {
    w = w.slice(0, -5) + 'y'; // e.g. beautifully -> beauty
  } else if (w.endsWith('ly')) {
    w = w.slice(0, -2); // e.g. safely -> safe
  } else if (w.endsWith('ion') && w.length > 4) {
    w = w.slice(0, -3); // e.g. connection -> connect
  } else if (w.endsWith('ness') && w.length > 5) {
    w = w.slice(0, -4); // e.g. darkness -> dark
  } else if (w.endsWith('ability') && w.length > 7) {
    w = w.slice(0, -7) + 'le'; // e.g. capability -> capable
  }

  return w;
}

/**
 * Tokenize a phrase into a clean, stemmed array of terms, optionally removing stopwords.
 */
export function preprocessText(text: string, removeStopwords = true): {
  original: string;
  cleaned: string;
  tokens: string[];
  stemmed: string[];
} {
  const cleaned = cleanText(text);
  const rawTokens = cleaned.split(' ').filter(t => t.length > 0);
  
  const tokens = removeStopwords 
    ? rawTokens.filter(t => !STOPWORDS.has(t.replace(/['’]/g, '')))
    : rawTokens;

  const stemmed = tokens.map(t => stemWord(t));

  return {
    original: text,
    cleaned,
    tokens,
    stemmed
  };
}

/**
 * Computes Cosine Similarity between two text sequences using standard bag-of-words vectors.
 */
export function calculateCosineSimilarity(
  query: string,
  target: string
): {
  score: number;
  explanation: {
    queryTokens: string[];
    targetTokens: string[];
    intersection: string[];
    queryVector: number[];
    targetVector: number[];
  };
} {
  const qPrep = preprocessText(query);
  const tPrep = preprocessText(target);

  const qStems = qPrep.stemmed;
  const tStems = tPrep.stemmed;

  if (qStems.length === 0 || tStems.length === 0) {
    return {
      score: 0,
      explanation: {
        queryTokens: qPrep.tokens,
        targetTokens: tPrep.tokens,
        intersection: [],
        queryVector: [],
        targetVector: []
      }
    };
  }

  // Combine to create an all-inclusive unique terms vocabulary (dimension of the vectors)
  const vocabulary = Array.from(new Set([...qStems, ...tStems]));

  // Build frequency vectors
  const queryVector: number[] = [];
  const targetVector: number[] = [];

  const qFreq: Record<string, number> = {};
  qStems.forEach(word => { qFreq[word] = (qFreq[word] || 0) + 1; });

  const tFreq: Record<string, number> = {};
  tStems.forEach(word => { tFreq[word] = (tFreq[word] || 0) + 1; });

  vocabulary.forEach(word => {
    queryVector.push(qFreq[word] || 0);
    targetVector.push(tFreq[word] || 0);
  });

  // Calculate dot product
  let dotProduct = 0;
  let qMagnitudeSq = 0;
  let tMagnitudeSq = 0;

  for (let i = 0; i < vocabulary.length; i++) {
    const qVal = queryVector[i];
    const tVal = targetVector[i];
    dotProduct += qVal * tVal;
    qMagnitudeSq += qVal * qVal;
    tMagnitudeSq += tVal * tVal;
  }

  const qMagnitude = Math.sqrt(qMagnitudeSq);
  const tMagnitude = Math.sqrt(tMagnitudeSq);

  const score = qMagnitude && tMagnitude ? dotProduct / (qMagnitude * tMagnitude) : 0;
  
  const intersection = qStems.filter(stem => tStems.includes(stem));

  return {
    score: parseFloat(score.toFixed(4)),
    explanation: {
      queryTokens: qPrep.tokens,
      targetTokens: tPrep.tokens,
      intersection: Array.from(new Set(intersection)),
      queryVector,
      targetVector
    }
  };
}

/**
 * Finds the highest scoring FAQ matching a user's question.
 */
export function findBestMatch(userQuery: string, faqs: FAQItem[]): {
  bestMatch: MatchScore | null;
  allMatches: MatchScore[];
} {
  const allMatches: MatchScore[] = faqs.map(faq => {
    const simResult = calculateCosineSimilarity(userQuery, faq.question);
    return {
      faqId: faq.id,
      question: faq.question,
      score: simResult.score,
      explanation: {
        queryTokens: simResult.explanation.queryTokens,
        faqTokens: simResult.explanation.targetTokens,
        intersection: simResult.explanation.intersection,
        queryVector: simResult.explanation.queryVector,
        faqVector: simResult.explanation.targetVector
      }
    };
  });

  // Sort matches descending by similarity score
  allMatches.sort((a, b) => b.score - a.score);

  const bestMatch = allMatches.length > 0 && allMatches[0].score > 0 ? allMatches[0] : null;

  return {
    bestMatch,
    allMatches
  };
}
