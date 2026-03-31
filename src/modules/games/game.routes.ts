import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { create, current, flip, getById, history } from './game.controller.js';

export const gameRouter = Router();

gameRouter.use(requireAuth);
gameRouter.post('/', create);
gameRouter.get('/current', current);
gameRouter.get('/history', history);
gameRouter.get('/:id', getById);
gameRouter.post('/:id/flip', flip);
