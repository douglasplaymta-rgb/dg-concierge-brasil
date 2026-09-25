"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Headphones,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  categoryLabels,
  planLabels,
  whatsappNumber,
  type RequestCategory,
  type RequestPlan,
} from "@/lib/concierge";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type RequestForm = {
  name: string;
  email: string;
  whatsapp: string;
  eventName: string;
  city: string;
  eventDate: string;
  quantity: string;
  category: RequestCategory;
  plan: RequestPlan;
  notes: string;
  consent: boolean;
  website: string;
};

const initialForm: RequestForm = {
  name: "",
  email: "",
  whatsapp: "",
  eventName: "",
  city: "",
  eventDate: "",
  quantity: "2",
  category: "shows",
  plan: "signature",
  notes: "",
  consent: false,
  website: "",
};

const experiences: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  category: RequestCategory;
}[] = [
  {
    number: "01",
    eyebrow: "MÚSICA AO VIVO",
    title: "Shows & festivais",
    description: "Esteja perto de quem faz a trilha sonora da sua vida.",
    image: "/images/shows.jpg",
    alt: "Público em um show noturno iluminado",
    category: "shows",
  },
  {
    number: "02",
    eyebrow: "A EMOÇÃO DO JOGO",
    title: "Esportes",
    description: "Os grandes confrontos merecem ser vistos de perto.",
    image: "/images/esportes.jpg",
    alt: "Estádio de futebol iluminado durante uma partida",
    category: "esportes",
  },
  {
    number: "03",
    eyebrow: "ARTE QUE MARCA",
    title: "Teatro & cultura",
    description: "Espetáculos que ficam com você muito depois do fim.",
    image: "/images/teatro.jpg",
    alt: "Interior elegante de um teatro clássico",
    category: "teatro",
  },
  {
    number: "04",
    eyebrow: "ALÉM DO INGRESSO",
    title: "Experiências VIP",
    description: "Camarotes, hospitalidade e detalhes sob medida.",
    image: "/images/vip.jpg",
    alt: "Ambiente de hospitalidade elegante para experiências VIP",
    category: "vip",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Conte o que você deseja",
    text: "Diga qual evento quer viver, quantas pessoas vão com você e o que torna essa ocasião especial.",
  },
  {
    number: "02",
    title: "Nós buscamos as possibilidades",
    text: "Nossa equipe consulta os canais oficiais e avalia opções de ingresso conforme a disponibilidade.",
  },
  {
    number: "03",
    title: "Você aprova com clareza",
    text: "Apresentamos o valor do ingresso e a taxa do serviço separadamente. Nada é comprado sem sua aprovação.",
  },
  {
    number: "04",
    title: "Aproveite o momento",
    text: "Acompanhamos a confirmação e compartilhamos as informações necessárias para a sua experiência.",
  },
];

const plans: {
  id: RequestPlan;
  eyebrow: string;
  name: string;
  description: string;
  price: string;
  suffix: string;
  features: string[];
  featured?: boolean;
}[] = [
  {
    id: "essencial",
    eyebrow: "O COMEÇO DE TUDO",
    name: "Essencial",
    description: "Para quem quer a tranquilidade de uma compra bem acompanhada.",
    price: "149",
    suffix: "por solicitação",
    features: [
      "Busca em canais oficiais",
      "Compra assistida de ingressos",
      "Orientação sobre opções disponíveis",
      "Confirmação e suporte por mensagem",
    ],
  },
  {
    id: "signature",
    eyebrow: "A EXPERIÊNCIA COMPLETA",
    name: "Signature",
    description: "Mais atenção para transformar bons planos em grandes memórias.",
    price: "349",
    suffix: "por solicitação",
    features: [
      "Tudo do plano Essencial",
      "Atendimento prioritário e individual",
      "Apoio na escolha de setores",
      "Acompanhamento até a confirmação",
    ],
    featured: true,
  },
  {
    id: "prive",
    eyebrow: "SEM LIMITES PARA SONHAR",
    name: "Privé",
    description: "Uma curadoria singular para ocasiões verdadeiramente especiais.",
    price: "Sob consulta",
    suffix: "proposta personalizada",
    features: [
      "Camarotes e hospitalidade VIP",
      "Soluções para grupos e empresas",
      "Concierge de viagem e hospedagem",
      "Planejamento sob medida",
    ],
  },
];

const faqs = [
  {
    question: "A DG garante ingresso para qualquer evento?",
    answer:
      "A DG garante a procedência dos ingressos adquiridos por meio da nossa assessoria, sempre em canais oficiais ou autorizados. A disponibilidade de lugares depende do organizador e não pode ser garantida antes da confirmação da compra.",
  },
  {
    question: "O ingresso está incluído no valor do plano?",
    answer:
      "Não. Os valores apresentados são taxas de assessoria a partir do preço indicado. O ingresso e eventuais despesas adicionais são informados separadamente em uma proposta clara, antes de qualquer aprovação.",
  },
  {
    question: "Como e quando faço o pagamento?",
    answer:
      "Depois que entendermos sua solicitação, enviamos uma proposta com valores e condições. A compra só é iniciada após a sua aprovação. Não solicitamos pagamentos pelo formulário deste site.",
  },
  {
    question: "Vocês atendem eventos fora da minha cidade?",
    answer:
      "Sim. Atendemos clientes em todo o Brasil e podemos assessorar experiências nacionais e internacionais, conforme o evento e a disponibilidade de canais de venda.",
  },
  {
    question: "Como acompanho a minha solicitação?",
    answer:
      "Ao enviar o formulário, você recebe um número de protocolo na tela. Use esse número e o e-mail informado na página Acompanhar pedido para consultar a etapa atual do atendimento.",
  },
];

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá, DG Concierge! Gostaria de conversar sobre uma experiência.")}`;

export function LandingPage() {
  const [form, setForm] = useState<RequestForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState<{ protocol: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function updateField<K extends keyof RequestForm>(field: K, value: RequestForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startRequest(options?: { category?: RequestCategory; plan?: RequestPlan }) {
    setForm((current) => ({
      ...current,
      category: options?.category ?? current.category,
      plan: options?.plan ?? current.plan,
    }));
    document.getElementById("solicitar")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Não foi possível enviar sua solicitação. Tente novamente.");
      }

      setSubmitted({ protocol: result.protocol, name: form.name.trim().split(" ")[0] });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyProtocol() {
    if (!submitted) return;
    try {
      await navigator.clipboard.writeText(submitted.protocol);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main>
      <section className="hero" id="inicio">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <SiteHeader />
        <div className="container hero-content-wrap">
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> DG CONCIERGE BRASIL <span className="eyebrow-diamond">✦</span> ACESSO EXTRAORDINÁRIO</p>
            <h1>O melhor da vida acontece <em>ao vivo.</em></h1>
            <p className="hero-description">
              Os grandes momentos não deveriam começar em uma fila virtual. Nós cuidamos da busca e compra assistida dos seus ingressos para você viver cada segundo.
            </p>
            <div className="hero-buttons">
              <a className="button button-gold" href="#solicitar">Quero viver essa experiência <ArrowUpRight size={19} strokeWidth={1.8} /></a>
              <a className="button-text" href="#como-funciona">Descubra como funciona <ArrowDown size={16} strokeWidth={1.6} /></a>
            </div>
            <div className="hero-assurance">
              <span className="assurance-icon"><ShieldCheck size={21} strokeWidth={1.5} /></span>
              <span>Compra assistida em canais oficiais.<br />Segurança em cada detalhe.</span>
            </div>
          </div>
        </div>
        <div className="hero-pass" aria-hidden="true">
          <div className="pass-top"><span className="pass-dg">DG<span>✦</span></span><span className="pass-top-right">CONCIERGE<br />BRASIL</span></div>
          <div className="pass-divider" />
          <div className="pass-label">O SEU CONVITE PARA O</div>
          <div className="pass-title">extraordinário</div>
          <div className="pass-bottom"><span>ACESSO EXCLUSIVO</span><span>✦ &nbsp; ✦ &nbsp; ✦</span></div>
        </div>
        <div className="hero-scroll" aria-hidden="true"><span>ROLE PARA EXPLORAR</span><i /></div>
        <div className="hero-side-label" aria-hidden="true">EXPERIÊNCIAS QUE MARCAM · EST. BRASIL</div>
      </section>

      <section className="trust-strip" aria-label="Nossos diferenciais">
        <div className="container trust-grid">
          <div className="trust-item"><Ticket size={26} strokeWidth={1.35} /><div><strong>Ingressos oficiais</strong><span>Procedência e transparência</span></div></div>
          <div className="trust-item"><Headphones size={26} strokeWidth={1.35} /><div><strong>Atendimento humano</strong><span>Um concierge para você</span></div></div>
          <div className="trust-item"><Sparkles size={26} strokeWidth={1.35} /><div><strong>Experiência sob medida</strong><span>Do primeiro contato ao evento</span></div></div>
        </div>
      </section>

      <section className="intro-section section-pad" id="sobre">
        <div className="container intro-grid">
          <div className="intro-visual">
            <div className="intro-image-frame"><Image src="/images/plateia.jpg" alt="Plateia vivendo a emoção de um show ao vivo" fill sizes="(max-width: 800px) 90vw, 42vw" className="cover-image" /></div>
            <div className="intro-image-caption"><span>01 / 04</span><span>MAIS QUE INGRESSOS. HISTÓRIAS.</span></div>
            <div className="intro-stamp"><span>DG</span><i>✦</i><small>O SEU MOMENTO<br />COMEÇA AQUI</small></div>
          </div>
          <div className="intro-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> O QUE É A DG CONCIERGE</p>
            <h2 className="section-heading">Você vive o momento.<br /><em>Nós cuidamos do resto.</em></h2>
            <p className="section-lead">A melhor parte de um evento é estar presente. Não recarregar páginas, disputar filas ou se perguntar se a compra é segura.</p>
            <p className="body-copy">A DG Concierge Brasil é sua assessoria pessoal para acessar os grandes shows, eventos e experiências que importam para você. Com atenção individual, buscamos possibilidades em canais oficiais e acompanhamos cada etapa com clareza.</p>
            <div className="intro-benefits">
              <div><span className="benefit-icon"><ShieldCheck size={22} strokeWidth={1.4} /></span><span>Segurança e procedência<br />em primeiro lugar</span></div>
              <div><span className="benefit-icon"><Star size={22} strokeWidth={1.4} /></span><span>Atendimento pensado<br />para a sua ocasião</span></div>
            </div>
            <a className="inline-link" href="#como-funciona">Conheça nosso jeito de fazer <ArrowUpRight size={19} strokeWidth={1.5} /></a>
          </div>
        </div>
      </section>

      <section className="experiences-section section-pad" id="experiencias">
        <div className="container">
          <div className="section-topline"><span>CURADORIA DE EXPERIÊNCIAS</span><span>02 / AONDE VOCÊ QUER ESTAR?</span></div>
          <div className="experiences-heading-row">
            <div><p className="eyebrow"><span className="eyebrow-line" /> POSSIBILIDADES SEM LIMITES</p><h2 className="section-heading">O mundo acontece.<br /><em>Esteja nele.</em></h2></div>
            <p>Seja qual for a sua paixão, existe um momento esperando para se tornar inesquecível. Escolha por onde começar.</p>
          </div>
          <div className="experience-grid">
            {experiences.map((experience) => (
              <button className="experience-card" key={experience.number} type="button" onClick={() => startRequest({ category: experience.category })} aria-label={`Solicitar ingressos para ${experience.title}`}>
                <Image src={experience.image} alt={experience.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw" className="cover-image" />
                <span className="experience-overlay" />
                <span className="experience-card-top"><span>{experience.number} / 04</span><ArrowUpRight size={18} strokeWidth={1.5} /></span>
                <span className="experience-card-content"><span className="card-eyebrow">{experience.eyebrow}</span><strong>{experience.title}</strong><span className="card-description">{experience.description}</span><span className="card-explore">EXPLORAR EXPERIÊNCIA <ArrowRight size={16} strokeWidth={1.5} /></span></span>
              </button>
            ))}
          </div>
          <div className="experiences-after"><span>O seu evento não está aqui? Nós também adoramos novos desafios.</span><button type="button" onClick={() => startRequest({ category: "outro" })}>Conte o que procura <ArrowUpRight size={18} /></button></div>
        </div>
      </section>

      <section className="process-section section-pad" id="como-funciona">
        <div className="container process-grid">
          <div className="process-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> SIMPLES PARA VOCÊ, COMPLETO POR TRÁS</p>
            <h2 className="section-heading">O acesso certo.<br /><em>Sem o desgaste.</em></h2>
            <p>Deixe a busca, os detalhes e o acompanhamento com quem gosta de cuidar de tudo. Sua experiência começa com uma conversa.</p>
            <div className="process-promise"><span><LockKeyhole size={24} strokeWidth={1.3} /></span><div><strong>Um compromisso com a sua tranquilidade</strong><small>Transparência antes de qualquer decisão.</small></div></div>
            <a className="button button-outline" href="#solicitar">Começar minha solicitação <ArrowUpRight size={18} /></a>
          </div>
          <div className="process-steps">
            {processSteps.map((step) => (
              <div className="process-step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
                <span className="step-decoration">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section section-pad" id="planos">
        <div className="container">
          <div className="pricing-heading"><p className="eyebrow"><span className="eyebrow-line" /> A EXPERIÊNCIA DO SEU JEITO</p><h2 className="section-heading">Para cada ocasião, <em>um cuidado especial.</em></h2><p>Escolha como quer ser acompanhado. O valor do ingresso é sempre apresentado separadamente.</p></div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={`plan-card ${plan.featured ? "plan-featured" : ""}`} key={plan.id}>
                {plan.featured && <span className="plan-ribbon">MAIS ESCOLHIDO <Star size={12} fill="currentColor" /></span>}
                <div className="plan-top"><span className="plan-eyebrow">{plan.eyebrow}</span><h3>{plan.name}</h3><p>{plan.description}</p></div>
                <div className="plan-price">{plan.id === "prive" ? <strong className="price-consult">{plan.price}</strong> : <><span>A partir de</span><div><small>R$</small><strong>{plan.price}</strong></div></>}<span className="price-suffix">{plan.suffix}</span></div>
                <div className="plan-features"><span>O QUE ESTÁ INCLUÍDO</span><ul>{plan.features.map((feature) => <li key={feature}><Check size={16} strokeWidth={1.8} /> {feature}</li>)}</ul></div>
                <button className={`button ${plan.featured ? "button-gold" : "button-outline"} plan-button`} type="button" onClick={() => startRequest({ plan: plan.id })}>Escolher {plan.name} <ArrowUpRight size={18} /></button>
              </article>
            ))}
          </div>
          <p className="pricing-note"><ShieldCheck size={17} strokeWidth={1.5} /> Taxas de serviço a partir dos valores indicados, por solicitação. Ingressos e despesas adicionais não estão incluídos. Atendimento e disponibilidade sujeitos às condições de cada evento; você recebe a proposta antes de aprovar qualquer compra.</p>
        </div>
      </section>

      <section className="request-section" id="solicitar">
        <div className="request-story">
          <div className="request-story-image" aria-hidden="true" />
          <div className="request-story-inner">
            <p className="eyebrow"><span className="eyebrow-line" /> SEU PRÓXIMO GRANDE MOMENTO</p>
            <h2>Alguns momentos merecem <em>ser vividos de perto.</em></h2>
            <p>Conte-nos a sua ideia. Uma pessoa de verdade vai olhar para ela com o cuidado que merece.</p>
            <div className="request-story-bottom"><span className="request-story-star">✦</span><span>O extraordinário começa com um primeiro passo.</span></div>
          </div>
        </div>
        <div className="request-form-area">
          {submitted ? (
            <div className="request-success" role="status">
              <span className="success-icon"><CheckCircle2 size={32} strokeWidth={1.35} /></span>
              <p className="eyebrow">SOLICITAÇÃO ENVIADA</p>
              <h3>Seu próximo momento<br /><em>começa agora, {submitted.name}.</em></h3>
              <p>Recebemos sua solicitação. Guarde seu protocolo para acompanhar o atendimento. Nossa equipe entrará em contato pelos dados informados.</p>
              <div className="protocol-box"><span>SEU PROTOCOLO</span><strong>{submitted.protocol}</strong><button type="button" onClick={copyProtocol}>{copied ? "Copiado!" : "Copiar protocolo"}</button></div>
              <a className="button button-dark" href={`/acompanhar?protocolo=${encodeURIComponent(submitted.protocol)}`}>Acompanhar solicitação <ArrowUpRight size={19} /></a>
              <a className="success-whatsapp" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá, DG Concierge! Acabei de enviar a solicitação ${submitted.protocol}.`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Prefere falar agora? Chame no WhatsApp</a>
            </div>
          ) : (
            <div className="request-form-container">
              <p className="eyebrow">FALE COM A DG CONCIERGE</p>
              <h3>Vamos fazer <em>acontecer?</em></h3>
              <p className="form-intro">Preencha os detalhes abaixo. É rápido, sem compromisso e o primeiro passo para algo inesquecível.</p>
              <form onSubmit={submitRequest} className="request-form">
                <div className="form-row"><label>Seu nome <span>*</span><input required maxLength={120} autoComplete="name" placeholder="Como podemos chamar você?" value={form.name} onChange={(event) => updateField("name", event.target.value)} /></label><label>WhatsApp <span>*</span><input required type="tel" maxLength={30} autoComplete="tel" placeholder="(00) 00000-0000" value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} /></label></div>
                <label>E-mail <span>*</span><input required type="email" maxLength={255} autoComplete="email" placeholder="seu@email.com" value={form.email} onChange={(event) => updateField("email", event.target.value)} /></label>
                <label>Qual evento você quer viver? <span>*</span><input required maxLength={180} placeholder="Nome do show, jogo ou experiência" value={form.eventName} onChange={(event) => updateField("eventName", event.target.value)} /></label>
                <div className="form-row"><label>Tipo de experiência <span>*</span><select value={form.category} onChange={(event) => updateField("category", event.target.value as RequestCategory)}>{(Object.entries(categoryLabels) as [RequestCategory, string][]).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Cidade do evento <span>*</span><input required maxLength={120} placeholder="Ex.: São Paulo, SP" value={form.city} onChange={(event) => updateField("city", event.target.value)} /></label></div>
                <div className="form-row"><label>Data (se souber)<input type="date" value={form.eventDate} onChange={(event) => updateField("eventDate", event.target.value)} /></label><label>Quantos ingressos? <span>*</span><select value={form.quantity} onChange={(event) => updateField("quantity", event.target.value)}>{Array.from({ length: 12 }, (_, index) => index + 1).map((quantity) => <option value={quantity} key={quantity}>{quantity} {quantity === 1 ? "ingresso" : "ingressos"}</option>)}</select></label></div>
                <label>Tipo de atendimento <span>*</span><select value={form.plan} onChange={(event) => updateField("plan", event.target.value as RequestPlan)}>{(Object.entries(planLabels) as [RequestPlan, string][]).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                <label>Algum detalhe especial? <span className="optional">OPCIONAL</span><textarea maxLength={1000} rows={3} placeholder="Setor desejado, orçamento, acompanhantes ou qualquer preferência..." value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
                <div className="form-honeypot" aria-hidden="true"><label>Deixe este campo em branco<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField("website", event.target.value)} /></label></div>
                <label className="consent-label"><input type="checkbox" checked={form.consent} required onChange={(event) => updateField("consent", event.target.checked)} /><span>Concordo em ser contatado pela DG Concierge sobre esta solicitação e li a <a href="/privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.</span></label>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <button className="button button-dark submit-button" type="submit" disabled={submitting}>{submitting ? "Enviando solicitação..." : "Enviar minha solicitação"} {!submitting && <ArrowUpRight size={19} />}</button>
                <p className="form-security"><LockKeyhole size={14} /> Seus dados são usados apenas para o atendimento. Sem pagamento nesta etapa.</p>
              </form>
            </div>
          )}
        </div>
      </section>

      <section className="faq-section section-pad" id="duvidas">
        <div className="container faq-grid">
          <div className="faq-intro"><p className="eyebrow"><span className="eyebrow-line" /> TUDO COM CLAREZA</p><h2 className="section-heading">Boas experiências começam com <em>confiança.</em></h2><p>Ainda tem alguma dúvida? Estamos aqui para deixar cada detalhe mais simples.</p><a className="inline-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Falar com nossa equipe <ArrowUpRight size={18} /></a></div>
          <div className="faq-list">{faqs.map((faq, index) => <details key={faq.question} className="faq-item"><summary><span className="faq-number">0{index + 1}</span><span>{faq.question}</span><span className="faq-toggle">+</span></summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </section>

      <div className="bottom-cta"><div className="container"><span><Sparkles size={18} /> O SEU LUGAR É ONDE A EMOÇÃO ACONTECE.</span><a href="#solicitar">Vamos começar? <ChevronRight size={18} /></a></div></div>
      <SiteFooter />
      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a DG Concierge pelo WhatsApp"><MessageCircle size={23} strokeWidth={1.7} /><span>Fale com a DG</span></a>
    </main>
  );
}
