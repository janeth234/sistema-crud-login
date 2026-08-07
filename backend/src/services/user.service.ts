import {
  deleteUserById,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUserById,
} from "../repositories/user.repository.js";
import type { UpdateUserInput } from "../schemas/user.schema.js";
import { AppError } from "../utils/app-error.js";

export const getUsers = async () => {
  return findAllUsers();
};

export const getUser = async (id: number) => {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return user;
};

export const updateUser = async (
  id: number,
  data: UpdateUserInput,
) => {
  const existingUser = await findUserById(id);

  if (!existingUser) {
    throw new AppError("Usuario no encontrado", 404);
  }

  if (data.email && data.email !== existingUser.email) {
    const userWithEmail = await findUserByEmail(data.email);

    if (userWithEmail) {
      throw new AppError(
        "El correo electrónico ya está registrado",
        409,
      );
    }
  }

  return updateUserById(id, data);
};

export const removeUser = async (id: number) => {
  const existingUser = await findUserById(id);

  if (!existingUser) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return deleteUserById(id);
};