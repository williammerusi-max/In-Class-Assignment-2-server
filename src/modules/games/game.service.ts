import { HttpError } from '../../shared/utils/httpError.js';
import { buildDeck, shuffleDeck, summarizeGame } from './game.utils.js';
import {
<<<<<<< HEAD
  createActiveGame,
  findCurrentGameForUser,
  findGameById,
  findGameHistoryByUserId,
  removeActiveGame,
  saveFinishedGame,
  updateActiveGame,
} from './game.repository.js';
import type { ActiveGame, Card, FlipRoundResponse } from './game.types.js';
=======
  createGame,
  findCurrentGameForUser,
  findGameById,
  findGameHistoryByUserId,
  updateGame,
} from './game.repository.js';
import type { Card, FlipRoundResponse, ParsedGame } from './game.types.js';
>>>>>>> 1a4f7cf7ed0d4ff6e04d0ef79595626f860d4465

interface BattleResult {
  winner: 'PLAYER' | 'COMPUTER';
  pot: Card[];
  playerFaceUpCard: Card;
  computerFaceUpCard: Card;
  message: string;
}

const drawCard = (deck: Card[]): Card => {
  const card = deck.shift();

  if (!card) {
    throw new Error('Attempted to draw a card from an empty deck.');
  }

  return card;
};

const resolveBattle = (playerDeck: Card[], computerDeck: Card[]): BattleResult => {
  if (playerDeck.length === 0) {
    throw new HttpError(400, 'The player deck is empty.');
  }

  if (computerDeck.length === 0) {
    throw new HttpError(400, 'The computer deck is empty.');
  }

  const pot: Card[] = [];
  let playerFaceUpCard = drawCard(playerDeck);
  let computerFaceUpCard = drawCard(computerDeck);
  pot.push(playerFaceUpCard, computerFaceUpCard);

  while (playerFaceUpCard.value === computerFaceUpCard.value) {
    if (playerDeck.length < 2) {
      return {
        winner: 'COMPUTER',
        pot: [...pot, ...playerDeck.splice(0, playerDeck.length)],
        playerFaceUpCard,
        computerFaceUpCard,
        message: 'WAR! Player ran out of cards during the war.',
      };
    }

    if (computerDeck.length < 2) {
      return {
        winner: 'PLAYER',
        pot: [...pot, ...computerDeck.splice(0, computerDeck.length)],
        playerFaceUpCard,
        computerFaceUpCard,
        message: 'WAR! Computer ran out of cards during the war.',
      };
    }

    pot.push(drawCard(playerDeck));
    pot.push(drawCard(computerDeck));

    playerFaceUpCard = drawCard(playerDeck);
    computerFaceUpCard = drawCard(computerDeck);
    pot.push(playerFaceUpCard, computerFaceUpCard);
  }

  if (playerFaceUpCard.value > computerFaceUpCard.value) {
    return {
      winner: 'PLAYER',
      pot,
      playerFaceUpCard,
      computerFaceUpCard,
      message: pot.length > 2 ? 'WAR resolved. Player won the war.' : 'Player won the round.',
    };
  }

  return {
    winner: 'COMPUTER',
    pot,
    playerFaceUpCard,
    computerFaceUpCard,
    message: pot.length > 2 ? 'WAR resolved. Computer won the war.' : 'Computer won the round.',
  };
};

<<<<<<< HEAD
const finishGameIfNeeded = (game: ActiveGame): void => {
=======
const finishGameIfNeeded = (game: ParsedGame): void => {
>>>>>>> 1a4f7cf7ed0d4ff6e04d0ef79595626f860d4465
  if (game.playerDeck.length === 52 || game.computerDeck.length === 0) {
    game.status = 'PLAYER_WON';
    game.finishedAt = new Date();
  } else if (game.computerDeck.length === 52 || game.playerDeck.length === 0) {
    game.status = 'COMPUTER_WON';
    game.finishedAt = new Date();
  }
};

export const startNewGame = async (userId: number) => {
  const existingGame = await findCurrentGameForUser(userId);

  if (existingGame) {
    throw new HttpError(409, 'Finish the current game before starting a new one.');
  }

  const shuffledDeck = shuffleDeck(buildDeck());
  const playerDeck = shuffledDeck.slice(0, 26);
  const computerDeck = shuffledDeck.slice(26);
<<<<<<< HEAD
  const newGame = await createActiveGame(userId, playerDeck, computerDeck);
=======
  const newGame = await createGame(userId, playerDeck, computerDeck);
>>>>>>> 1a4f7cf7ed0d4ff6e04d0ef79595626f860d4465

  return summarizeGame(newGame);
};

export const getCurrentGame = async (userId: number) => {
  const currentGame = await findCurrentGameForUser(userId);

  if (!currentGame) {
    throw new HttpError(404, 'No active game was found for this user.');
  }

  return summarizeGame(currentGame);
};

export const getGameById = async (userId: number, gameId: number) => {
  const game = await findGameById(gameId, userId);

  if (!game) {
    throw new HttpError(404, 'Game not found.');
  }

  return summarizeGame(game);
};

export const playRound = async (userId: number, gameId: number): Promise<FlipRoundResponse> => {
  const game = await findGameById(gameId, userId);

  if (!game) {
    throw new HttpError(404, 'Game not found.');
  }

  if (game.status !== 'IN_PROGRESS') {
    throw new HttpError(400, 'This game has already finished.');
  }

  const battleResult = resolveBattle(game.playerDeck, game.computerDeck);

  if (battleResult.winner === 'PLAYER') {
    game.playerDeck.push(...battleResult.pot);
  } else {
    game.computerDeck.push(...battleResult.pot);
  }

  game.roundCount += 1;
  game.lastRoundResult = battleResult.message;
  finishGameIfNeeded(game);

<<<<<<< HEAD
  if (game.status === 'IN_PROGRESS') {
    await updateActiveGame(game);
  } else {
    const savedGameId = await saveFinishedGame(game);
    game.id = savedGameId;
    await removeActiveGame(userId);
  }
=======
  await updateGame(game);
>>>>>>> 1a4f7cf7ed0d4ff6e04d0ef79595626f860d4465

  return {
    ...summarizeGame(game),
    playerFaceUpCard: battleResult.playerFaceUpCard,
    computerFaceUpCard: battleResult.computerFaceUpCard,
  };
};

export const getGameHistory = async (userId: number) => {
  return findGameHistoryByUserId(userId);
};
