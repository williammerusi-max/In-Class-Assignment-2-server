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
