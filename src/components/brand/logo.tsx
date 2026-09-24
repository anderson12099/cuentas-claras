import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/config/theme";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

/**
 * Wordmark + icono de "Cuentas Claras". Único lugar donde se compone el
 * logo — si cambia el nombre o el ícono, se cambia aquí, no en cada pantalla.
 */
export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wallet className="size-5" aria-hidden="true" />
      </span>
      {!iconOnly && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {brand.name}
        </span>
      )}
    </div>
  );
}
