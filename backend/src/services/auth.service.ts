import bcrypt from "bcryptjs";

import {
  createUser,
  findUserByEmail,
} from "../repositories/user.repository.js";

import type {
  LoginInput,
  RegisterInput,
} from "../schemas/auth.schema.js";

import { AppError } from "../utils/app-error.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const SALT_ROUNDS = 12;

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(
      "Ya existe un usuario registrado con este correo",
      409,
    );
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    SALT_ROUNDS,
  );

  return createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });
};

export const loginUser = async (data: LoginInput) => {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new AppError(
      "Correo o contraseña incorrectos",
      401,
    );
  }

  const passwordIsValid = await bcrypt.compare(
    data.password,
    user.password,
  );

  if (!passwordIsValid) {
    throw new AppError(
      "Correo o contraseña incorrectos",
      401,
    );
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};
export const refreshAccessToken = async (
  refreshToken: string,
) => {
  const payload = verifyRefreshToken(refreshToken);

  const user = await findUserByEmail(payload.email);

  if (!user) {
    throw new AppError(
      "Usuario no encontrado",
      401,
    );
  }

  return generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
};