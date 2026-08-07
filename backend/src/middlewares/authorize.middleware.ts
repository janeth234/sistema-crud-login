import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { AppError } from "../utils/app-error.js";

export const authorize =
  (...allowedRoles: string[]) =>
  (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void => {
    try {
      if (!request.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      if (!allowedRoles.includes(request.user.role)) {
        throw new AppError(
          "No tienes permisos para realizar esta acción",
          403,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };