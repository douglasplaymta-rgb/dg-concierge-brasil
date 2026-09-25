import { db } from "@/db";
import { requestStatuses, serviceRequests, type RequestStatus } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(request)) return Response.json({ error: "Acesso não autorizado." }, { status: 401 });

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return Response.json({ error: "Solicitação inválida." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid payload");
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Dados inválidos." }, { status: 400 });
  }

  if (typeof body.status !== "string" || !requestStatuses.includes(body.status as RequestStatus)) {
    return Response.json({ error: "Selecione um status válido." }, { status: 400 });
  }
  if (typeof body.adminNotes !== "string" || body.adminNotes.length > 2000) {
    return Response.json({ error: "As observações devem ter no máximo 2000 caracteres." }, { status: 400 });
  }

  try {
    const [updated] = await db.update(serviceRequests).set({
      status: body.status as RequestStatus,
      adminNotes: body.adminNotes.trim() || null,
      updatedAt: new Date(),
    }).where(eq(serviceRequests.id, id)).returning();

    if (!updated) return Response.json({ error: "Solicitação não encontrada." }, { status: 404 });
    return Response.json({ item: updated }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to update admin request:", error);
    return Response.json({ error: "Não foi possível atualizar a solicitação." }, { status: 500 });
  }
}
