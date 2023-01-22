import { tokenService } from '../services/token-service.js';

export const getTokens = (u) => {
  const t = tokenService.generateTokens({ ...u });
  saveRefreshToken(u.id, t.refreshToken);
  return t;
};

const saveRefreshToken = async (u, t) => {
  await tokenService.saveToken(u, t);
};