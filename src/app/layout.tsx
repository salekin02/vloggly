import type { Metadata } from "next";
import { Agbalumo, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/open-sauce-sans";
import "@fontsource/open-sauce-sans/400.css";
import "@fontsource/open-sauce-sans/500.css";
import "@fontsource/open-sauce-sans/600.css";
import "@fontsource/open-sauce-sans/700.css";
import { QueryProvider } from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import Lightbox from "@/components/share/common/lightbox";
import Head from "next/head";

// const openSauceSans = Open_Sans({
//   variable: "--font-sans",
//   subsets: ["latin"],
// });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const agbalumo = Agbalumo({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-agbalumo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vloggly",
  description: "",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/src/app/favicon-blue.svg" />
      </Head>
      <body
        className={`${geistMono.variable} ${agbalumo.variable} ${inter.variable} font-sans antialiased bg-neutral-200`}
      >
        <AuthProvider>
          <QueryProvider>
            <div className="">{children}</div>
            <Lightbox />
          </QueryProvider>
        </AuthProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
};

export default RootLayout;
