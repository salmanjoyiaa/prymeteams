import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pryme Teams — Dedicated Customer Success Experts",
    template: "%s · Pryme Teams",
  },
  description:
    "Hire one dedicated Customer Success Expert or a whole team. Same people every shift, on-site in our office, QA-checked, live camera access. Live in 48 hours.",
  icons: {
    icon: [
      { url: "/brand/pryme-favicon.svg", type: "image/svg+xml" },
      { url: "/brand/pryme-favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/brand/pryme-icon-180.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Pryme Teams — Dedicated Customer Success Experts",
    description:
      "Hire one dedicated Customer Success Expert or a whole team. Live in 48 hours.",
    images: [{ url: "/brand/pryme-logo-full-on-dark.png" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body
        style={
          {
            ["--head" as string]: "var(--font-archivo), system-ui, sans-serif",
            ["--accent" as string]: "#2EE6A0",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
