-- ============================================================================
-- Al crear una cuenta (auth.users), se crea automáticamente un Titular con
-- ese nombre (docs/04-casos-de-uso.md — Caso 0: Gestionar titulares, MVP).
-- No depende de que el frontend recuerde llamarlo: es un trigger a nivel de
-- base de datos, igual que audit_log.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.titular (user_id, nombre)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'nombre', ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
