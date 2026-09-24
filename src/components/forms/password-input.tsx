"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authMessages } from "@/config/messages";

type PasswordInputProps = React.ComponentProps<typeof Input> & {
  invalid?: boolean;
};

/**
 * Input de contraseña: ícono de candado a la izquierda (mismo patrón que
 * IconInput) y toggle mostrar/ocultar a la derecha. No se combina con el
 * ícono de alerta de IconInput porque el toggle ya ocupa ese espacio — el
 * error se refuerza con el borde rojo y el mensaje debajo.
 */
export function PasswordInput({ className, invalid, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Lock
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 my-auto ml-3 size-4 text-muted-foreground"
      />
      <Input
        {...props}
        aria-invalid={invalid}
        type={visible ? "text" : "password"}
        className={cn("pl-9 pr-10", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={
          visible
            ? authMessages.fields.password.toggleHide
            : authMessages.fields.password.toggleShow
        }
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
