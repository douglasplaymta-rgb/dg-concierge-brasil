import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "DG Concierge Brasil | O extraordinário acontece ao vivo",
  description:
    "Assessoria de compra de ingressos oficiais para shows, festivais, esportes e experiências VIP. Atendimento personalizado, segurança e tranquilidade em cada detalhe.",
  keywords: [
    "DG Concierge Brasil",
    "concierge de ingressos",
    "ingressos oficiais",
    "shows",
    "experiências VIP",
    "assessoria de ingressos",
  ],
  openGraph: {
    title: "DG Concierge Brasil | O extraordinário acontece ao vivo",
    description:
      "Você escolhe a experiência. A DG cuida do caminho até ela.",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/images/hero-concert.jpg" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
