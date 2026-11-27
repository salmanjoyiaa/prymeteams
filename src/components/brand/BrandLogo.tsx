type BrandLogoProps = {
  /** Visual size preset */
  size?: "nav" | "footer" | "page" | "admin" | "adminCompact";
  className?: string;
  alt?: string;
};

const SIZE_CLASS: Record<NonNullable<BrandLogoProps["size"]>, string> = {
  nav: "pt-brand-logo",
  footer: "pt-brand-logo pt-brand-logo--footer",
  page: "pt-brand-logo pt-brand-logo--page",
  admin: "admin-brand-logo",
  adminCompact: "admin-brand-logo admin-brand-logo--compact",
};

/** Maison Classic lockup used across marketing + admin. */
export function BrandLogo({
  size = "nav",
  className = "",
  alt = "Pryme Teams",
}: BrandLogoProps) {
  return (
    <img
      src="/brand/pryme-logo-header.png"
      alt={alt}
      className={`${SIZE_CLASS[size]}${className ? ` ${className}` : ""}`}
      width={193}
      height={96}
      decoding="async"
    />
  );
}
