"use client";

import { ArrowUpRight, Check, ClipboardList, LockKeyhole, MessageCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  activeStatusSteps,
  categoryLabels,
  planLabels,
  statusLabels,
  whatsappNumber,
  type RequestCategory,
  type RequestPlan,
} from "@/lib/concierge";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type Status = keyof typeof statusLabels;
type FoundRequest = {
  protocol: string;
  eventName: string;
  city: string;
  eventDate: string | null;
  quantity: number;
  category: RequestCategory;
  plan: RequestPlan;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function TrackingPage() {
  const [protocol, setProtocol] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<FoundRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("protocolo");
    if (value) setProtocol(value.toUpperCase());
  }, []);

  async function lookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`/api/solicitacoes?protocolo=${encodeURIComponent(protocol.trim())}&email=${encodeURIComponent(email.trim())}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível consultar sua solicitação.");
      setResult(data as FoundRequest);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível consultar sua solicitação.");
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = result ? activeStatusSteps.findIndex((step) => step === result.status) : -1;

  return (
    <main className="inner-page">
      <SiteHeader inner />
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow"><span className="eyebrow-line" /> ACOMPANHAMENTO DG CONCIERGE</p>
          <h1>Cada detalhe, <em>sob controle.</em></h1>
          <p>Veja em que etapa está a sua solicitação. É só informar o protocolo que você recebeu e o e-mail cadastrado.</p>
        </div>
      </section>
      <section className="track-main">
        <div className="container">
          <div className="track-card">
            <div className="track-card-top"><span><ClipboardList size={24} strokeWidth={1.4} /></span><div><h2>Acompanhe sua solicitação</h2><p>Uma consulta simples, segura e personalizada.</p></div></div>
            <form className="track-form" onSubmit={lookup}>
              <label>Número do protocolo<input required type="text" placeholder="DG-000000-XXXXXXXX" autoComplete="off" value={protocol} onChange={(event) => setProtocol(event.target.value.toUpperCase())} /></label>
              <label>E-mail cadastrado<input required type="email" placeholder="seu@email.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              <button className="button button-dark" type="submit" disabled={loading}>{loading ? "Consultando..." : "Consultar"} {!loading && <ArrowUpRight size={18} />}</button>
            </form>
            <p className="track-hint"><LockKeyhole size={14} /> Seus dados só aparecem após a validação do protocolo e e-mail.</p>
            {error && <p className="track-error" role="alert">{error}</p>}
            {result && (
              <div className="track-result" role="status">
                <div className="track-result-heading"><div><p className="eyebrow">PROTOCOLO {result.protocol}</p><h3>{result.eventName}</h3><p>Solicitado em {formatDate(result.createdAt)}</p></div><span className="status-pill">{statusLabels[result.status]}</span></div>
                <div className="track-details"><div><span>EXPERIÊNCIA</span><strong>{categoryLabels[result.category] || "Evento especial"}</strong></div><div><span>ONDE</span><strong>{result.city}</strong></div><div><span>INGRESSOS</span><strong>{result.quantity} {result.quantity === 1 ? "ingresso" : "ingressos"}</strong></div><div><span>ATENDIMENTO</span><strong>{planLabels[result.plan] || result.plan}</strong></div>{result.eventDate && <div><span>DATA PREVISTA</span><strong>{formatDate(`${result.eventDate}T00:00:00Z`)}</strong></div>}</div>
                {result.status === "encerrada" ? <div className="track-closed">Esta solicitação foi encerrada. Se quiser retomar a conversa ou iniciar uma nova experiência, fale com nossa equipe pelo WhatsApp.</div> : <div className="track-timeline"><span>ETAPAS DO SEU ATENDIMENTO</span><ol className="track-timeline-list">{activeStatusSteps.map((step, index) => <li key={step} className={`${index <= currentIndex ? "done" : ""} ${index === currentIndex ? "current" : ""}`}><span className="timeline-dot">{index <= currentIndex && <Check size={12} strokeWidth={2.4} />}</span><strong>{statusLabels[step]}</strong></li>)}</ol></div>}
                <div className="track-contact"><span>Precisa de alguma informação adicional?</span><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá, DG Concierge! Gostaria de informações sobre o protocolo ${result.protocol}.`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Fale com seu concierge <ArrowUpRight size={15} /></a></div>
              </div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
