import { evaluateHand } from './evaluator.js';
import { Card } from './types.js';

export function compareHands(a: Card[], b: Card[]): number {
  const left = evaluateHand(a);
  const right = evaluateHand(b);

  if (left.category !== right.category) {
    return Math.sign(left.category - right.category);
  }

  const maxLen = Math.max(left.tieBreakers.length, right.tieBreakers.length);
  for (let i = 0; i < maxLen; i += 1) {
    const leftValue = left.tieBreakers[i] ?? 0;
    const rightValue = right.tieBreakers[i] ?? 0;
    if (leftValue !== rightValue) {
      return Math.sign(leftValue - rightValue);
    }
  }

  return 0;
}
