import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si el middleware falla por algo, esta es la segunda capa de protección.
  if (!user) {
    return null;
  }

  // RLS filtra automáticamente: solo devuelve titulares de este usuario.
  const { data: titulares, error } = await supabase
    .from("titular")
    .select("id, nombre, estado")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cuentas Claras</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <form>
          <Button formAction={signOut} variant="outline" size="sm">
            Cerrar sesión
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Titulares</CardTitle>
          <CardDescription>
            Se crea uno automáticamente al registrarte (Caso de uso 0). Aquí
            confirmamos que RLS está filtrando correctamente por tu usuario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-destructive">
              Error al consultar titulares: {error.message}
            </p>
          )}
          {!error && titulares?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay titulares todavía — no debería pasar si el trigger de
              registro funcionó.
            </p>
          )}
          <ul className="space-y-2">
            {titulares?.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span>{t.nombre}</span>
                <span className="text-xs text-muted-foreground">{t.estado}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
