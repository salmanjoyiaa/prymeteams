import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { BrandSplash } from "@/components/brand/BrandSplash";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://prymeteams.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Pryme Teams — Customer Success for Property Managers",
    template: "%s · Pryme Teams",
  },
  description:
    "Dedicated Customer Success Experts for Short-Term and Vacation Rental Property Managers. Guest Experience, Revenue and Owner Relations — live in 48 Hours, on Camera.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=4", sizes: "48x48" },
      { url: "/brand/pryme-favicon.svg?v=4", type: "image/svg+xml" },
      {
        url: "/brand/pryme-favicon-32.png?v=4",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico?v=4",
    apple: [{ url: "/brand/pryme-icon-180.png?v=4", sizes: "180x180" }],
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090F" },
    { media: "(prefers-color-scheme: light)", color: "#07090F" },
  ],
  openGraph: {
    title:
      "Pryme Teams — Customer Success for Property Managers",
    description:
      "Dedicated Experts for STR Property Managers and Growing Hosts. Guest Experience, Revenue and Owner Relations — live in 48 Hours.",
    url: siteUrl,
    siteName: "Pryme Teams",
    images: [
      {
        url: "/brand/pryme-logo-full-on-dark.png",
        width: 1600,
        height: 794,
        alt: "Pryme Teams — Customer Success Experts",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pryme Teams — Customer Success for Property Managers",
    description:
      "Dedicated Experts for STR Property Managers and Growing Hosts. Live in 48 Hours, on Camera.",
    images: ["/brand/pryme-logo-full-on-dark.png"],
  },
};

const splashBootScript = `(function(){try{if(sessionStorage.getItem('pt-splash-seen')==='1')document.documentElement.classList.add('pt-splash-skip')}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/brand/pryme-logo-full-on-dark.png"
        />
        <script dangerouslySetInnerHTML={{ __html: splashBootScript }} />
      </head>
      <body
        style={
          {
            ["--head" as string]: "var(--font-archivo), system-ui, sans-serif",
            ["--accent" as string]: "#2EE6A0",
          } as React.CSSProperties
        }
      >
        <BrandSplash />
        {children}
      </body>
    </html>
  );
}
