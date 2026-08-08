import { Category, ItemStatus, LostFoundItem, SmartMatchPair } from '../types';

export const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'School Supplies',
  'Accessories',
  'Sports Equipment',
  'Other'
];

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string; accent: string; dot: string }> = {
  Electronics: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    accent: 'bg-indigo-600',
    dot: 'bg-indigo-500'
  },
  Clothing: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    accent: 'bg-rose-600',
    dot: 'bg-rose-500'
  },
  'School Supplies': {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    accent: 'bg-slate-800',
    dot: 'bg-slate-600'
  },
  Accessories: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    accent: 'bg-amber-600',
    dot: 'bg-amber-500'
  },
  'Sports Equipment': {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    accent: 'bg-blue-600',
    dot: 'bg-blue-500'
  },
  Other: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    accent: 'bg-emerald-600',
    dot: 'bg-emerald-500'
  }
};

export const STATUS_STYLES: Record<ItemStatus, { bg: string; text: string; label: string }> = {
  Found: {
    bg: 'bg-emerald-100 border border-emerald-200',
    text: 'text-emerald-800',
    label: 'FOUND'
  },
  Lost: {
    bg: 'bg-red-100 border border-red-200',
    text: 'text-red-700',
    label: 'LOST'
  },
  Returned: {
    bg: 'bg-slate-200 border border-slate-300',
    text: 'text-slate-600',
    label: 'RETURNED'
  }
};

// Calculate smart match similarity between a lost item and a found item
export function calculateSmartMatches(items: LostFoundItem[]): SmartMatchPair[] {
  const lostItems = items.filter(i => i.status === 'Lost');
  const foundItems = items.filter(i => i.status === 'Found');
  const matches: SmartMatchPair[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      let score = 0;
      const reasons: string[] = [];

      // 1. Same category (35 points)
      if (lost.category === found.category) {
        score += 35;
        reasons.push(`Matching category (${lost.category})`);
      }

      // 2. Keyword overlap in titles & descriptions (up to 35 points)
      const lostWords = `${lost.title} ${lost.description} ${lost.color || ''}`
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(w => w.length > 3);

      const foundText = `${found.title} ${found.description} ${found.color || ''}`.toLowerCase();

      let matchedWordsCount = 0;
      for (const word of lostWords) {
        if (foundText.includes(word)) {
          matchedWordsCount++;
        }
      }

      if (matchedWordsCount > 0) {
        const keywordScore = Math.min(35, matchedWordsCount * 12);
        score += keywordScore;
        reasons.push(`${matchedWordsCount} matching keywords`);
      }

      // 3. Location / spot proximity (20 points)
      if (lost.spot === found.spot) {
        score += 20;
        reasons.push(`Same facility area (${lost.spot})`);
      } else if (
        lost.location.toLowerCase().includes(found.spot.toLowerCase()) ||
        found.location.toLowerCase().includes(lost.spot.toLowerCase())
      ) {
        score += 10;
        reasons.push(`Nearby location match`);
      }

      // 4. Color match (10 points)
      if (lost.color && found.color && lost.color.toLowerCase() === found.color.toLowerCase()) {
        score += 10;
        reasons.push(`Same color tag (${lost.color})`);
      }

      // If confidence score >= 35, record match
      if (score >= 35) {
        matches.push({
          lostItem: lost,
          foundItem: found,
          confidenceScore: Math.min(98, score),
          matchReasons: reasons
        });
      }
    }
  }

  // Sort by highest confidence score
  return matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
}

export function formatRelativeTime(dateIso: string): string {
  try {
    const diffMs = new Date().getTime() - new Date(dateIso).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return new Date(dateIso).toLocaleDateString();
  } catch {
    return 'Recently';
  }
}
