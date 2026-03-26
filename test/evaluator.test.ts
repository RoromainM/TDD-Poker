import { describe, expect, it } from 'vitest';
import { evaluateHand } from '../src/evaluator.js';
import { Card, HandCategory, Rank, Suit } from '../src/types.js';

const c = (rank: Rank, suit: Suit): Card => ({ rank, suit });

describe('evaluateHand', () => {
  describe('HIGH_CARD', () => {
    it('detects high card hand', () => {
      const hand = [c('A', 'H'), c('K', 'D'), c('Q', 'C'), c('J', 'S'), c('9', 'H')];
      const result = evaluateHand(hand);
      expect(result.category).toBe(HandCategory.HIGH_CARD);
    });

    it('tiebreakers are sorted descending', () => {
      const hand = [c('9', 'H'), c('K', 'D'), c('A', 'C'), c('J', 'S'), c('Q', 'H')];
      const result = evaluateHand(hand);
      expect(result.tieBreakers).toEqual([14, 13, 12, 11, 9]);
    });
  });

  describe('ONE_PAIR', () => {
    it('detects one pair', () => {
      const hand = [c('A', 'H'), c('A', 'D'), c('K', 'C'), c('Q', 'S'), c('J', 'H')];
      const result = evaluateHand(hand);
      expect(result.category).toBe(HandCategory.ONE_PAIR);
    });

    it('tiebreaker starts with pair rank then kickers descending', () => {
      const hand = [c('A', 'H'), c('A', 'D'), c('K', 'C'), c('Q', 'S'), c('J', 'H')];
      const result = evaluateHand(hand);
      expect(result.tieBreakers).toEqual([14, 13, 12, 11]);
    });

    it('lower pair loses to higher pair', () => {
      const lowPair = evaluateHand([c('2', 'H'), c('2', 'D'), c('K', 'C'), c('Q', 'S'), c('J', 'H')]);
      const highPair = evaluateHand([c('A', 'H'), c('A', 'D'), c('3', 'C'), c('4', 'S'), c('5', 'H')]);
      expect(highPair.tieBreakers[0]).toBeGreaterThan(lowPair.tieBreakers[0]);
    });
  });
});
