import { bestHandResult } from "./bestHand.js";
import { compareHands } from "./comparator.js";
import { Card } from "./types.js";

export interface Player {
  name: string;
  cards: Card[];
}

export interface GameResult {
  winners: string[];
  tie: boolean;
}

export function determineWinners(board: Card[], players: Player[]): GameResult {
  const playerResults = players.map((player) => ({
    name: player.name,
    bestHand: bestHandResult([...player.cards, ...board]).chosen5,
  }));

  let winners = [playerResults[0]];

  for (let i = 1; i < playerResults.length; i++) {
    const cmp = compareHands(playerResults[i].bestHand, winners[0].bestHand);
    if (cmp > 0) {
      winners = [playerResults[i]];
    } else if (cmp === 0) {
      winners.push(playerResults[i]);
    }
  }

  return {
    winners: winners.map((w) => w.name),
    tie: winners.length > 1,
  };
}
