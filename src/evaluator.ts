import { Card, HandCategory, HandResult, Rank } from './types.js';

const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};

function rankValue(rank: Rank): number {
  return RANK_VALUES[rank];
}

function sortedValues(cards: Card[]): number[] {
  return cards.map(c => rankValue(c.rank)).sort((a, b) => b - a);
}

function groupByRank(cards: Card[]): [number, number][] {
  const map = new Map<number, number>();
  for (const card of cards) {
    const v = rankValue(card.rank);
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  // Sort by count desc, then rank desc
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
}

export function evaluateHand(cards: Card[]): HandResult {
  const values = sortedValues(cards);
  const grouped = groupByRank(cards);
  const counts = grouped.map(([, c]) => c);

  if (counts[0] === 2) {
    const pairRank = grouped[0][0];
    const kickers = grouped.slice(1).map(([v]) => v);
    return { category: HandCategory.ONE_PAIR, tieBreakers: [pairRank, ...kickers] };
  }

  return { category: HandCategory.HIGH_CARD, tieBreakers: values };
}
