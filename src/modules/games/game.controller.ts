import type { Response } from 'express';
import { logger } from '../../config/logger.js';
import type { AuthenticatedRequest } from '../../shared/types/express.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { HttpError } from '../../shared/utils/httpError.js';
import { getCurrentGame, getGameById, getGameHistory, playRound, startNewGame } from './game.service.js';

const parseGameId = (rawGameId: string | undefined): number => {
  const gameId = Number(rawGameId);

  if (!Number.isInteger(gameId) || gameId <= 0) {
    throw new HttpError(400, 'Game id must be a positive number.');
  }

  return gameId;
};

export const create = asyncHandler(async (request: AuthenticatedRequest, response: Response) => {
  const game = await startNewGame(request.user!.userId);
  logger.info('New game started', { userId: request.user!.userId, gameId: game.id });
  response.status(201).json(game);
});

export const current = asyncHandler(async (request: AuthenticatedRequest, response: Response) => {
  const game = await getCurrentGame(request.user!.userId);
  response.status(200).json(game);
});

export const getById = asyncHandler(async (request: AuthenticatedRequest, response: Response) => {
  const gameId = parseGameId(request.params.id);
  const game = await getGameById(request.user!.userId, gameId);
  response.status(200).json(game);
});

export const flip = asyncHandler(async (request: AuthenticatedRequest, response: Response) => {
  const gameId = parseGameId(request.params.id);
  const roundResult = await playRound(request.user!.userId, gameId);

  logger.info('Round played', {
    userId: request.user!.userId,
    gameId,
    roundCount: roundResult.roundCount,
    status: roundResult.status,
  });

  response.status(200).json(roundResult);
});

export const history = asyncHandler(async (request: AuthenticatedRequest, response: Response) => {
  const results = await getGameHistory(request.user!.userId);
  response.status(200).json(results);
});
