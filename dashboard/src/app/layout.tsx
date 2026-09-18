import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CYBER.AR — Defense Console | SOC SOAR Dashboard",
  description: "Consola táctica de mitigación perimetral y respuesta ante incidentes Human-in-the-Loop - Hackathon CyberAr 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">{children}</body>
    </html>
  );
}
