/**
 * Identidad de marca — única fuente de verdad para el nombre, tagline y
 * metadatos de "Cuentas Claras". Los COLORES viven en src/app/globals.css
 * como variables CSS (convención de Tailwind v4 + shadcn ya establecida en
 * el proyecto) — este archivo no las duplica, solo documenta qué token de
 * globals.css cumple cada rol semántico del sistema de diseño, para que
 * cualquier componente nuevo sepa a qué variable apuntar en vez de
 * inventar un color.
 *
 * Para cambiar el color principal de toda la app: edita --primary en
 * globals.css (:root y .dark). Todo lo demás (botones, focus, links,
 * badges) lo hereda automáticamente porque son utilidades de Tailwind
 * (bg-primary, text-primary, ring-primary, etc.), nunca colores sueltos.
 */

export const brand = {
  name: "Cuentas Claras",
  tagline: "Tu dinero, más claro.",
  description:
    "Control de gastos, deudas, moto y ahorros — sin totalizar nada a mano.",
} as const;

/**
 * Mapa de referencia semántica → token CSS (definido en globals.css).
 * No son valores, son nombres — evita que un componente nuevo hardcodee
 * un color en vez de usar la utilidad de Tailwind correspondiente.
 */
export const semanticTokens = {
  primary: "primary", // bg-primary / text-primary / border-primary
  primaryForeground: "primary-foreground",
  secondary: "secondary",
  secondaryForeground: "secondary-foreground",
  accent: "accent",
  accentForeground: "accent-foreground",
  background: "background",
  surface: "card",
  surfaceForeground: "card-foreground",
  textPrimary: "foreground",
  textSecondary: "muted-foreground",
  textSubtle: "subtle-foreground",
  border: "border",
  ring: "ring",
  success: "success",
  successForeground: "success-foreground",
  warning: "warning",
  warningForeground: "warning-foreground",
  error: "destructive",
  errorForeground: "destructive-foreground",
  info: "info",
  infoForeground: "info-foreground",
} as const;
