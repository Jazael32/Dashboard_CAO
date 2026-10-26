import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser, getUserByEmail } from "@/data/db/UserActions";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72, "Máximo 72 caracteres"),
  name: z.string().trim().min(1).optional(),
  username: z.string().trim().min(1).optional(),
});

export async function POST(req: Request) {
  // Protección simple para que no cualquiera cree usuarios
  if (req.headers.get("x-api-key") !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password, name, username } = parsed.data;

  if (await getUserByEmail(email)) {
    return NextResponse.json({ error: "Ese email ya está registrado" }, { status: 409 });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const { passwordHash: _omit, ...user } = await createUser({
      email,
      passwordHash,
      name,
      username,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // Dos peticiones simultáneas con el mismo email: gana una y la otra cae aquí
    if (error instanceof Error && "sqlState" in error && error.sqlState === "23505") {
      return NextResponse.json({ error: "Ese email ya está registrado" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}