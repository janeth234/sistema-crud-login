import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

import { AppError } from "./app-error.js";

export interface TokenPayload extends JwtPayload {
  userId: number;
  email: string;
  role: string;
}

type TokenData = {
  userId: number;
  email: string;
  role: string;
};

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || !refreshSecret) {
  throw new Error(
    "JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben estar definidos",
  );
}

const accessExpiresIn =
  (process.env.ACCESS_TOKEN_EXPIRES_IN ??
    "15m") as SignOptions["expiresIn"];

const refreshExpiresIn =
  (process.env.REFRESH_TOKEN_EXPIRES_IN ??
    "7d") as SignOptions["expiresIn"];

export const generateAccessToken = (
  payload: TokenData,
): string => {
  return jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiresIn,
  });
};

export const generateRefreshToken = (
  payload: TokenData,
): string => {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });
};

export const verifyAccessToken = (
  token: string,
): TokenPayload => {
  try {
    return jwt.verify(
      token,
      accessSecret,
    ) as TokenPayload;
  } catch {
    throw new AppError(
      "Token inválido o expirado",
      401,
    );
  }
};

export const verifyRefreshToken = (
  token: string,
): TokenPayload => {
  try {
    return jwt.verify(
      token,
      refreshSecret,
    ) as TokenPayload;
  } catch {
    throw new AppError(
      "Refresh token inválido o expirado",
      401,
    );
  }
};