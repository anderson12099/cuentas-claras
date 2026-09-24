import * as React from "react";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Envoltorio genérico sobre Field/FieldLabel/FieldError de shadcn, para que
 * cada campo de un formulario (login, registro, y los que vengan después)
 * no repita la misma estructura label+input+error+description.
 */
export function FormField({ id, label, error, description, children }: FormFieldProps) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
}
