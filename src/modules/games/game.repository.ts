import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../../config/db.js';
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
    [userId],
  );

  return rows.map((row) => ({
    gameId: row.gameid,
    user: row.user,
    rounds: row.rounds,
    result: row.result,
    datetime: row.datetime,
  }));
};
