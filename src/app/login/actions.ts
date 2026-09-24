"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?mode=login&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nombre = formData.get("nombre") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // El trigger on_auth_user_created (0002_auto_titular.sql) usa este
      // campo para crear el primer Titular con el nombre real, no el email.
      data: { nombre },
    },
  });

  if (error) {
    redirect(`/login?mode=register&error=${encodeURIComponent(error.message)}`);
  }

  // Con "Confirm email" activo en Supabase, signUp no crea sesión: no hay
  // nada que redirigir a "/" todavía (el middleware lo devolvería a /login).
  // session === null es la señal de que falta confirmar el correo.
  if (!data.session) {
    redirect(`/login?mode=login&notice=check-email`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
