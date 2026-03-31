export type Suit = 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type GameStatus = 'IN_PROGRESS' | 'PLAYER_WON' | 'COMPUTER_WON';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface FinishedGameRecord {
  gameid: number;
  user: number;
  rounds: number;
  result: 'PLAYER_WON' | 'COMPUTER_WON';
  datetime: Date;
}

export interface ActiveGame {
  id: number;
  userId: number;
  playerDeck: Card[];
  computerDeck: Card[];
  roundCount: number;
  status: GameStatus;
  lastRoundResult: string | null;
  finishedAt: Date | null;
  createdAt: Date;
}

export interface GameSummary {
  id: number;
  roundCount: number;
  playerCardCount: number;
  computerCardCount: number;
  status: GameStatus;
  lastRoundResult: string | null;
  finishedAt: Date | null;
  createdAt: Date;
}

export interface FlipRoundResponse extends GameSummary {
  playerFaceUpCard: Card | null;
  computerFaceUpCard: Card | null;
}

export interface GameHistoryItem {
  gameId: number;
  user: number;
  rounds: number;
  result: 'PLAYER_WON' | 'COMPUTER_WON';
  datetime: Date;
}
