import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityNoticeProps {
  title: string;
  description: string;
  className?: string;
}

/**
 * Bloque de confianza (ícono + título + descripción) para reemplazar texto
 * suelto de "tus datos están protegidos". Reutilizable en cualquier pantalla
 * que necesite comunicar una garantía de seguridad sin escribir markup nuevo.
 */
export function SecurityNotice({ title, description, className }: SecurityNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3",
        className
      )}
    >
      <ShieldCheck
        className="mt-0.5 size-4 shrink-0 text-success"
        aria-hidden="true"
      />
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p className="text-xs text-subtle-foreground">{description}</p>
      </div>
    </div>
  );
}
