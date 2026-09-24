import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IconInputProps extends React.ComponentProps<typeof Input> {
  /** Ícono a la izquierda (Mail, User, etc.) — puramente decorativo, aria-hidden. */
  icon: React.ReactNode;
  invalid?: boolean;
}

/**
 * Input con ícono de contexto a la izquierda y, si el campo es inválido, un
 * ícono de alerta a la derecha — el mismo patrón "llamativo" pedido como
 * referencia: borde, ícono y mensaje en rojo se refuerzan entre sí en vez
 * de depender solo del texto de abajo.
 */
export function IconInput({ icon, invalid, className, ...props }: IconInputProps) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-muted-foreground"
      >
        {icon}
      </span>
      <Input
        {...props}
        aria-invalid={invalid}
        className={cn("pl-9", invalid && "pr-9", className)}
      />
      {invalid && (
        <AlertCircle
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-2.5 my-auto size-4 text-destructive"
        />
      )}
    </div>
  );
}
