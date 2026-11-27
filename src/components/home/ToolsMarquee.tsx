"use client";

const TOOLS = [
  { name: "Guesty", domain: "guesty.com" },
  { name: "Hostaway", domain: "hostaway.com" },
  { name: "Hospitable", domain: "hospitable.com" },
  { name: "OwnerRez", domain: "ownerrez.com" },
  { name: "Jurny", domain: "jurny.com" },
  { name: "PriceLabs", domain: "pricelabs.co" },
  { name: "Wheelhouse", domain: "usewheelhouse.com" },
  { name: "Breezeway", domain: "breezeway.io" },
  { name: "Turno", domain: "turno.com" },
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "Vrbo", domain: "vrbo.com" },
  { name: "Booking.com", domain: "booking.com" },
] as const;

function ToolChip({
  name,
  domain,
  decorative,
}: {
  name: string;
  domain: string;
  decorative?: boolean;
}) {
  return (
    <span className="pt-tools-chip" aria-hidden={decorative || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        }}
      />
      {name}
    </span>
  );
}

/** Scrolling tools strip — logos + names, same motion language as the services marquee. */
export function ToolsMarquee() {
  const loop = [...TOOLS, ...TOOLS];
  return (
    <div className="pt-tools-track" style={{ padding: "4px 0 8px" }}>
      <div className="pt-tools-marquee">
        {loop.map((tool, i) => (
          <ToolChip
            key={`${tool.name}-${i}`}
            name={tool.name}
            domain={tool.domain}
            decorative={i >= TOOLS.length}
          />
        ))}
      </div>
    </div>
  );
}
