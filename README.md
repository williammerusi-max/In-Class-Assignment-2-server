# In-Class Assignment 2 Server

Express + TypeScript server for the War card game assignment.

## Features

- strict TypeScript setup
- student registration and login
- authenticated game routes
- start a new War game
- play one round at a time
- store finished games in MySQL
- game history by user
- file-based logging with no `console.log()`

## Setup

1. Copy `.env.example` to `.env`
2. Create a MySQL database named `war`
3. Run the SQL in `schema.sql`
4. Install dependencies
5. Start the dev server

```bash
npm install
npm run dev
```

## API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Games
- `POST /api/games`
- `GET /api/games/current`
- `GET /api/games/history`
- `GET /api/games/:id`
- `POST /api/games/:id/flip`


## Database note

This version matches a simplified `games` table with these columns only:

- `gameid`
- `user`
- `rounds`
- `result`
- `datetime`

Because that table stores only finished-game summaries, active in-progress game state is kept in server memory until the game ends. When a match finishes, the summary is inserted into the database.
