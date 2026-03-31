import { RANK_VALUE_MAP, RANKS, SUITS } from '../../constants/cards.js';
<<<<<<< HEAD
import type { ActiveGame, Card } from './game.types.js';
=======
import type { Card, ParsedGame } from './game.types.js';
>>>>>>> 1a4f7cf7ed0d4ff6e04d0ef79595626f860d4465

export const buildDeck = (): Card[] => {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, value: RANK_VALUE_MAP[rank] });
    }
  }

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];

  for (let currentIndex = shuffled.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex]!, shuffled[currentIndex]!];
  }

  return shuffled;
};

<<<<<<< HEAD
export const summarizeGame = (game: ActiveGame) => {
=======
export const summarizeGame = (game: ParsedGame) => {
>>>>>>> 1a4f7cf7ed0d4ff6e04d0ef79595626f860d4465
  return {
    id: game.id,
    roundCount: game.roundCount,
    playerCardCount: game.playerDeck.length,
    computerCardCount: game.computerDeck.length,
    status: game.status,
    lastRoundResult: game.lastRoundResult,
    finishedAt: game.finishedAt,
    createdAt: game.createdAt,
  };
};
