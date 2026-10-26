import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const publicRoutes = ["/"];

export async function proxy(req: NextRequest) {
  console.log("proxy:", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;
  const session = await decrypt(req.cookies.get("session")?.value);
  const isPublic = publicRoutes.includes(pathname);

  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if (isPublic && session) {
    return NextResponse.redirect(new URL("/dashboard/info", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};