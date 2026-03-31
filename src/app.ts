import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { gameRouter } from './modules/games/game.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';

export const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
  }),
);
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({ message: 'Server is healthy.' });
});

app.use('/api/auth', authRouter);
app.use('/api/games', gameRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
