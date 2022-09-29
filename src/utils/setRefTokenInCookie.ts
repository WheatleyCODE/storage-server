import { Response } from 'express';

export const setRefTokenInCookie = (res: Response, token): void => {
  res.cookie('refreshToken', token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
};
