import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new AppError(
        "No se proporcionó un token de autenticación",
        401,
      );
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      throw new AppError(
        "Formato de token inválido",
        401,
      );
    }

    request.user = verifyAccessToken(token);

    next();
  } catch (error) {
    next(error);
  }
};