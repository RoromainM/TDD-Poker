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
  // Sort by count desc, then rank desc (ensures consistent tiebreaker ordering)
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
}

function isFlush(cards: Card[]): boolean {
  return cards.every(c => c.suit === cards[0].suit);
}

function isStraight(values: number[]): boolean {
  if (new Set(values).size !== 5) return false;
  // Normal straight: consecutive values
  if (values[0] - values[4] === 4) return true;
  // A-low straight: A-2-3-4-5
  return values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2;
}

function straightHighCard(values: number[]): number {
  if (values[0] === 14 && values[1] === 5) return 5;
  return values[0];
}

export function evaluateHand(cards: Card[]): HandResult {
  const values = sortedValues(cards);
  const grouped = groupByRank(cards);
  const counts = grouped.map(([, c]) => c);
  const flush = isFlush(cards);
  const straight = isStraight(values);

  if (straight && flush) {
    return { category: HandCategory.STRAIGHT_FLUSH, tieBreakers: [straightHighCard(values)] };
  }

  if (counts[0] === 4) {
    const quadRank = grouped[0][0];
    const kicker = grouped[1][0];
    return { category: HandCategory.FOUR_OF_A_KIND, tieBreakers: [quadRank, kicker] };
  }

  if (counts[0] === 3 && counts[1] === 2) {
    const tripRank = grouped[0][0];
    const pairRank = grouped[1][0];
    return { category: HandCategory.FULL_HOUSE, tieBreakers: [tripRank, pairRank] };
  }

  if (flush) {
    return { category: HandCategory.FLUSH, tieBreakers: values };
  }

  if (straight) {
    return { category: HandCategory.STRAIGHT, tieBreakers: [straightHighCard(values)] };
  }

  if (counts[0] === 3) {
    const tripRank = grouped[0][0];
    const kickers = grouped.slice(1).map(([v]) => v);
    return { category: HandCategory.THREE_OF_A_KIND, tieBreakers: [tripRank, ...kickers] };
  }

  if (counts[0] === 2 && counts[1] === 2) {
    const highPair = grouped[0][0];
    const lowPair = grouped[1][0];
    const kicker = grouped[2][0];
    return { category: HandCategory.TWO_PAIR, tieBreakers: [highPair, lowPair, kicker] };
  }

  if (counts[0] === 2) {
    const pairRank = grouped[0][0];
    const kickers = grouped.slice(1).map(([v]) => v);
    return { category: HandCategory.ONE_PAIR, tieBreakers: [pairRank, ...kickers] };
  }

  return { category: HandCategory.HIGH_CARD, tieBreakers: values };
}
