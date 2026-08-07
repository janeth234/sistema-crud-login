import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { UpdateUserInput } from "../schemas/user.schema.js";

import {
  getUser,
  getUsers,
  removeUser,
  updateUser,
} from "../services/user.service.js";

import { AppError } from "../utils/app-error.js";

type UserParams = {
  id: string;
};

const parseUserId = (value: string): number => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(
      "El ID del usuario no es válido",
      400,
    );
  }

  return id;
};

export const listUsers = async (
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await getUsers();

    response.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const showUser = async (
  request: Request<UserParams>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseUserId(request.params.id);
    const user = await getUser(id);

    response.status(200).json({
      success: true,
      message: "Usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (
  request: Request<UserParams>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseUserId(request.params.id);
    const data = request.body as UpdateUserInput;

    const user = await updateUser(id, data);

    response.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const destroyUser = async (
  request: Request<UserParams>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseUserId(request.params.id);

    if (request.user?.userId === id) {
      throw new AppError(
        "No puedes eliminar tu propio usuario",
        400,
      );
    }

    const user = await removeUser(id);

    response.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};