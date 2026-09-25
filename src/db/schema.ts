import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const requestStatuses = [
  "recebida",
  "em_analise",
  "proposta_enviada",
  "confirmada",
  "concluida",
  "encerrada",
] as const;

export type RequestStatus = (typeof requestStatuses)[number];
export const requestStatusEnum = pgEnum("request_status", requestStatuses);

export const serviceRequests = pgTable(
  "service_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    protocol: varchar("protocol", { length: 24 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    whatsapp: varchar("whatsapp", { length: 30 }).notNull(),
    eventName: varchar("event_name", { length: 180 }).notNull(),
    city: varchar("city", { length: 120 }).notNull(),
    eventDate: varchar("event_date", { length: 30 }),
    quantity: integer("quantity").notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    plan: varchar("plan", { length: 30 }).notNull(),
    notes: text("notes"),
    status: requestStatusEnum("status").notNull().default("recebida"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("service_requests_email_idx").on(table.email)],
);
