import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  LoginInput,
  RegisterInput,
} from "../schemas/auth.schema.js";

import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service.js";

import { AppError } from "../utils/app-error.js";

export const register = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = request.body as RegisterInput;
    const user = await registerUser(data);

    response.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = request.body as LoginInput;
    const result = await loginUser(data);

    response.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    response.status(200).json({
      success: true,
      message: "Inicio de sesión correcto",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const profile = (
  request: Request,
  response: Response,
): void => {
  response.status(200).json({
    success: true,
    message: "Perfil obtenido correctamente",
    data: {
      user: request.user,
    },
  });
};

export const refresh = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        "No se proporcionó refresh token",
        401,
      );
    }

    const accessToken = await refreshAccessToken(refreshToken);

    response.status(200).json({
      success: true,
      message: "Token actualizado correctamente",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (
  _request: Request,
  response: Response,
): void => {
  response.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
  });

  response.status(200).json({
    success: true,
    message: "Sesión cerrada correctamente",
  });
};