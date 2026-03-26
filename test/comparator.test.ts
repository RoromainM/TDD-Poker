import { describe, expect, it } from "vitest";
import { compareHands } from "../src/comparator.js";
import { Card, Rank, Suit } from "../src/types.js";

const c = (rank: Rank, suit: Suit): Card => ({ rank, suit });

describe("compareHands", () => {
  it("returns positive when first hand has a stronger category", () => {
    const straight = [
      c("9", "H"),
      c("8", "D"),
      c("7", "C"),
      c("6", "S"),
      c("5", "H"),
    ];
    const onePair = [
      c("A", "H"),
      c("A", "D"),
      c("K", "C"),
      c("Q", "S"),
      c("J", "H"),
    ];

    expect(compareHands(straight, onePair)).toBeGreaterThan(0);
    expect(compareHands(onePair, straight)).toBeLessThan(0);
  });

  it("returns negative when second hand has a stronger category", () => {
    const flush = [
      c("A", "H"),
      c("K", "H"),
      c("Q", "H"),
      c("J", "H"),
      c("9", "H"),
    ];
    const onePair = [
      c("A", "H"),
      c("A", "D"),
      c("K", "C"),
      c("Q", "S"),
      c("J", "H"),
    ];

    expect(compareHands(flush, onePair)).toBeGreaterThan(0);
    expect(compareHands(onePair, flush)).toBeLessThan(0);
  });

  it("uses tie-breakers when categories are identical", () => {
    const pairOfAces = [
      c("A", "H"),
      c("A", "D"),
      c("K", "C"),
      c("Q", "S"),
      c("J", "H"),
    ];
    const pairOfKings = [
      c("K", "H"),
      c("K", "D"),
      c("A", "C"),
      c("Q", "S"),
      c("J", "H"),
    ];

    expect(compareHands(pairOfAces, pairOfKings)).toBeGreaterThan(0);
    expect(compareHands(pairOfKings, pairOfAces)).toBeLessThan(0);
  });
});
