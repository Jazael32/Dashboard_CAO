"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createUser, getUserByEmail } from "@/data/db/UserActions";
import { createSession, deleteSession } from "@/lib/session";
import { cache } from "react";
import { getSession } from "@/lib/session";
import { getUserById } from "@/data/db/UserActions";

export type AuthState = {
  errors?: { email?: string[]; password?: string[]; name?: string[] };
  message?: string;
} | undefined;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

const signupSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre").optional(),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72, "Máximo 72 caracteres"),
});

// Hash falso para igualar tiempos de respuesta cuando el usuario no existe
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO5x8lq5q1v0o3zJ5y0sQwXkq0yQ6g8Oa";

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  console.log("login llamado", formData.get("email"));
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { email, password } = parsed.data;
  const user = await getUserByEmail(email);
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  // Mensaje genérico: no reveles si el email existe o no
  if (!user || !valid) return { message: "Email o contraseña incorrectos" };

  await createSession(user.id);
  redirect("/dashboard/info");
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { email, password, name } = parsed.data;
  if (await getUserByEmail(email)) return { message: "Ese email ya está registrado" };

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ email, passwordHash, name });

  await createSession(user.id);
  redirect("/dashboard/info");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export const requireUser = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/");

  const user = await getUserById(session.userId);
  if (!user) redirect("/"); // el usuario fue borrado

  return user;
});