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

    expect(result.chosen5.length).toBe(5);
    expect(result.category).toBe(HandCategory.FULL_HOUSE);
    expect(result.ranks).toEqual([14, 13]);
  });

  it("returns exactly 5 cards in chosen5", () => {
    const cards = [
      c("A", "S"),
      c("K", "S"),
      c("Q", "S"),
      c("J", "S"),
      c("T", "S"),
      c("2", "D"),
      c("3", "C"),
    ];

    const result = bestHandResult(cards);

    expect(result.chosen5).toHaveLength(5);
  });

  it("ensures chosen5 is a subset of the 7 input cards", () => {
    const cards = [
      c("A", "S"),
      c("A", "H"),
      c("K", "D"),
      c("Q", "C"),
      c("J", "S"),
      c("2", "H"),
      c("3", "D"),
    ];

    const result = bestHandResult(cards);
    const inputSet = new Set(cards.map(cardId));

    expect(result.chosen5.every((card) => inputSet.has(cardId(card)))).toBe(
      true,
    );
  });

  it("keeps coherent ranking order in ranks", () => {
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

    expect(result.ranks).toEqual([14, 13]);
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

  it("selects the wheel (A-2-3-4-5) as best hand when no better hand exists", () => {
    // A,2,3,4,5 straight (high card = 5) beats any high card hand
    const cards = [
      c("A", "H"), c("2", "D"), c("3", "C"), c("4", "S"), c("5", "H"),
      c("K", "D"), c("Q", "C"),
    ];

    const result = bestHandResult(cards);

    expect(result.category).toBe(HandCategory.STRAIGHT);
    expect(result.ranks).toEqual([5]);
  });

  it("picks the 5 highest cards when there are 6 cards of the same suit", () => {
    // 6 hearts: A K Q J 9 2 — best flush is A K Q J 9, not A K Q J 2
    const cards = [
      c("A", "H"), c("K", "H"), c("Q", "H"), c("J", "H"), c("9", "H"),
      c("2", "H"), c("3", "D"),
    ];

    const result = bestHandResult(cards);

    expect(result.category).toBe(HandCategory.FLUSH);
    expect(result.ranks).toEqual([14, 13, 12, 11, 9]);
  });
});
