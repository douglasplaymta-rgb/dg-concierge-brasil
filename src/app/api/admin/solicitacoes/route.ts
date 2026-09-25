import { db } from "@/db";
import { requestStatuses, serviceRequests, type RequestStatus } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminAuthenticated(request)) return Response.json({ error: "Acesso não autorizado." }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "todos";
  const search = (url.searchParams.get("q") || "").trim().slice(0, 100);
  const parsedPage = Number(url.searchParams.get("page") || "1");
  const page = Number.isInteger(parsedPage) ? Math.min(Math.max(parsedPage, 1), 10000) : 1;
  const pageSize = 20;

  if (status !== "todos" && !requestStatuses.includes(status as RequestStatus)) {
    return Response.json({ error: "Filtro de status inválido." }, { status: 400 });
  }

  const statusFilter = status === "todos" ? undefined : eq(serviceRequests.status, status as RequestStatus);
  const searchFilter = search
    ? or(
        ilike(serviceRequests.name, `%${search}%`),
        ilike(serviceRequests.eventName, `%${search}%`),
        ilike(serviceRequests.protocol, `%${search}%`),
        ilike(serviceRequests.email, `%${search}%`),
      )
    : undefined;
  const whereClause = and(statusFilter, searchFilter);

  try {
    const [items, totalResult, statusCounts] = await Promise.all([
      db.select().from(serviceRequests).where(whereClause).orderBy(desc(serviceRequests.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
      db.select({ value: count() }).from(serviceRequests).where(whereClause),
      db.select({ status: serviceRequests.status, value: count() }).from(serviceRequests).groupBy(serviceRequests.status),
    ]);

    const counts: Record<string, number> = { todos: 0 };
    for (const item of statusCounts) {
      counts[item.status] = item.value;
      counts.todos += item.value;
    }

    return Response.json({ items, total: totalResult[0]?.value || 0, page, pageSize, counts }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load admin requests:", error);
    return Response.json({ error: "Não foi possível carregar as solicitações." }, { status: 500 });
  }
}
