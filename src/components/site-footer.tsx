import Link from "next/link";
import { ArrowUpRight, Camera, MessageCircle } from "lucide-react";
import { Brand } from "./brand";

const whatsappUrl = "https://wa.me/5585986608852?text=Ol%C3%A1%2C%20DG%20Concierge!%20Gostaria%20de%20saber%20mais%20sobre%20um%20evento.";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-about">
            <Brand />
            <p>Acesso exclusivo. Experiências inesquecíveis. A sua única tarefa é viver o momento.</p>
          </div>
          <div className="footer-links">
            <span className="footer-title">Explore</span>
            <Link href="/#experiencias">Experiências</Link>
            <Link href="/#como-funciona">Como funciona</Link>
            <Link href="/#planos">Nossos planos</Link>
            <Link href="/acompanhar">Acompanhar pedido</Link>
          </div>
          <div className="footer-links">
            <span className="footer-title">Fale com a DG</span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> (85) 98660-8852</a>
            <a href="https://www.instagram.com/dgconciergebr/" target="_blank" rel="noopener noreferrer"><Camera size={17} /> @dgconciergebr</a>
            <span className="footer-location">Atendimento em todo o Brasil</span>
          </div>
          <div className="footer-invitation">
            <span className="footer-title">O seu próximo momento espera.</span>
            <Link href="/#solicitar">Vamos conversar <ArrowUpRight size={23} strokeWidth={1.5} /></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DG Concierge Brasil. Todos os direitos reservados.</span>
          <span>Feito para momentos que merecem ser vividos.</span>
          <Link href="/privacidade">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
