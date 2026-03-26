import { describe, expect, it } from "vitest";
import { evaluateHand } from "../src/evaluator.js";
import { Card, HandCategory, Rank, Suit } from "../src/types.js";

const c = (rank: Rank, suit: Suit): Card => ({ rank, suit });

describe("evaluateHand", () => {
  describe("HIGH_CARD", () => {
    it("detects high card hand", () => {
      const hand = [
        c("A", "H"),
        c("K", "D"),
        c("Q", "C"),
        c("J", "S"),
        c("9", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.HIGH_CARD);
    });

    it("tiebreakers are sorted descending", () => {
      const hand = [
        c("9", "H"),
        c("K", "D"),
        c("A", "C"),
        c("J", "S"),
        c("Q", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([14, 13, 12, 11, 9]);
    });
  });

  describe("ONE_PAIR", () => {
    it("detects one pair", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("K", "C"),
        c("Q", "S"),
        c("J", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.ONE_PAIR);
    });

    it("tiebreaker: pair rank then kickers descending", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("K", "C"),
        c("Q", "S"),
        c("J", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([14, 13, 12, 11]);
    });

    it("lower pair loses to higher pair via tiebreaker", () => {
      const lowPair = evaluateHand([
        c("2", "H"),
        c("2", "D"),
        c("K", "C"),
        c("Q", "S"),
        c("J", "H"),
      ]);
      const highPair = evaluateHand([
        c("A", "H"),
        c("A", "D"),
        c("3", "C"),
        c("4", "S"),
        c("5", "H"),
      ]);
      expect(highPair.tieBreakers[0]).toBeGreaterThan(lowPair.tieBreakers[0]);
    });
  });

  describe("TWO_PAIR", () => {
    it("detects two pair", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("K", "C"),
        c("K", "S"),
        c("J", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.TWO_PAIR);
    });

    it("tiebreaker: high pair, low pair, kicker", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("K", "C"),
        c("K", "S"),
        c("J", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([14, 13, 11]);
    });
  });

  describe("THREE_OF_A_KIND", () => {
    it("detects three of a kind", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("A", "C"),
        c("K", "S"),
        c("J", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    it("tiebreaker: triplet rank then kickers descending", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("A", "C"),
        c("K", "S"),
        c("J", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([14, 13, 11]);
    });
  });

  describe("STRAIGHT", () => {
    it("detects straight", () => {
      const hand = [
        c("9", "H"),
        c("8", "D"),
        c("7", "C"),
        c("6", "S"),
        c("5", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.STRAIGHT);
    });

    it("tiebreaker is the high card of the straight", () => {
      const hand = [
        c("9", "H"),
        c("8", "D"),
        c("7", "C"),
        c("6", "S"),
        c("5", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([9]);
    });

    it("detects A-low straight (wheel: A-2-3-4-5)", () => {
      const hand = [
        c("A", "H"),
        c("2", "D"),
        c("3", "C"),
        c("4", "S"),
        c("5", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.STRAIGHT);
    });

    it("A-low straight high card is 5, not 14", () => {
      const hand = [
        c("A", "H"),
        c("2", "D"),
        c("3", "C"),
        c("4", "S"),
        c("5", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([5]);
    });
  });

  describe("FLUSH", () => {
    it("detects flush", () => {
      const hand = [
        c("A", "H"),
        c("K", "H"),
        c("Q", "H"),
        c("J", "H"),
        c("9", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.FLUSH);
    });

    it("tiebreaker: all values sorted descending", () => {
      const hand = [
        c("A", "H"),
        c("K", "H"),
        c("Q", "H"),
        c("J", "H"),
        c("9", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([14, 13, 12, 11, 9]);
    });
  });

  describe("FULL_HOUSE", () => {
    it("detects full house", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("A", "C"),
        c("K", "S"),
        c("K", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.FULL_HOUSE);
    });

    it("tiebreaker: triplet rank then pair rank", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("A", "C"),
        c("K", "S"),
        c("K", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([14, 13]);
    });

    it("full house beats flush", () => {
      expect(HandCategory.FULL_HOUSE).toBeGreaterThan(HandCategory.FLUSH);
    });
  });

  describe("FOUR_OF_A_KIND", () => {
    it("detects four of a kind", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("A", "C"),
        c("A", "S"),
        c("K", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.FOUR_OF_A_KIND);
    });

    it("tiebreaker: quad rank then kicker", () => {
      const hand = [
        c("A", "H"),
        c("A", "D"),
        c("A", "C"),
        c("A", "S"),
        c("K", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([14, 13]);
    });
  });

  describe("STRAIGHT_FLUSH", () => {
    it("detects straight flush", () => {
      const hand = [
        c("9", "H"),
        c("8", "H"),
        c("7", "H"),
        c("6", "H"),
        c("5", "H"),
      ];
      expect(evaluateHand(hand).category).toBe(HandCategory.STRAIGHT_FLUSH);
    });

    it("tiebreaker is the high card", () => {
      const hand = [
        c("9", "H"),
        c("8", "H"),
        c("7", "H"),
        c("6", "H"),
        c("5", "H"),
      ];
      expect(evaluateHand(hand).tieBreakers).toEqual([9]);
    });

    it("royal flush (A-high straight flush)", () => {
      const hand = [
        c("A", "S"),
        c("K", "S"),
        c("Q", "S"),
        c("J", "S"),
        c("T", "S"),
      ];
      const result = evaluateHand(hand);
      expect(result.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(result.tieBreakers).toEqual([14]);
    });
  });

  describe("category ordering", () => {
    it("straight flush > four of a kind > full house > flush > straight > three > two pair > pair > high card", () => {
      expect(HandCategory.STRAIGHT_FLUSH).toBeGreaterThan(
        HandCategory.FOUR_OF_A_KIND,
      );
      expect(HandCategory.FOUR_OF_A_KIND).toBeGreaterThan(
        HandCategory.FULL_HOUSE,
      );
      expect(HandCategory.FULL_HOUSE).toBeGreaterThan(HandCategory.FLUSH);
      expect(HandCategory.FLUSH).toBeGreaterThan(HandCategory.STRAIGHT);
      expect(HandCategory.STRAIGHT).toBeGreaterThan(
        HandCategory.THREE_OF_A_KIND,
      );
      expect(HandCategory.THREE_OF_A_KIND).toBeGreaterThan(
        HandCategory.TWO_PAIR,
      );
      expect(HandCategory.TWO_PAIR).toBeGreaterThan(HandCategory.ONE_PAIR);
      expect(HandCategory.ONE_PAIR).toBeGreaterThan(HandCategory.HIGH_CARD);
    });
  });
});
