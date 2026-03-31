import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../../config/db.js';
import type { UserRecord } from '../users/user.types.js';

interface UserRow extends UserRecord, RowDataPacket {}

export const findUserByUsername = async (username: string): Promise<UserRecord | null> => {
  const [rows] = await db.execute<UserRow[]>(
    'SELECT id, username, password_hash, created_at FROM users WHERE username = ? LIMIT 1',
    [username],
  );

  return rows[0] ?? null;
};

export const findUserById = async (userId: number): Promise<UserRecord | null> => {
  const [rows] = await db.execute<UserRow[]>(
    'SELECT id, username, password_hash, created_at FROM users WHERE id = ? LIMIT 1',
    [userId],
  );

  return rows[0] ?? null;
};

export const createUser = async (username: string, passwordHash: string): Promise<UserRecord> => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)',
    [username, passwordHash],
  );

  const createdUser = await findUserById(result.insertId);

  if (!createdUser) {
    throw new Error('Failed to load newly created user.');
  }

  return createdUser;
};
