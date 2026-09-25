import type { Metadata } from "next";
import { TrackingPage } from "@/components/tracking-page";

export const metadata: Metadata = {
  title: "Acompanhar solicitação | DG Concierge Brasil",
  description: "Consulte o andamento da sua solicitação de ingressos com seu protocolo e e-mail.",
};

export default function AcompanharPage() {
  return <TrackingPage />;
}
