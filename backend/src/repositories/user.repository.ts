import { asc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
}

const publicUserFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
};

export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
};

export const findUserById = async (id: number) => {
  const [user] = await db
    .select(publicUserFields)
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user;
};

export const findAllUsers = async () => {
  return db
    .select(publicUserFields)
    .from(users)
    .orderBy(asc(users.id));
};

export const createUser = async (data: CreateUserData) => {
  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? "USER",
    })
    .returning(publicUserFields);

  return user;
};

export const updateUserById = async (
  id: number,
  data: UpdateUserData,
) => {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning(publicUserFields);

  return user;
};

export const deleteUserById = async (id: number) => {
  const [user] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning(publicUserFields);

  return user;
};