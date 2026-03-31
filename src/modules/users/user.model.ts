import type { PublicUser, UserRecord } from './user.types.js';

export const toPublicUser = (user: UserRecord): PublicUser => {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.created_at,
  };
};
