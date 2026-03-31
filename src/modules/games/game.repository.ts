import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../../config/db.js';
<<<<<<< HEAD
import type { ActiveGame, FinishedGameRecord, GameHistoryItem } from './game.types.js';

interface FinishedGameRow extends FinishedGameRecord, RowDataPacket {}

const activeGamesByUserId = new Map<number, ActiveGame>();
let nextActiveGameId = 1;

export const createActiveGame = async (userId: number, playerDeck: ActiveGame['playerDeck'], computerDeck: ActiveGame['computerDeck']): Promise<ActiveGame> => {
  const game: ActiveGame = {
    id: nextActiveGameId,
    userId,
    playerDeck: [...playerDeck],
    computerDeck: [...computerDeck],
    roundCount: 0,
    status: 'IN_PROGRESS',
    lastRoundResult: null,
    finishedAt: null,
    createdAt: new Date(),
  };

  nextActiveGameId += 1;
  activeGamesByUserId.set(userId, game);

  return game;
};

export const findCurrentGameForUser = async (userId: number): Promise<ActiveGame | null> => {
  return activeGamesByUserId.get(userId) ?? null;
};

export const findGameById = async (gameId: number, userId: number): Promise<ActiveGame | null> => {
  const game = activeGamesByUserId.get(userId);

  if (!game || game.id !== gameId) {
    return null;
  }

  return game;
};

export const updateActiveGame = async (game: ActiveGame): Promise<void> => {
  activeGamesByUserId.set(game.userId, game);
};

export const removeActiveGame = async (userId: number): Promise<void> => {
  activeGamesByUserId.delete(userId);
};

export const saveFinishedGame = async (game: ActiveGame): Promise<number> => {
  const resultValue = game.status === 'PLAYER_WON' ? 'PLAYER_WON' : 'COMPUTER_WON';
  const finishedAt = game.finishedAt ?? new Date();

  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO games (`user`, rounds, result, datetime) VALUES (?, ?, ?, ?)',
    [game.userId, game.roundCount, resultValue, finishedAt],
  );

  return result.insertId;
};

export const findGameHistoryByUserId = async (userId: number): Promise<GameHistoryItem[]> => {
  const [rows] = await db.execute<FinishedGameRow[]>(
    'SELECT gameid, `user`, rounds, result, datetime FROM games WHERE `user` = ? ORDER BY datetime DESC, gameid DESC',
=======
import type { Card, GameHistoryItem, GameRecord, ParsedGame } from './game.types.js';

interface GameRow extends GameRecord, RowDataPacket {}

const parseDeck = (jsonValue: string): Card[] => {
  const parsed = JSON.parse(jsonValue) as Card[];
  return parsed;
};

const parseGameRecord = (record: GameRecord): ParsedGame => {
  return {
    id: record.id,
    userId: record.user_id,
    playerDeck: parseDeck(record.player_deck),
    computerDeck: parseDeck(record.computer_deck),
    roundCount: record.round_count,
    status: record.status,
    lastRoundResult: record.last_round_result,
    finishedAt: record.finished_at,
    createdAt: record.created_at,
  };
};

export const createGame = async (userId: number, playerDeck: Card[], computerDeck: Card[]): Promise<ParsedGame> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO games (user_id, player_deck, computer_deck, round_count, status, last_round_result, finished_at)
     VALUES (?, ?, ?, 0, 'IN_PROGRESS', NULL, NULL)`,
    [userId, JSON.stringify(playerDeck), JSON.stringify(computerDeck)],
  );

  const createdGame = await findGameById(result.insertId, userId);

  if (!createdGame) {
    throw new Error('Failed to load newly created game.');
  }

  return createdGame;
};

export const findGameById = async (gameId: number, userId: number): Promise<ParsedGame | null> => {
  const [rows] = await db.execute<GameRow[]>(
    `SELECT id, user_id, player_deck, computer_deck, round_count, status, last_round_result, finished_at, created_at
     FROM games WHERE id = ? AND user_id = ? LIMIT 1`,
    [gameId, userId],
  );

  const game = rows[0];
  return game ? parseGameRecord(game) : null;
};

export const findCurrentGameForUser = async (userId: number): Promise<ParsedGame | null> => {
  const [rows] = await db.execute<GameRow[]>(
    `SELECT id, user_id, player_deck, computer_deck, round_count, status, last_round_result, finished_at, created_at
     FROM games WHERE user_id = ? AND status = 'IN_PROGRESS' ORDER BY created_at DESC LIMIT 1`,
    [userId],
  );

  const game = rows[0];
  return game ? parseGameRecord(game) : null;
};

export const updateGame = async (game: ParsedGame): Promise<void> => {
  await db.execute(
    `UPDATE games
     SET player_deck = ?, computer_deck = ?, round_count = ?, status = ?, last_round_result = ?, finished_at = ?
     WHERE id = ? AND user_id = ?`,
    [
      JSON.stringify(game.playerDeck),
      JSON.stringify(game.computerDeck),
      game.roundCount,
      game.status,
      game.lastRoundResult,
      game.finishedAt,
      game.id,
      game.userId,
    ],
  );
};

export const findGameHistoryByUserId = async (userId: number): Promise<GameHistoryItem[]> => {
  const [rows] = await db.execute<GameRow[]>(
    `SELECT id, user_id, player_deck, computer_deck, round_count, status, last_round_result, finished_at, created_at
     FROM games WHERE user_id = ? AND status <> 'IN_PROGRESS' ORDER BY finished_at DESC, created_at DESC`,
>>>>>>> 1a4f7cf7ed0d4ff6e04d0ef79595626f860d4465
    [userId],
  );

  return rows.map((row) => ({
<<<<<<< HEAD
    gameId: row.gameid,
    user: row.user,
    rounds: row.rounds,
    result: row.result,
    datetime: row.datetime,
=======
    id: row.id,
    roundCount: row.round_count,
    status: row.status,
    finishedAt: row.finished_at,
    createdAt: row.created_at,
>>>>>>> 1a4f7cf7ed0d4ff6e04d0ef79595626f860d4465
  }));
};
