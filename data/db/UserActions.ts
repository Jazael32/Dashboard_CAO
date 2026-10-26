"use server";
import { db } from "@/src/prisma/db";

const User = db.orm.public.User;

export async function getUserByEmail(email: string) {
  return User.whereUnique({ email }).first();
}

export async function getUserById(id: number) {
  return User.whereUnique({ id })
    .select("id", "email", "username", "name") // nunca devuelvas passwordHash
    .first();
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name?: string;
  username?: string;
}) {
  return User.create(data);
}