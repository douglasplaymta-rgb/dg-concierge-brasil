import { NextResponse } from "next/server";
import {
  adminCookieName,
  adminIsConfigured,
  adminSessionMaxAge,
  createAdminSession,
  isAdminAuthenticated,
  passwordMatches,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function GET(request: Request) {
  return NextResponse.json(
    { configured: adminIsConfigured(), authenticated: isAdminAuthenticated(request) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!adminIsConfigured()) return NextResponse.json({ error: "O acesso administrativo ainda não foi configurado." }, { status: 503 });

  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const previous = attempts.get(address);
  const current = previous && previous.resetAt > Date.now() ? previous : { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
  if (current.count >= 8) return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente." }, { status: 429 });

  let password = "";
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && "password" in body && typeof body.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ error: "Informe sua senha para entrar." }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    attempts.set(address, { ...current, count: current.count + 1 });
    return NextResponse.json({ error: "Senha incorreta. Tente novamente." }, { status: 401 });
  }

  attempts.delete(address);
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(adminCookieName, createAdminSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminSessionMaxAge,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
