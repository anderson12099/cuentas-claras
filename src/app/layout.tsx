import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";

// Manrope: sans geométrica con terminales redondeados — más cercana al
// look pedido (referencia HOLCIM go!) que la Geist por defecto de shadcn.
// Un solo family para toda la app; el contraste título/cuerpo se logra con
// peso (700 en títulos, 400-500 en texto), no cambiando de fuente.
const fontSans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cuentas Claras",
  description: "Control de gastos, deudas, moto y ahorros — Anderson y Alejandra",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* bg-background explícito (no heredado) para que no quede ningún
          borde sin pintar al hacer scroll/resize — nunca debe verse un
          degradado ni color por defecto del navegador detrás de la app. */}
      <body className="flex min-h-dvh flex-col bg-background">{children}</body>
    </html>
  );
}
