import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Cursor } from "@/components/fx/cursor";
import { PointerFx } from "@/components/fx/pointer-fx";
import { IntroGlimpse } from "@/components/intro-glimpse";
import { BackToTop } from "@/components/back-to-top";
import { CommandPalette } from "@/components/command-palette";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hotragnpettugani-design.vercel.app"),
  title: "Hotragn Pettugani · UX Designer & Engineer",
  description:
    "Portfolio of Hotragn Pettugani, a UX designer and engineer who researches real workflows, maps information architecture, designs forgiving flows, and ships the result in code.",
};

export const viewport: Viewport = {
  themeColor: "#faf6e4",
};

// Applied before paint: the theme class (no flash of the wrong palette)
// and the calm-mode class (no flash of motion for someone who already
// asked for none). Both are plain classes on <html>; everything else on
// the site reads them rather than storage.
const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){d.classList.add("dark")}}catch(e){}try{if(localStorage.getItem("calm-mode")==="on"){d.classList.add("calm")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>
          <a className="skip-link" href="#main">Skip to content</a>
          <IntroGlimpse />
          <Cursor />
          <PointerFx />
          <BackToTop />
          <CommandPalette />
          {children}
        </Providers>
      </body>
    </html>
  );
}
