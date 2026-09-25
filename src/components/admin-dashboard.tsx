"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  LockKeyhole,
  LogOut,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Brand } from "./brand";
import {
  categoryLabels,
  planLabels,
  statusLabels,
  type RequestCategory,
  type RequestPlan,
} from "@/lib/concierge";

type Status = keyof typeof statusLabels;
type AdminRequest = {
  id: string;
  protocol: string;
  name: string;
  email: string;
  whatsapp: string;
  eventName: string;
  city: string;
  eventDate: string | null;
  quantity: number;
  category: RequestCategory;
  plan: RequestPlan;
  notes: string | null;
  adminNotes: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

const filters: { id: Status | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "recebida", label: "Recebidos" },
  { id: "em_analise", label: "Em análise" },
  { id: "proposta_enviada", label: "Proposta enviada" },
  { id: "confirmada", label: "Confirmados" },
  { id: "concluida", label: "Concluídos" },
  { id: "encerrada", label: "Encerrados" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date(value));
}

export function AdminDashboard() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [items, setItems] = useState<AdminRequest[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Status | "todos">("todos");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [selected, setSelected] = useState<AdminRequest | null>(null);
  const [editStatus, setEditStatus] = useState<Status>("recebida");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        if (!response.ok) throw new Error("Não foi possível verificar o acesso.");
        const data = await response.json();
        setConfigured(Boolean(data.configured));
        setAuthenticated(Boolean(data.authenticated));
      } catch {
        setSessionError("Não foi possível verificar o acesso. Atualize a página e tente novamente.");
      }
    }
    void checkSession();
  }, []);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const params = new URLSearchParams({ status: filter, q: query, page: String(page) });
      const response = await fetch(`/api/admin/solicitacoes?${params}`, { cache: "no-store" });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar a lista.");
      setItems(data.items as AdminRequest[]);
      setCounts(data.counts as Record<string, number>);
      setTotal(data.total as number);
    } catch (cause) {
      setListError(cause instanceof Error ? cause.message : "Não foi possível carregar a lista.");
    } finally {
      setLoading(false);
    }
  }, [filter, page, query]);

  useEffect(() => {
    if (authenticated) void loadRequests();
  }, [authenticated, loadRequests]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível entrar.");
      setPassword("");
      setAuthenticated(true);
    } catch (cause) {
      setLoginError(cause instanceof Error ? cause.message : "Não foi possível entrar.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setSelected(null);
    setItems([]);
  }

  function openRequest(item: AdminRequest) {
    setSelected(item);
    setEditStatus(item.status);
    setAdminNotes(item.adminNotes || "");
    setSaveError("");
    setSaveSuccess(false);
  }

  async function saveRequest() {
    if (!selected) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const response = await fetch(`/api/admin/solicitacoes/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, adminNotes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar as alterações.");
      setSelected(data.item as AdminRequest);
      setSaveSuccess(true);
      await loadRequests();
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setQuery(searchInput.trim());
  }

  if (configured === null) {
    return <main className="admin-gate"><Brand /><div className="admin-gate-card"><span className="admin-gate-icon"><LockKeyhole size={25} /></span><h1>{sessionError ? "Acesso indisponível" : "Preparando acesso..."}</h1><p>{sessionError || "Verificando a segurança do painel DG Concierge."}</p><Link href="/">Voltar ao site <ArrowUpRight size={16} /></Link></div></main>;
  }

  if (!configured) {
    return <main className="admin-gate"><Brand /><div className="admin-gate-card"><span className="admin-gate-icon"><ShieldCheck size={27} strokeWidth={1.5} /></span><p className="eyebrow">PAINEL PROTEGIDO</p><h1>Ative seu acesso interno.</h1><p>Configure a variável de ambiente <strong>DG_ADMIN_PASSWORD</strong> com uma senha de pelo menos 12 caracteres para habilitar o painel de atendimento. Os dados dos clientes permanecem protegidos até lá.</p><Link href="/">Voltar ao site <ArrowUpRight size={16} /></Link></div></main>;
  }

  if (!authenticated) {
    return <main className="admin-gate"><Brand /><div className="admin-gate-card"><span className="admin-gate-icon"><LockKeyhole size={27} strokeWidth={1.5} /></span><p className="eyebrow">ÁREA INTERNA · DG CONCIERGE</p><h1>Bem-vindo de volta.</h1><p>Entre com a senha administrativa para acompanhar as solicitações e cuidar de cada experiência.</p><form onSubmit={login} className="admin-login-form"><label>Senha de acesso<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" /></label>{loginError && <span role="alert" className="admin-error">{loginError}</span>}<button className="button button-gold" type="submit" disabled={loginLoading}>{loginLoading ? "Entrando..." : "Entrar no painel"} <ArrowUpRight size={18} /></button></form><Link href="/">Voltar ao site <ArrowUpRight size={16} /></Link></div></main>;
  }

  return (
    <main className="admin-shell">
      <header className="admin-header"><div className="container admin-header-inner"><Brand /><div className="admin-header-label"><span className="admin-live-dot" /> PAINEL DE ATENDIMENTO</div><div className="admin-header-actions"><Link href="/" target="_blank" rel="noopener noreferrer">Ver site <ArrowUpRight size={15} /></Link><button type="button" onClick={logout}><LogOut size={16} /> Sair</button></div></div></header>
      <div className="container admin-body">
        <div className="admin-welcome"><div><p className="eyebrow"><span className="eyebrow-line" /> VISÃO GERAL</p><h1>Seu concierge, <em>em cada detalhe.</em></h1><p>Acompanhe pedidos, organize conversas e transforme interesses em experiências.</p></div><button className="admin-refresh" type="button" onClick={() => void loadRequests()} disabled={loading}><RefreshCw size={16} className={loading ? "spinning" : ""} /> Atualizar</button></div>
        <div className="admin-stat-grid"><div className="admin-stat"><span><Ticket size={19} /> TOTAL DE PEDIDOS</span><strong>{counts.todos ?? "—"}</strong><small>Solicitações recebidas</small></div><div className="admin-stat"><span><Sparkles size={19} /> NOVOS CONTATOS</span><strong>{counts.recebida ?? 0}</strong><small>Aguardando primeiro contato</small></div><div className="admin-stat"><span><Clock3 size={19} /> EM ANDAMENTO</span><strong>{(counts.em_analise || 0) + (counts.proposta_enviada || 0)}</strong><small>Análise e propostas</small></div><div className="admin-stat"><span><Check size={19} /> CONFIRMADOS</span><strong>{(counts.confirmada || 0) + (counts.concluida || 0)}</strong><small>Momentos a caminho</small></div></div>
        <section className="admin-workspace"><div className="admin-workspace-heading"><div><p className="eyebrow">CENTRAL DE SOLICITAÇÕES</p><h2>Pedidos recebidos</h2></div><span>{total} {total === 1 ? "resultado" : "resultados"}</span></div>
          <div className="admin-toolbar"><div className="admin-filters">{filters.map((option) => <button key={option.id} type="button" className={filter === option.id ? "active" : ""} onClick={() => { setFilter(option.id); setPage(1); }}>{option.label}{counts[option.id] !== undefined && <span>{counts[option.id]}</span>}</button>)}</div><form className="admin-search" onSubmit={submitSearch}><Search size={16} /><input aria-label="Buscar solicitações" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Nome, evento, protocolo..." /><button type="submit">Buscar</button></form></div>
          {listError && <p className="admin-error admin-list-error" role="alert">{listError}</p>}
          <div className="admin-content-grid"><div className="admin-list"><div className="admin-list-labels"><span>CLIENTE / EVENTO</span><span>PLANO</span><span>ETAPA</span><span>RECEBIDO</span></div>{loading ? <div className="admin-empty">Carregando solicitações...</div> : items.length === 0 ? <div className="admin-empty"><Ticket size={28} strokeWidth={1.3} /><strong>Nenhuma solicitação por aqui.</strong><span>Quando novos pedidos chegarem, eles aparecerão nesta lista.</span></div> : items.map((item) => <button key={item.id} type="button" className={`admin-request-row ${selected?.id === item.id ? "selected" : ""}`} onClick={() => openRequest(item)}><span className="admin-row-main"><strong>{item.name}</strong><small>{item.eventName} · {item.protocol}</small></span><span className="admin-row-plan">{planLabels[item.plan]}</span><span className={`admin-row-status status-${item.status}`}>{statusLabels[item.status]}</span><span className="admin-row-date">{formatDate(item.createdAt)}</span><ChevronRight className="admin-row-arrow" size={16} /></button>)}<div className="admin-pagination"><span>Página {page} de {Math.max(1, Math.ceil(total / 20))}</span><div><button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}><ArrowLeft size={15} /> Anterior</button><button type="button" disabled={page * 20 >= total} onClick={() => setPage((current) => current + 1)}>Próxima <ArrowRight size={15} /></button></div></div></div>
            <aside className="admin-detail">{selected ? <><div className="admin-detail-header"><p className="eyebrow">DETALHES DO ATENDIMENTO</p><h3>{selected.name}</h3><span>{selected.protocol} · {formatDate(selected.createdAt)}</span></div><div className="admin-detail-block"><span>EVENTO DE INTERESSE</span><strong>{selected.eventName}</strong><small>{categoryLabels[selected.category]} · {selected.city}{selected.eventDate ? ` · ${selected.eventDate.split("-").reverse().join("/")}` : ""}</small><small>{selected.quantity} {selected.quantity === 1 ? "ingresso" : "ingressos"} · Plano {planLabels[selected.plan]}</small></div><div className="admin-detail-block"><span>CONTATO</span><a href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "").startsWith("55") ? selected.whatsapp.replace(/\D/g, "") : `55${selected.whatsapp.replace(/\D/g, "")}`}?text=${encodeURIComponent(`Olá, ${selected.name.split(" ")[0]}! Aqui é da DG Concierge sobre sua solicitação ${selected.protocol}.`)}`} target="_blank" rel="noopener noreferrer" className="admin-whatsapp"><MessageCircle size={17} /> {selected.whatsapp} <ArrowUpRight size={15} /></a><a href={`mailto:${selected.email}`} className="admin-email">{selected.email}</a></div><div className="admin-detail-block"><span>OBSERVAÇÕES DO CLIENTE</span><p>{selected.notes || "Nenhuma observação adicional."}</p></div><div className="admin-edit"><label>Etapa do atendimento<select value={editStatus} onChange={(event) => setEditStatus(event.target.value as Status)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Anotações internas<textarea maxLength={2000} rows={4} placeholder="Registre próximos passos, contatos e informações úteis..." value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} /></label><p>As anotações internas não aparecem para o cliente. A etapa atualizada fica visível no acompanhamento.</p>{saveError && <span className="admin-error" role="alert">{saveError}</span>}{saveSuccess && <span className="admin-saved" role="status"><Check size={15} /> Alterações salvas com sucesso.</span>}<button className="button button-gold" type="button" onClick={() => void saveRequest()} disabled={saving}>{saving ? "Salvando..." : "Salvar atendimento"} <ArrowUpRight size={18} /></button></div></> : <div className="admin-detail-empty"><span><Sparkles size={28} strokeWidth={1.2} /></span><h3>Cada pedido é uma história.</h3><p>Selecione uma solicitação ao lado para ver os detalhes e dar o próximo passo.</p></div>}</aside></div>
        </section>
        <p className="admin-bottom-note"><LockKeyhole size={14} /> Área restrita à equipe DG Concierge Brasil. Trate os dados dos clientes com confidencialidade.</p>
      </div>
    </main>
  );
}
