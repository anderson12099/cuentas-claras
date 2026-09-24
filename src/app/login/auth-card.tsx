"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { PasswordInput } from "@/components/forms/password-input";
import { SecurityNotice } from "@/components/ui/security-notice";
import { Logo } from "@/components/brand/logo";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { authMessages, genericMessages } from "@/config/messages";
import { login, signup } from "./actions";

type AuthMode = "login" | "register";

interface FormValues {
  nombre?: string;
  email: string;
  password: string;
}

interface AuthCardProps {
  initialMode: AuthMode;
  serverError?: string;
  notice?: string;
}

/**
 * Tarjeta única de autenticación con dos modos (login/registro). Un solo
 * componente en vez de dos pantallas para no duplicar layout, tokens ni
 * copys — el campo Nombre solo existe (y solo se valida) en modo registro.
 */
export function AuthCard({ initialMode, serverError, notice }: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [isPending, startTransition] = React.useTransition();
  const [formError, setFormError] = React.useState<string | undefined>(serverError);

  const resolver: Resolver<FormValues> = React.useCallback(async (values) => {
    const schema = mode === "login" ? loginSchema : registerSchema;
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data as FormValues, errors: {} };
    }
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = { type: "validation", message: issue.message };
    }
    return { values: {}, errors };
  }, [mode]);

  const form = useForm<FormValues>({
    resolver,
    defaultValues: { nombre: "", email: "", password: "" },
    mode: "onSubmit",
  });

  function toggleMode() {
    const next = mode === "login" ? "register" : "login";
    setMode(next);
    setFormError(undefined);
    form.reset({ nombre: "", email: "", password: "" });
    router.replace(`/login?mode=${next}`, { scroll: false });
  }

  function onSubmit(values: FormValues) {
    setFormError(undefined);
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    if (mode === "register") {
      formData.set("nombre", values.nombre ?? "");
    }

    startTransition(async () => {
      try {
        if (mode === "login") {
          await login(formData);
        } else {
          await signup(formData);
        }
      } catch (err) {
        // redirect() de Next.js lanza internamente para interrumpir el
        // render — no es un error real, dejarlo pasar.
        if (err instanceof Error && err.message === "NEXT_REDIRECT") return;
        setFormError(genericMessages.unexpectedError);
      }
    });
  }

  const copy = authMessages[mode];
  const errors = form.formState.errors;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <Logo className="mb-2" />
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          {mode === "register" && (
            <FormField
              id="nombre"
              label={authMessages.fields.nombre.label}
              error={errors.nombre?.message}
              description={
                !errors.nombre ? authMessages.fields.nombre.description : undefined
              }
            >
              <Input
                id="nombre"
                type="text"
                autoComplete="name"
                placeholder={authMessages.fields.nombre.placeholder}
                aria-invalid={!!errors.nombre}
                {...form.register("nombre")}
              />
            </FormField>
          )}

          <FormField
            id="email"
            label={authMessages.fields.email.label}
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={authMessages.fields.email.placeholder}
              aria-invalid={!!errors.email}
              {...form.register("email")}
            />
          </FormField>

          <FormField
            id="password"
            label={authMessages.fields.password.label}
            error={errors.password?.message}
          >
            <PasswordInput
              id="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={authMessages.fields.password.placeholder}
              aria-invalid={!!errors.password}
              {...form.register("password")}
            />
          </FormField>

          {notice === "check-email" && (
            <p
              className="rounded-md bg-info/10 px-3 py-2 text-sm text-info"
              role="status"
            >
              {authMessages.notices.checkEmail}
            </p>
          )}

          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" className="w-full" loading={isPending}>
            {isPending ? copy.submitLoading : copy.submit}
          </Button>
        </form>

        <button
          type="button"
          onClick={toggleMode}
          className="mt-4 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {copy.switchPrompt}{" "}
          <span className="font-medium text-primary">{copy.switchAction}</span>
        </button>
      </CardContent>
      <CardFooter>
        <SecurityNotice
          title={authMessages.security.title}
          description={authMessages.security.description}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
