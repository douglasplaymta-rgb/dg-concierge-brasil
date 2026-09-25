import Link from "next/link";

type BrandProps = {
  small?: boolean;
};

export function Brand({ small = false }: BrandProps) {
  return (
    <Link
      className={`brand ${small ? "brand-small" : ""}`}
      href="/"
      aria-label="DG Concierge Brasil — voltar ao início"
    >
      <span className="brand-monogram" aria-hidden="true">
        <span>D</span><span>G</span><i>✦</i>
      </span>
      <span className="brand-wordmark">
        <span>CONCIERGE</span>
        <span className="brand-country"><i />BRASIL<i /></span>
      </span>
    </Link>
  );
}
