import { evaluateHand } from "./evaluator.js";
import { Card } from "./types.js";

export function compareHands(a: Card[], b: Card[]): number {
  const firstHand = evaluateHand(a);
  const secondHand = evaluateHand(b);

  if (firstHand.category !== secondHand.category) {
    return Math.sign(firstHand.category - secondHand.category);
  }

  const maxLen = Math.max(firstHand.tieBreakers.length, secondHand.tieBreakers.length);
  for (let i = 0; i < maxLen; i += 1) {
    const firstHandValue = firstHand.tieBreakers[i] ?? 0;
    const secondHandValue = secondHand.tieBreakers[i] ?? 0;
    if (firstHandValue !== secondHandValue) {
      return Math.sign(firstHandValue - secondHandValue);
    }
  }

  return 0;
}
