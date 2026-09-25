import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { serviceRequests } from "@/db/schema";
import { requestCategories, requestPlans } from "@/lib/concierge";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength + 1) : "";
}

function invalid(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return invalid("Dados inválidos. Confira o formulário e tente novamente.");
    body = parsed as Record<string, unknown>;
  } catch {
    return invalid("Dados inválidos. Confira o formulário e tente novamente.");
  }

  if (getText(body.website, 100)) return invalid("Não foi possível processar a solicitação.");
  if (body.consent !== true) return invalid("É necessário autorizar o contato para enviar a solicitação.");

  const name = getText(body.name, 120);
  const email = getText(body.email, 255).toLowerCase();
  const whatsapp = getText(body.whatsapp, 30);
  const eventName = getText(body.eventName, 180);
  const city = getText(body.city, 120);
  const eventDate = getText(body.eventDate, 30);
  const notes = getText(body.notes, 1000);
  const category = getText(body.category, 50);
  const plan = getText(body.plan, 30);
  const quantity = Number(body.quantity);

  if (name.length < 2 || name.length > 120) return invalid("Informe seu nome para continuar.");
  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return invalid("Informe um e-mail válido.");
  if (whatsapp.replace(/\D/g, "").length < 10 || whatsapp.replace(/\D/g, "").length > 13) return invalid("Informe um WhatsApp válido com DDD.");
  if (eventName.length < 3 || eventName.length > 180) return invalid("Informe o nome do evento ou experiência desejada.");
  if (city.length < 2 || city.length > 120) return invalid("Informe a cidade do evento.");
  if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return invalid("Informe uma data válida ou deixe o campo em branco.");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return invalid("Selecione entre 1 e 20 ingressos.");
  if (!requestCategories.includes(category as (typeof requestCategories)[number])) return invalid("Selecione um tipo de experiência válido.");
  if (!requestPlans.includes(plan as (typeof requestPlans)[number])) return invalid("Selecione um plano válido.");
  if (notes.length > 1000) return invalid("O campo de detalhes está muito longo.");

  const protocol = `DG-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${randomBytes(4).toString("hex").toUpperCase()}`;

  try {
    await db.insert(serviceRequests).values({
      protocol,
      name,
      email,
      whatsapp,
      eventName,
      city,
      eventDate: eventDate || null,
      quantity,
      category,
      plan,
      notes: notes || null,
    });
    return Response.json({ protocol, status: "recebida" }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to save concierge request:", error);
    return Response.json({ error: "Não foi possível enviar agora. Por favor, tente novamente em instantes." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const protocol = (url.searchParams.get("protocolo") || "").trim().toUpperCase();
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();

  if (!/^DG-\d{6}-[A-F0-9]{8}$/.test(protocol) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return invalid("Informe um protocolo e e-mail válidos.");
  }

  try {
    const [found] = await db
      .select({
        protocol: serviceRequests.protocol,
        eventName: serviceRequests.eventName,
        city: serviceRequests.city,
        eventDate: serviceRequests.eventDate,
        quantity: serviceRequests.quantity,
        category: serviceRequests.category,
        plan: serviceRequests.plan,
        status: serviceRequests.status,
        createdAt: serviceRequests.createdAt,
        updatedAt: serviceRequests.updatedAt,
      })
      .from(serviceRequests)
      .where(and(eq(serviceRequests.protocol, protocol), eq(serviceRequests.email, email)))
      .limit(1);

    if (!found) return Response.json({ error: "Solicitação não encontrada. Confira o protocolo e o e-mail utilizados." }, { status: 404, headers: { "Cache-Control": "no-store" } });
    return Response.json({ ...found, createdAt: found.createdAt.toISOString(), updatedAt: found.updatedAt.toISOString() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to look up concierge request:", error);
    return Response.json({ error: "Não foi possível consultar agora. Tente novamente em instantes." }, { status: 500 });
  }
}
