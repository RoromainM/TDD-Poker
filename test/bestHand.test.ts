import { describe, expect, it } from "vitest";
import { bestHand, bestHandResult } from "../src/bestHand.js";
import { evaluateHand } from "../src/evaluator.js";
import { Card, HandCategory, Rank, Suit } from "../src/types.js";

const c = (rank: Rank, suit: Suit): Card => ({ rank, suit });

function cardId(card: Card): string {
  return `${card.rank}${card.suit}`;
}

function sortCards(cards: Card[]): string[] {
  return cards.map(cardId).sort();
}

describe("bestHand", () => {
  it("selects the best 5-card hand out of 7 cards", () => {
    const sevenCards = [
      c("A", "S"),
      c("A", "D"),
      c("K", "H"),
      c("Q", "H"),
      c("J", "H"),
      c("T", "H"),
      c("9", "H"),
    ];

    const best = bestHand(sevenCards);
    const bestEval = evaluateHand(best);

    expect(best.length).toBe(5);
    expect(bestEval.category).toBe(HandCategory.STRAIGHT_FLUSH);
    expect(bestEval.tieBreakers).toEqual([13]);
  });

  it("handles board plays: best hand is entirely on the board", () => {
    const boardPlays = [
      c("A", "H"),
      c("K", "H"),
      c("Q", "H"),
      c("J", "H"),
      c("T", "H"),
      c("2", "C"),
      c("3", "D"),
    ];

    const expectedBoard = [
      c("A", "H"),
      c("K", "H"),
      c("Q", "H"),
      c("J", "H"),
      c("T", "H"),
    ];

    const best = bestHand(boardPlays);

    expect(sortCards(best)).toEqual(sortCards(expectedBoard));
  });

  it("returns both cards and evaluation through bestHandResult", () => {
    const cards = [
      c("A", "S"),
      c("A", "H"),
      c("A", "D"),
      c("K", "C"),
      c("K", "D"),
      c("2", "S"),
      c("3", "S"),
    ];

    const result = bestHandResult(cards);

    expect(result.cards.length).toBe(5);
    expect(result.result.category).toBe(HandCategory.FULL_HOUSE);
    expect(result.result.tieBreakers).toEqual([14, 13]);
  });

  it("throws when input does not contain exactly 7 cards", () => {
    const tooFew = [
      c("A", "S"),
      c("K", "S"),
      c("Q", "S"),
      c("J", "S"),
      c("T", "S"),
      c("9", "S"),
    ];

    expect(() => bestHand(tooFew)).toThrow("bestHand expects exactly 7 cards");
  });
});
