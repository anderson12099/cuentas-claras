import { Wallet } from "lucide-react";
import { brand } from "@/config/theme";

/**
 * Panel de marca del login/registro — gradiente propio (bg-brand-gradient-*
 * en globals.css), no el degradado accidental que se veía antes. Vive fuera
 * de AuthCard porque solo tiene sentido en pantallas anchas (se oculta en
 * mobile vía el className que le pasa el layout).
 */
export function BrandPanel({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,var(--brand-gradient-from)_0%,var(--brand-gradient-via)_55%,var(--brand-gradient-to)_100%)] p-10 text-brand-gradient-foreground ${className ?? ""}`}
    >
      {/* Glow suave, no una franja — un solo círculo difuminado detrás del
          contenido, para dar profundidad sin volverse decoración ruidosa. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-brand-gradient-glow blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-brand-gradient-glow/60 blur-3xl"
      />

      <div className="relative z-10 flex items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
          <Wallet className="size-5" aria-hidden="true" />
        </span>
        <span className="text-lg font-semibold tracking-tight">{brand.name}</span>
      </div>

      <div className="relative z-10 space-y-2">
        <p className="text-2xl font-bold tracking-tight">{brand.tagline}</p>
        <p className="max-w-xs text-sm text-brand-gradient-foreground/80">
          {brand.description}
        </p>
      </div>
    </div>
  );
}
