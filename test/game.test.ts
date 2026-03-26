import { describe, it, expect } from "vitest";
import { determineWinners } from "../src/game.js";
import { Card } from "../src/types.js";

describe("determineWinners", () => {
  it("returns the single winner when one player has a better hand", () => {
    // Board: 7H 8D 9C 2S 3H
    // Alice: AH AC → one pair aces (AA, 9, 8, 7)
    // Bob:   KH KD → one pair kings (KK, 9, 8, 7)
    // Alice wins
    const board: Card[] = [
      { rank: "7", suit: "H" },
      { rank: "8", suit: "D" },
      { rank: "9", suit: "C" },
      { rank: "2", suit: "S" },
      { rank: "3", suit: "H" },
    ];

    const result = determineWinners(board, [
      { name: "Alice", cards: [{ rank: "A", suit: "H" }, { rank: "A", suit: "C" }] },
      { name: "Bob",   cards: [{ rank: "K", suit: "H" }, { rank: "K", suit: "D" }] },
    ]);

    expect(result.winners).toEqual(["Alice"]);
    expect(result.tie).toBe(false);
  });

  it("returns all winners on a tie", () => {
    // Board: AH KD QC JS TH → royal straight on the board
    // Alice: 2H 3D → best hand is A-K-Q-J-T straight
    // Bob:   4H 5D → best hand is A-K-Q-J-T straight
    // Tie
    const board: Card[] = [
      { rank: "A", suit: "H" },
      { rank: "K", suit: "D" },
      { rank: "Q", suit: "C" },
      { rank: "J", suit: "S" },
      { rank: "T", suit: "H" },
    ];

    const result = determineWinners(board, [
      { name: "Alice", cards: [{ rank: "2", suit: "H" }, { rank: "3", suit: "D" }] },
      { name: "Bob",   cards: [{ rank: "4", suit: "H" }, { rank: "5", suit: "D" }] },
    ]);

    expect(result.winners).toEqual(["Alice", "Bob"]);
    expect(result.tie).toBe(true);
  });

  it("kicker decides between two players with the same pair", () => {
    // Board: AH AD 2C 3S 4H
    // Alice: KH 7D → pair of aces, kickers K, 7, 4
    // Bob:   QH JD → pair of aces, kickers Q, J, 4
    // Alice wins via K kicker > Q kicker
    const board: Card[] = [
      { rank: "A", suit: "H" },
      { rank: "A", suit: "D" },
      { rank: "2", suit: "C" },
      { rank: "3", suit: "S" },
      { rank: "4", suit: "H" },
    ];

    const result = determineWinners(board, [
      { name: "Alice", cards: [{ rank: "K", suit: "H" }, { rank: "7", suit: "D" }] },
      { name: "Bob",   cards: [{ rank: "Q", suit: "H" }, { rank: "J", suit: "D" }] },
    ]);

    expect(result.winners).toEqual(["Alice"]);
    expect(result.tie).toBe(false);
  });
});
