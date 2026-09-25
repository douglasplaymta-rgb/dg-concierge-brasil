"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";

export function SiteHeader({ inner = false }: { inner?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${inner ? "site-header-inner" : ""}`}>
      <div className="site-header-content container">
        <Brand />
        <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Navegação principal">
          <Link href="/#inicio" onClick={closeMenu}>Início</Link>
          <Link href="/#experiencias" onClick={closeMenu}>Experiências</Link>
          <Link href="/#como-funciona" onClick={closeMenu}>Como funciona</Link>
          <Link href="/#planos" onClick={closeMenu}>Planos</Link>
          <Link className="mobile-nav-track" href="/acompanhar" onClick={closeMenu}>Acompanhar pedido</Link>
          <Link className="mobile-nav-cta" href="/#solicitar" onClick={closeMenu}>Falar com concierge <ArrowUpRight size={17} /></Link>
        </nav>
        <div className="header-actions">
          <Link className="header-track" href="/acompanhar">Acompanhar pedido</Link>
          <Link className="header-cta" href="/#solicitar">Falar com concierge <ArrowUpRight size={16} strokeWidth={1.8} /></Link>
        </div>
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={25} strokeWidth={1.5} /> : <Menu size={25} strokeWidth={1.5} />}
        </button>
      </div>
    </header>
  );
}
