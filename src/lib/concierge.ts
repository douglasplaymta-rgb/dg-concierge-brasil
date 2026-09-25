export const requestCategories = ["shows", "esportes", "teatro", "vip", "outro"] as const;
export type RequestCategory = (typeof requestCategories)[number];

export const categoryLabels: Record<RequestCategory, string> = {
  shows: "Shows e festivais",
  esportes: "Esportes",
  teatro: "Teatro e cultura",
  vip: "Experiências VIP",
  outro: "Outro evento",
};

export const requestPlans = ["essencial", "signature", "prive"] as const;
export type RequestPlan = (typeof requestPlans)[number];

export const planLabels: Record<RequestPlan, string> = {
  essencial: "Essencial",
  signature: "Signature",
  prive: "Privé",
};

export const statusLabels = {
  recebida: "Solicitação recebida",
  em_analise: "Em análise",
  proposta_enviada: "Proposta enviada",
  confirmada: "Compra confirmada",
  concluida: "Atendimento concluído",
  encerrada: "Solicitação encerrada",
} as const;

export const activeStatusSteps = [
  "recebida",
  "em_analise",
  "proposta_enviada",
  "confirmada",
  "concluida",
] as const;

export const whatsappNumber = "5585986608852";
