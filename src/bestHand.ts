import { compareHands } from "./comparator.js";
import { evaluateHand } from "./evaluator.js";
import { Card, HandResult } from "./types.js";

export interface BestHandResult {
  cards: Card[];
  result: HandResult;
}

function combinationsOfFive(cards: Card[]): Card[][] {
  const targetSize = 5;
  const combinations: Card[][] = [];
  const current: Card[] = [];

  function backtrack(start: number): void {
    if (current.length === targetSize) {
      combinations.push([...current]);
      return;
    }

    const remainingNeeded = targetSize - current.length;
    for (let i = start; i <= cards.length - remainingNeeded; i += 1) {
      current.push(cards[i]);
      backtrack(i + 1);
      current.pop();
    }
  }

  backtrack(0);

  return combinations;
}

export function bestHandResult(cards: Card[]): BestHandResult {
  if (cards.length !== 7) {
    throw new Error("bestHand expects exactly 7 cards");
  }

  const allCombinations = combinationsOfFive(cards).map((combo) => ({
    cards: combo,
    result: evaluateHand(combo),
  }));

  if (allCombinations.length !== 21) {
    throw new Error("Internal error: expected 21 combinations from 7 cards");
  }

  let best = allCombinations[0];

  for (let i = 1; i < allCombinations.length; i += 1) {
    const candidate = allCombinations[i];
    if (compareHands(candidate.cards, best.cards) > 0) {
      best = candidate;
    }
  }

  return best;
}

export function bestHand(cards: Card[]): Card[] {
  return bestHandResult(cards).cards;
}
