import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Política de Privacidade | DG Concierge Brasil",
  description: "Saiba como a DG Concierge Brasil utiliza os dados informados em suas solicitações.",
};

export default function PrivacyPage() {
  return (
    <main className="inner-page">
      <SiteHeader inner />
      <section className="inner-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-line" /> TRANSPARÊNCIA EM CADA DETALHE</p><h1>Política de <em>privacidade.</em></h1><p>Seu contato é tratado com o mesmo cuidado que dedicamos à sua experiência.</p></div></section>
      <article className="privacy-content">
        <p>Esta política explica como a DG Concierge Brasil trata as informações fornecidas por você ao solicitar uma assessoria de ingressos ou entrar em contato por nossos canais.</p>
        <h2>Quais dados recebemos</h2>
        <p>Podemos receber nome, e-mail, telefone/WhatsApp, evento desejado, cidade, data, quantidade de ingressos, plano de atendimento e os detalhes que você incluir voluntariamente no formulário. Também registramos o protocolo e o andamento da solicitação.</p>
        <h2>Para que usamos esses dados</h2>
        <p>Utilizamos as informações para entender sua solicitação, entrar em contato, buscar possibilidades de atendimento, apresentar propostas, acompanhar a operação e permitir que você consulte o status pelo protocolo e e-mail. Não solicitamos dados de pagamento no formulário do site.</p>
        <h2>Compartilhamento e segurança</h2>
        <p>O acesso aos dados é destinado à operação do atendimento. Informações necessárias à eventual compra poderão ser tratadas com canais oficiais ou parceiros envolvidos na experiência, mediante sua aprovação e conforme as regras aplicáveis. Adotamos medidas técnicas e organizacionais razoáveis para proteger os registros.</p>
        <h2>Seus direitos</h2>
        <p>Você pode pedir informações sobre seus dados, correção ou exclusão quando cabível. Para isso, entre em contato pelo <a href="https://wa.me/5585986608852" target="_blank" rel="noopener noreferrer">WhatsApp (85) 98660-8852</a>. Mantemos os registros pelo tempo necessário ao atendimento e às obrigações legais aplicáveis.</p>
        <h2>Atualizações</h2>
        <p>Esta política pode ser atualizada para refletir mudanças na operação ou na legislação. A versão vigente estará sempre disponível nesta página.</p>
      </article>
      <SiteFooter />
    </main>
  );
}
