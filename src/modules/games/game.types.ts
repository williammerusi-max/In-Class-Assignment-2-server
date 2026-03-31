export type Suit = 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type GameStatus = 'IN_PROGRESS' | 'PLAYER_WON' | 'COMPUTER_WON';
export type RoundWinner = 'PLAYER' | 'COMPUTER' | 'WAR_TIE';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface GameRecord {
  id: number;
  user_id: number;
  player_deck: string;
  computer_deck: string;
  round_count: number;
  status: GameStatus;
  last_round_result: string | null;
  finished_at: Date | null;
  created_at: Date;
}

export interface ParsedGame {
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
  id: number;
  roundCount: number;
  status: GameStatus;
  finishedAt: Date | null;
  createdAt: Date;
}
