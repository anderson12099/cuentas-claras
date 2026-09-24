-- ============================================================================
-- Cuentas Claras — Esquema inicial (cierre de Fases 0-8)
-- Fuente: docs/08-modelo-datos.md — no inventa campos fuera de ese documento.
-- Principio de seguridad: RLS habilitado en TODA tabla con titular_id/user_id,
-- como control primario de aislamiento (docs/06-requisitos-no-funcionales.md).
-- ============================================================================

-- ============================================================================
-- 1. TITULAR — unidad de aislamiento (docs/08-modelo-datos.md §1)
-- ============================================================================
create table titular (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  nombre text not null check (length(nombre) > 0),
  estado text not null default 'activo' check (estado in ('activo','archivado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_titular_user on titular(user_id);

-- ============================================================================
-- 2. ACCOUNT (§2)
-- ============================================================================
create table account (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  nombre text not null,
  tipo text not null check (tipo in ('efectivo','banco','otro')),
  saldo_inicial numeric(14,2) not null default 0,
  estado text not null default 'activo' check (estado in ('activo','archivado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_account_titular on account(titular_id);

-- ============================================================================
-- 3. CATEGORY — compartida por user_id, no por titular (§3, §0)
-- ============================================================================
create table category (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  nombre text not null,
  tipo_movimiento text not null check (tipo_movimiento in ('ingreso','gasto','ambos')),
  icono text,
  color text,
  parent_id uuid references category(id),
  estado text not null default 'activo' check (estado in ('activo','archivado'))
);
create unique index uq_category_nombre_activo
  on category(user_id, nombre) where estado = 'activo';

-- ============================================================================
-- 4. TRANSACTION — el corazón del sistema (§4)
-- ============================================================================
create table transaction (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  account_id uuid not null references account(id),
  category_id uuid references category(id),
  tipo text not null check (tipo in ('gasto','ingreso','transferencia','ajuste')),
  monto numeric(14,2) not null check (monto > 0),
  fecha date not null default current_date,
  descripcion text,
  recurring_expense_id uuid, -- FK diferida al final (recurring_expense se crea después)
  estado text not null default 'activo' check (estado in ('activo','anulado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_transaction_titular_fecha on transaction(titular_id, fecha desc);
create index idx_transaction_account on transaction(account_id);
create index idx_transaction_category on transaction(category_id);

-- ============================================================================
-- 5. AUDIT_LOG — inmutable, solo INSERT (§5)
-- ============================================================================
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  entidad_tipo text not null,
  entidad_id uuid not null,
  titular_id uuid not null references titular(id),
  campo text not null,
  valor_anterior text,
  valor_nuevo text,
  changed_at timestamptz not null default now(),
  changed_by uuid references auth.users(id)
);
create index idx_audit_entidad on audit_log(entidad_tipo, entidad_id);

-- ============================================================================
-- 6-7. DEBT / DEBT_PAYMENT (§6, §7)
-- ============================================================================
create table debt (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  acreedor text not null,
  monto_inicial numeric(14,2) not null check (monto_inicial > 0),
  saldo_pendiente numeric(14,2) not null default 0,
  fecha_inicio date not null,
  fecha_vencimiento date,
  cuota_pactada numeric(14,2),
  frecuencia text,
  tasa_interes numeric(5,2), -- Fase 2
  estado text not null default 'activa' check (estado in ('activa','pagada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_debt_titular_estado on debt(titular_id, estado);

create table debt_payment (
  id uuid primary key default gen_random_uuid(),
  debt_id uuid not null references debt(id),
  monto numeric(14,2) not null check (monto > 0),
  fecha date not null,
  estado text not null default 'activo' check (estado in ('activo','anulado')),
  created_at timestamptz not null default now()
);
create index idx_debt_payment_debt on debt_payment(debt_id);

-- ============================================================================
-- 8. LOAN / LOAN_PAYMENT (§8)
-- ============================================================================
create table loan (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  direccion text not null check (direccion in ('recibido','otorgado')),
  persona_entidad text not null,
  monto numeric(14,2) not null check (monto > 0),
  fecha date not null,
  tiene_intereses boolean not null default false,
  tiene_cuotas boolean not null default false,
  fecha_vencimiento date,
  saldo_pendiente numeric(14,2) not null default 0,
  estado text not null default 'activo' check (estado in ('activo','pagado')),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_loan_titular_direccion on loan(titular_id, direccion);

create table loan_payment (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references loan(id),
  monto numeric(14,2) not null check (monto > 0),
  fecha date not null,
  estado text not null default 'activo' check (estado in ('activo','anulado')),
  created_at timestamptz not null default now()
);
create index idx_loan_payment_loan on loan_payment(loan_id);

-- ============================================================================
-- 9. MOTORCYCLE / MOTORCYCLE_PAYMENT — módulo diferenciador (§9)
-- ============================================================================
create table motorcycle (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  nombre text not null,
  valor_inicial numeric(14,2),
  saldo_financiacion numeric(14,2) not null,
  cuota_pactada numeric(14,2) not null check (cuota_pactada > 0),
  numero_total_cuotas int not null check (numero_total_cuotas > 0),
  tasa_interes_mensual numeric(6,4) not null,
  fecha_inicio date not null,
  estado text not null default 'activa' check (estado in ('activa','pagada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_motorcycle_titular on motorcycle(titular_id);

create table motorcycle_payment (
  id uuid primary key default gen_random_uuid(),
  motorcycle_id uuid not null references motorcycle(id),
  tipo text not null check (tipo in ('cuota','abono_capital')),
  monto numeric(14,2) not null check (monto > 0),
  fecha date not null,
  saldo_antes numeric(14,2) not null,
  saldo_despues numeric(14,2) not null,
  interes_periodo numeric(14,2),
  capital_periodo numeric(14,2),
  cuotas_restantes_despues int,
  estado text not null default 'activo' check (estado in ('activo','anulado')),
  created_at timestamptz not null default now()
);
create index idx_moto_payment_moto_fecha on motorcycle_payment(motorcycle_id, fecha);

-- ============================================================================
-- 10. SAVINGS_GOAL / SAVINGS_CONTRIBUTION (§10)
-- ============================================================================
create table savings_goal (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  nombre text not null,
  monto_objetivo numeric(14,2) not null check (monto_objetivo > 0),
  fecha_objetivo date,
  estado text not null default 'activa' check (estado in ('activa','cumplida','archivada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_savings_goal_titular on savings_goal(titular_id);

create table savings_contribution (
  id uuid primary key default gen_random_uuid(),
  savings_goal_id uuid not null references savings_goal(id),
  tipo text not null check (tipo in ('aporte','retiro')),
  monto numeric(14,2) not null check (monto > 0),
  fecha date not null,
  estado text not null default 'activo' check (estado in ('activo','anulado')),
  created_at timestamptz not null default now()
);
create index idx_savings_contribution_goal on savings_contribution(savings_goal_id);

-- ============================================================================
-- 11. RECURRING_EXPENSE — Fase 2 (§11). Tabla creada ahora (schema ya cerrado
-- en Fase 8); la funcionalidad de UI/generación automática se construye en Fase 2.
-- ============================================================================
create table recurring_expense (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  concepto text not null,
  monto numeric(14,2),
  es_fijo boolean not null default true,
  category_id uuid references category(id),
  account_id uuid references account(id),
  frecuencia text,
  fecha_inicio date not null,
  fecha_fin date,
  estado text not null default 'activo' check (estado in ('activo','pausado','archivado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_recurring_expense_titular on recurring_expense(titular_id);

alter table transaction
  add constraint fk_transaction_recurring_expense
  foreign key (recurring_expense_id) references recurring_expense(id);

-- ============================================================================
-- 12. ACTIVITY* — módulo actividades/finca, Fase 2 (§12)
-- ============================================================================
create table activity (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  nombre text not null,
  tipo text,
  fecha date not null,
  descripcion text,
  estado text not null default 'abierta' check (estado in ('abierta','cerrada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_activity_titular on activity(titular_id);

create table activity_participant (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activity(id),
  nombre text not null,
  telefono text,
  documento_identidad text, -- dato sensible: off por defecto en UI (minimización de datos)
  created_at timestamptz not null default now()
);
create index idx_activity_participant_activity on activity_participant(activity_id);

create table activity_contribution (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activity(id),
  participant_id uuid not null references activity_participant(id),
  monto numeric(14,2) not null check (monto > 0),
  fecha date not null,
  created_at timestamptz not null default now()
);
create index idx_activity_contribution_activity on activity_contribution(activity_id);

create table activity_expense (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activity(id),
  descripcion text not null,
  cantidad numeric(14,2) not null check (cantidad > 0),
  precio_unitario numeric(14,2) not null check (precio_unitario >= 0),
  monto_total numeric(14,2) generated always as (cantidad * precio_unitario) stored,
  created_at timestamptz not null default now()
);
create index idx_activity_expense_activity on activity_expense(activity_id);

-- ============================================================================
-- 13. REMINDER / NOTIFICATION — Fase 2 (§13)
-- ============================================================================
create table reminder (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  entidad_tipo text not null,
  entidad_id uuid not null,
  fecha_alerta date not null,
  anticipacion_dias int not null default 0,
  estado text not null default 'pendiente' check (estado in ('pendiente','enviado','cancelado')),
  created_at timestamptz not null default now()
);
create index idx_reminder_titular on reminder(titular_id);

create table notification (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id), -- notifica al login, no al titular (§13)
  canal text not null check (canal in ('email','push')),
  mensaje text not null,
  enviado_en timestamptz,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now()
);
create index idx_notification_user on notification(user_id);

-- ============================================================================
-- 14. IMPORT_BATCH / IMPORT_ROW — Fase 2, migración Excel (§14)
-- ============================================================================
create table import_batch (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  archivo_nombre text not null,
  estado text not null default 'en_progreso'
    check (estado in ('en_progreso','confirmado','revertido','fallido')),
  iniciado_en timestamptz not null default now(),
  finalizado_en timestamptz
);
create index idx_import_batch_titular on import_batch(titular_id);

create table import_row (
  id uuid primary key default gen_random_uuid(),
  import_batch_id uuid not null references import_batch(id),
  fila_original jsonb not null,
  estado text not null default 'válida' check (estado in ('válida','con_error','importada')),
  error text,
  transaction_id uuid references transaction(id)
);
create index idx_import_row_batch on import_row(import_batch_id);

-- ============================================================================
-- 15. TAG — Fase 2, opcional (§15)
-- ============================================================================
create table tag (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  nombre text not null
);
create unique index uq_tag_user_nombre on tag(user_id, nombre);

create table transaction_tag (
  transaction_id uuid not null references transaction(id),
  tag_id uuid not null references tag(id),
  primary key (transaction_id, tag_id)
);

-- ============================================================================
-- 18. VISTAS DE SALDO — fuente de verdad, nunca calculado en frontend (§18)
-- ============================================================================
create view account_balance as
select
  a.id as account_id,
  a.titular_id,
  a.saldo_inicial + coalesce(sum(
    case t.tipo
      when 'gasto' then -t.monto
      when 'ingreso' then t.monto
      else 0
    end
  ) filter (where t.estado = 'activo'), 0) as saldo_actual
from account a
left join transaction t on t.account_id = a.id
group by a.id, a.titular_id, a.saldo_inicial;

-- NOTA: "disponible", "comprometido", "ahorrado" y "patrimonio neto" quedan
-- pendientes de fórmula exacta (docs/08-modelo-datos.md §19, caso de uso 17).
-- No se inventa aquí — solo se expone lo ya definido (saldo_total, deuda_pendiente).
create view titular_dashboard as
select
  ti.id as titular_id,
  coalesce(sum(ab.saldo_actual), 0) as saldo_total,
  coalesce((select sum(d.saldo_pendiente) from debt d
            where d.titular_id = ti.id and d.estado = 'activa'), 0) as deuda_pendiente
from titular ti
left join account_balance ab on ab.titular_id = ti.id
group by ti.id;

-- ============================================================================
-- ROW LEVEL SECURITY — aislamiento por titular_id / user_id (§19, regla más
-- crítica de docs/06-requisitos-no-funcionales.md). Toda tabla queda protegida,
-- no solo el ejemplo ilustrativo del documento de diseño.
-- ============================================================================

-- Tablas con titular_id directo: mismo patrón reutilizado.
do $$
declare
  t text;
  tablas_titular text[] := array[
    'account','transaction','audit_log','debt','loan','motorcycle',
    'savings_goal','recurring_expense','activity','reminder','import_batch'
  ];
begin
  foreach t in array tablas_titular loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy "own_by_titular" on %I for all
         using (titular_id in (select id from titular where user_id = auth.uid()))
         with check (titular_id in (select id from titular where user_id = auth.uid()));',
      t
    );
  end loop;
end $$;

-- AUDIT_LOG es inmutable: sustituye la política "for all" genérica por
-- select+insert únicamente (sin policy de update/delete => bloqueados por RLS).
drop policy "own_by_titular" on audit_log;
alter table audit_log enable row level security;
create policy "audit_select_own" on audit_log
  for select
  using (titular_id in (select id from titular where user_id = auth.uid()));
create policy "audit_insert_own" on audit_log
  for insert
  with check (titular_id in (select id from titular where user_id = auth.uid()));

-- TITULAR: filtra directo por user_id (no hay una capa de titular sobre sí misma).
alter table titular enable row level security;
create policy "own_titular" on titular
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- CATEGORY / TAG / NOTIFICATION: comparten user_id directamente (§0, §13).
alter table category enable row level security;
create policy "own_by_user" on category
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table tag enable row level security;
create policy "own_by_user" on tag
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table notification enable row level security;
create policy "own_by_user" on notification
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Tablas hijas sin titular_id directo: se valida vía el padre.
alter table debt_payment enable row level security;
create policy "own_via_debt" on debt_payment
  for all
  using (debt_id in (
    select d.id from debt d join titular t on t.id = d.titular_id
    where t.user_id = auth.uid()))
  with check (debt_id in (
    select d.id from debt d join titular t on t.id = d.titular_id
    where t.user_id = auth.uid()));

alter table loan_payment enable row level security;
create policy "own_via_loan" on loan_payment
  for all
  using (loan_id in (
    select l.id from loan l join titular t on t.id = l.titular_id
    where t.user_id = auth.uid()))
  with check (loan_id in (
    select l.id from loan l join titular t on t.id = l.titular_id
    where t.user_id = auth.uid()));

alter table motorcycle_payment enable row level security;
create policy "own_via_motorcycle" on motorcycle_payment
  for all
  using (motorcycle_id in (
    select m.id from motorcycle m join titular t on t.id = m.titular_id
    where t.user_id = auth.uid()))
  with check (motorcycle_id in (
    select m.id from motorcycle m join titular t on t.id = m.titular_id
    where t.user_id = auth.uid()));

alter table savings_contribution enable row level security;
create policy "own_via_savings_goal" on savings_contribution
  for all
  using (savings_goal_id in (
    select s.id from savings_goal s join titular t on t.id = s.titular_id
    where t.user_id = auth.uid()))
  with check (savings_goal_id in (
    select s.id from savings_goal s join titular t on t.id = s.titular_id
    where t.user_id = auth.uid()));

alter table activity_participant enable row level security;
create policy "own_via_activity" on activity_participant
  for all
  using (activity_id in (
    select a.id from activity a join titular t on t.id = a.titular_id
    where t.user_id = auth.uid()))
  with check (activity_id in (
    select a.id from activity a join titular t on t.id = a.titular_id
    where t.user_id = auth.uid()));

alter table activity_contribution enable row level security;
create policy "own_via_activity" on activity_contribution
  for all
  using (activity_id in (
    select a.id from activity a join titular t on t.id = a.titular_id
    where t.user_id = auth.uid()))
  with check (activity_id in (
    select a.id from activity a join titular t on t.id = a.titular_id
    where t.user_id = auth.uid()));

alter table activity_expense enable row level security;
create policy "own_via_activity" on activity_expense
  for all
  using (activity_id in (
    select a.id from activity a join titular t on t.id = a.titular_id
    where t.user_id = auth.uid()))
  with check (activity_id in (
    select a.id from activity a join titular t on t.id = a.titular_id
    where t.user_id = auth.uid()));

alter table import_row enable row level security;
create policy "own_via_import_batch" on import_row
  for all
  using (import_batch_id in (
    select b.id from import_batch b join titular t on t.id = b.titular_id
    where t.user_id = auth.uid()))
  with check (import_batch_id in (
    select b.id from import_batch b join titular t on t.id = b.titular_id
    where t.user_id = auth.uid()));

alter table transaction_tag enable row level security;
create policy "own_via_transaction" on transaction_tag
  for all
  using (transaction_id in (
    select tr.id from transaction tr join titular t on t.id = tr.titular_id
    where t.user_id = auth.uid()))
  with check (transaction_id in (
    select tr.id from transaction tr join titular t on t.id = tr.titular_id
    where t.user_id = auth.uid()));
