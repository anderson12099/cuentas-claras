# Fase 8 — Modelo de datos

> Depende de `05-requisitos-funcionales.md`, `06-requisitos-no-funcionales.md` y
> `07-arquitectura-tecnologica.md` (Fases 4-7, cerradas). Motor: **PostgreSQL (Supabase)**, con
> **row-level security (RLS) por `titular_id`** como control primario de aislamiento (ver
> `06-requisitos-no-funcionales.md`). Para cada entidad: propósito, campos, tipo, obligatorio/
> opcional, relaciones, índices, restricciones, campos de auditoría y estrategia de eliminación
> (nunca borrado físico de movimientos financieros — regla 17 de `CLAUDE.md`).
>
> **Cierre de las Fases 0-8**: con este documento se cierra el bloque de descubrimiento y diseño
> que `00-plan-trabajo.md` §4 marca como condición para empezar a escribir código de producto
> (regla 1 de `CLAUDE.md`).

## 0. Decisiones de modelado transversales

- **`Titular` es la unidad de aislamiento**, no `auth.users` directamente. Un login
  (`auth.users`, gestionado por Supabase Auth) tiene 1 o más `Titular`. Toda entidad financiera
  referencia `titular_id`, nunca `user_id` directamente — así el aislamiento entre titulares se
  aplica con una sola política de RLS reutilizada en cada tabla (ver §7).
- **Sin entidad `Currency`**: el usuario confirmó COP única (`00-plan-trabajo.md` §3.2) — todos
  los montos son `numeric` en pesos colombianos, sin columna de moneda. Si más adelante se
  necesita multi-moneda, se agrega entonces (decisión reversible, no se sobre-diseña ahora).
- **`Category` es compartida entre titulares** del mismo login (supuesto declarado en
  `05-requisitos-funcionales.md` — a confirmar con el usuario si prefiere lo contrario).
- **Anulación, no borrado físico**: toda entidad transaccional (`Transaction`, `DebtPayment`,
  `LoanPayment`, `MotorcyclePayment`, `SavingsContribution`) tiene una columna `estado` que
  incluye `anulado`; nunca se hace `DELETE` sobre estas filas desde la aplicación.
- **Auditoría genérica**: en vez de una tabla de auditoría por entidad, una sola tabla
  `AuditLog` polimórfica (`entidad_tipo` + `entidad_id`) cubre todas — más simple de mantener y
  de consultar (caso de uso 23).
- **Montos**: tipo `numeric(14,2)` en todos los campos monetarios (nunca `float`/`double`, que
  introduce errores de redondeo inaceptables en dinero real).

## 1. Entidad `Titular`

- **Propósito**: representa a cada persona cuyas finanzas se llevan en la app (el usuario y,
  por ahora, Alejandra — ver `00-plan-trabajo.md` §3.8). No tiene credenciales propias.
- **Campos**: `id` (uuid, PK), `user_id` (uuid, FK a `auth.users`, obligatorio), `nombre`
  (text, obligatorio), `estado` (`activo`/`archivado`, obligatorio, default `activo`),
  `created_at`, `updated_at` (timestamptz, automáticos).
- **Relaciones**: 1 `auth.users` → N `Titular`. Referenciado por `Account`, `Transaction`,
  `Debt`, `Loan`, `Motorcycle`, `SavingsGoal`, `RecurringExpense`, `Activity`.
- **Índices**: `(user_id)`.
- **Restricciones**: `nombre` no vacío.
- **Eliminación**: nunca física si tiene entidades asociadas — solo `estado = archivado`.

## 2. Entidad `Account` (cuenta o bolsillo)

- **Campos**: `id` (uuid, PK), `titular_id` (FK, obligatorio), `nombre` (text, obligatorio),
  `tipo` (`efectivo`/`banco`/`otro`, obligatorio), `saldo_inicial` (numeric(14,2), obligatorio,
  default 0), `estado` (`activo`/`archivado`), `created_at`, `updated_at`.
- **Relaciones**: N `Account` por `Titular`; referenciada por `Transaction`.
- **Índices**: `(titular_id)`.
- **Regla de integridad**: el saldo actual **no se guarda como columna** — se deriva de
  `saldo_inicial + suma(Transaction.monto con signo, estado=activo)` vía vista (ver §6).
- **Eliminación**: archivar, no borrar, si tiene movimientos.

## 3. Entidad `Category`

- **Campos**: `id` (uuid, PK), `user_id` (FK a `auth.users` — compartida entre titulares del
  mismo login, ver §0), `nombre` (text, obligatorio), `tipo_movimiento`
  (`ingreso`/`gasto`/`ambos`), `icono` (text, opcional), `color` (text, opcional), `parent_id`
  (FK a `Category`, opcional — subcategoría), `estado` (`activo`/`archivado`).
- **Restricciones**: `UNIQUE (user_id, nombre) WHERE estado = 'activo'` — evita duplicados
  (problema real detectado en el Excel, `01-analisis-excel.md` §5).
- **Eliminación**: archivar, nunca borrar si tiene movimientos asociados.

## 4. Entidad `Transaction` (movimiento)

- **Propósito**: gasto, ingreso, transferencia o ajuste — el corazón del sistema.
- **Campos**: `id` (uuid, PK), `titular_id` (FK, obligatorio), `account_id` (FK, obligatorio),
  `category_id` (FK, opcional — un movimiento puede quedar sin categorizar), `tipo`
  (`gasto`/`ingreso`/`transferencia`/`ajuste`, obligatorio), `monto` (numeric(14,2), obligatorio,
  > 0 — el signo lo da `tipo`, no el monto), `fecha` (date, obligatorio, default hoy),
  `descripcion` (text, opcional), `recurring_expense_id` (FK, opcional — si nació de un gasto
  recurrente), `estado` (`activo`/`anulado`, default `activo`), `created_at`, `updated_at`.
- **Relaciones**: N `Transaction` por `Titular`, `Account`, `Category` (opcional).
- **Índices**: `(titular_id, fecha)` (listas y filtros), `(account_id)`, `(category_id)`.
- **Restricciones**: `monto > 0`; `tipo` y `account_id.titular_id = titular_id` (un movimiento
  no puede usar una cuenta de otro titular — reforzado también por RLS).
- **Eliminación**: nunca física — `estado = anulado`, con entrada en `AuditLog`.

## 5. Entidad `AuditLog`

- **Campos**: `id` (uuid, PK), `entidad_tipo` (text, obligatorio — ej. `"transaction"`,
  `"debt"`), `entidad_id` (uuid, obligatorio), `titular_id` (FK, obligatorio — para poder
  filtrar por RLS igual que el resto), `campo` (text, obligatorio), `valor_anterior` (text,
  nullable), `valor_nuevo` (text, nullable), `changed_at` (timestamptz, default now()),
  `changed_by` (uuid, FK a `auth.users`).
- **Restricciones**: **inmutable** — solo `INSERT`, nunca `UPDATE`/`DELETE` (se aplica con
  permisos de base de datos, no solo por convención).
- **Poblado**: vía trigger automático en cada `UPDATE`/anulación de las tablas transaccionales
  (no depende de que el frontend recuerde llamarlo — ver `07-arquitectura-tecnologica.md`, flujo
  de auditoría).

## 6. Entidad `Debt`

- **Campos**: `id` (uuid, PK), `titular_id` (FK, obligatorio), `acreedor` (text, obligatorio),
  `monto_inicial` (numeric(14,2), obligatorio, > 0), `saldo_pendiente` (numeric(14,2),
  **derivado**, no se edita directamente), `fecha_inicio` (date, obligatorio), `fecha_vencimiento`
  (date, opcional), `cuota_pactada` (numeric(14,2), opcional — deuda "sin cuota fija"),
  `frecuencia` (text, opcional), `tasa_interes` (numeric(5,2), opcional — **Fase 2**), `estado`
  (`activa`/`pagada`, default `activa`), `created_at`, `updated_at`.
- **Relaciones**: N `DebtPayment` por `Debt`.
- **Índices**: `(titular_id, estado)`.
- **Regla de integridad**: `saldo_pendiente = monto_inicial − suma(DebtPayment.monto, estado
  activo)`, calculado vía vista o trigger, nunca editado a mano desde la aplicación.

## 7. Entidad `DebtPayment`

- **Campos**: `id` (uuid, PK), `debt_id` (FK, obligatorio), `monto` (numeric(14,2), > 0),
  `fecha` (date, obligatorio), `estado` (`activo`/`anulado`), `created_at`.
- **Restricción**: un trigger recalcula `Debt.saldo_pendiente` y, si llega a 0, marca
  `Debt.estado = pagada`, tras cada `INSERT`/anulación.

## 8. Entidad `Loan` y `LoanPayment`

- **`Loan`**: `id` (uuid, PK), `titular_id` (FK), `direccion` (`recibido`/`otorgado`,
  obligatorio), `persona_entidad` (text, obligatorio), `monto` (numeric(14,2), > 0), `fecha`
  (date), `tiene_intereses` (boolean, default false), `tiene_cuotas` (boolean, default false),
  `fecha_vencimiento` (date, opcional), `saldo_pendiente` (derivado), `estado`
  (`activo`/`pagado`), `notas` (text, opcional).
- **`LoanPayment`**: `id`, `loan_id` (FK), `monto`, `fecha`, `estado`. Misma lógica de recálculo
  que `DebtPayment`.
- **Índices**: `(titular_id, direccion)` — para separar rápido "me deben" de "debo".

## 9. Entidad `Motorcycle` y `MotorcyclePayment` (módulo diferenciador)

- **`Motorcycle`**: `id` (uuid, PK), `titular_id` (FK, obligatorio), `nombre` (text, ej. "Moto
  Anderson"), `valor_inicial` (numeric(14,2), opcional — dato histórico), `saldo_financiacion`
  (numeric(14,2), **derivado** de la tabla de amortización, no editable a mano), `cuota_pactada`
  (numeric(14,2), obligatorio), `numero_total_cuotas` (int, obligatorio), `tasa_interes_mensual`
  (numeric(6,4), obligatorio — necesaria para recalcular con abonos a capital), `fecha_inicio`
  (date, obligatorio), `estado` (`activa`/`pagada`), `created_at`, `updated_at`.
- **`MotorcyclePayment`**: `id` (uuid, PK), `motorcycle_id` (FK, obligatorio), `tipo`
  (`cuota`/`abono_capital`, obligatorio), `monto` (numeric(14,2), > 0), `fecha` (date),
  `saldo_antes` (numeric(14,2)), `saldo_despues` (numeric(14,2)), `interes_periodo`
  (numeric(14,2), nullable — solo aplica a `tipo=cuota`), `capital_periodo` (numeric(14,2),
  nullable), `cuotas_restantes_despues` (int, nullable — solo relevante tras un
  `abono_capital`), `estado` (`activo`/`anulado`), `created_at`.
- **Regla de integridad clave**: cada fila de `MotorcyclePayment` es un snapshot inmutable de
  saldo antes/después — así el historial de cuotas ya pagadas nunca se modifica cuando ocurre
  un abono a capital (requisito confirmado en `05-requisitos-funcionales.md`), y el saldo actual
  siempre puede recalcularse desde cero recorriendo esta tabla en orden de fecha.
- **Lógica de abono a capital** (Edge Function, ver `07-arquitectura-tecnologica.md`): al
  registrar un `abono_capital`, se calcula el nuevo saldo, se mantiene `cuota_pactada` sin
  cambio (reducción de **plazo**, no de cuota — decisión del usuario), y se recalcula
  `numero_total_cuotas` restantes dividiendo el nuevo saldo entre la cuota pactada (con la tasa
  de interés mensual aplicada período a período, no como división lineal simple).
- **Índices**: `(titular_id)` en `Motorcycle`; `(motorcycle_id, fecha)` en `MotorcyclePayment`.

## 10. Entidad `SavingsGoal` y `SavingsContribution`

- **`SavingsGoal`**: `id`, `titular_id` (FK), `nombre` (text, obligatorio), `monto_objetivo`
  (numeric(14,2), > 0), `fecha_objetivo` (date, opcional, debe ser futura si se define), `estado`
  (`activa`/`cumplida`/`archivada`).
- **`SavingsContribution`**: `id`, `savings_goal_id` (FK), `tipo` (`aporte`/`retiro`), `monto`
  (numeric(14,2), > 0), `fecha`, `estado`.
- **Regla de integridad**: `total_ahorrado = suma(aportes) − suma(retiros)`, nunca negativo — un
  retiro que dejaría el total en negativo se rechaza a nivel de aplicación y de restricción
  (`CHECK` vía función, dado que requiere agregación).
- **MVP**: una sola `SavingsGoal` activa por titular (restricción de aplicación, no de base de
  datos — se deja la tabla abierta a varias metas para no rediseñar en Fase 2).

## 11. Entidad `RecurringExpense` (**Fase 2**)

- **Campos**: `id`, `titular_id` (FK), `concepto` (text), `monto` (numeric(14,2), nullable si es
  variable), `es_fijo` (boolean), `category_id` (FK, opcional), `account_id` (FK, opcional),
  `frecuencia` (text — mensual/quincenal/etc.), `fecha_inicio` (date), `fecha_fin` (date,
  opcional), `estado` (`activo`/`pausado`/`archivado`).
- **Relación**: genera `Transaction.recurring_expense_id` en cada período confirmado.

## 12. Entidades `Activity`, `ActivityParticipant`, `ActivityContribution`, `ActivityExpense` (**Fase 2**)

> Origen: generaliza "MARRANADA" y "FINCA FAUNER" del Excel — ver `01-analisis-excel.md` §9-11 y
> `05-requisitos-funcionales.md`.

- **`Activity`**: `id`, `titular_id` (FK — quién la organiza), `nombre`, `tipo` (text libre),
  `fecha`, `descripcion` (opcional), `estado` (`abierta`/`cerrada`).
- **`ActivityParticipant`**: `id`, `activity_id` (FK), `nombre` (obligatorio), `telefono`
  (opcional), `documento_identidad` (opcional, **off por defecto**, marcado como dato sensible —
  regla de minimización de datos, `06-requisitos-no-funcionales.md`).
- **`ActivityContribution`**: `id`, `activity_id` (FK), `participant_id` (FK), `monto`, `fecha`.
- **`ActivityExpense`**: `id`, `activity_id` (FK), `descripcion`, `cantidad` (numeric, > 0),
  `precio_unitario` (numeric(14,2)), `monto_total` (**derivado** = cantidad × precio_unitario).
- **Regla de integridad**: el saldo por participante (aportó vs. le corresponde) se **calcula**
  en una vista, nunca se guarda como columna editable.

## 13. Entidades `Reminder` / `Notification` (**Fase 2**)

- **`Reminder`**: `id`, `titular_id` (FK), `entidad_tipo`, `entidad_id`, `fecha_alerta`,
  `anticipacion_dias` (int), `estado` (`pendiente`/`enviado`/`cancelado`).
- **`Notification`**: `id`, `user_id` (FK a `auth.users` — se notifica al login, no al
  titular), `canal` (`email`/`push`), `mensaje`, `enviado_en` (timestamptz, nullable),
  `estado`.

## 14. Entidades `ImportBatch` / `ImportRow` (**Fase 2**, depende de `10-migracion-excel.md`)

- **`ImportBatch`**: `id`, `titular_id` (FK), `archivo_nombre`, `estado`
  (`en_progreso`/`confirmado`/`revertido`/`fallido`), `iniciado_en`, `finalizado_en`.
- **`ImportRow`**: `id`, `import_batch_id` (FK), `fila_original` (jsonb — la fila cruda del
  Excel, para trazabilidad), `estado` (`válida`/`con_error`/`importada`), `error` (text,
  nullable), `transaction_id` (FK, nullable — la fila creada, si se confirmó).

## 15. Entidad `Tag` (**Fase 2**, opcional)

- `id`, `user_id` (FK, compartido como `Category`), `nombre`. Relación N:N con `Transaction` vía
  tabla intermedia `TransactionTag` — no se detalla más por ser de baja prioridad.

## 16. Mapeo Excel → base de datos (actualizado con `titular_id`)

| Hoja Excel | Titular | Entidad(es) destino |
|---|---|---|
| Hoja1 ("DEUDAS ALEJANDRA") | Alejandra | `Loan` (dirección "otorgado") + `LoanPayment` |
| Hoja2 (obligaciones mensuales) | Anderson | `RecurringExpense` |
| Cuentas Anderson 2026 | Anderson | `Transaction` + `Account` (resumen embebido) |
| Deuda Moto | Anderson | `Motorcycle` + `MotorcyclePayment` + `Loan`/`LoanPayment` (SOAT, pase, GPS) |
| Cuentas Alejandra 2024 | Alejandra | `Transaction` |
| gasolina moto aleja | Alejandra (o Anderson, si es la misma moto — **a confirmar**, ver `01-analisis-excel.md` §7) | `Transaction` categoría "combustible" |
| MARRANADA / FINCA FAUNER | Quien organizó (a definir) | `Activity` + `ActivityParticipant/Contribution/Expense` (no migración literal) |
| Deudas Bancos | Anderson (a confirmar cuál titular) | `Debt` + pagos |
| Deuda casa | Anderson (a confirmar) | `Debt` |
| Pagos Cuota Casa | Anderson (a confirmar) | `DebtPayment` |
| Deuda (tabla 1 + "Cuaderno Nita") | Anderson (a confirmar) | `Loan` + `LoanPayment` |

> **Nota**: qué hojas corresponden a qué titular más allá de lo obvio (Hoja1/Cuentas Alejandra
> 2024 = Alejandra; el resto = Anderson) se termina de confirmar en `10-migracion-excel.md`,
> cuando se diseñe el mapeo de importación real — no se asume nada aquí que no esté ya dicho en
> `01-analisis-excel.md`.

## 17. Esquema inicial (DDL simplificado, PostgreSQL)

```sql
create table titular (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  nombre text not null check (length(nombre) > 0),
  estado text not null default 'activo' check (estado in ('activo','archivado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_titular_user on titular(user_id);

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

create table transaction (
  id uuid primary key default gen_random_uuid(),
  titular_id uuid not null references titular(id),
  account_id uuid not null references account(id),
  category_id uuid references category(id),
  tipo text not null check (tipo in ('gasto','ingreso','transferencia','ajuste')),
  monto numeric(14,2) not null check (monto > 0),
  fecha date not null default current_date,
  descripcion text,
  recurring_expense_id uuid,
  estado text not null default 'activo' check (estado in ('activo','anulado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_transaction_titular_fecha on transaction(titular_id, fecha desc);
create index idx_transaction_account on transaction(account_id);

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

-- (debt, debt_payment, loan, loan_payment, savings_goal, savings_contribution,
--  recurring_expense, activity*, reminder, notification, import_batch, import_row
--  siguen el mismo patrón: titular_id + estado + timestamps — omitidos aquí por espacio,
--  ver la especificación de campos en las secciones 6-15 de este documento)
```

## 18. Vistas de saldo (fuente de verdad — nunca calculado en frontend)

```sql
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

create view titular_dashboard as
select
  ti.id as titular_id,
  coalesce(sum(ab.saldo_actual), 0) as saldo_total,
  -- "disponible", "comprometido", "ahorrado" y "patrimonio neto" se completan aquí
  -- una vez se cierre la definición exacta de cada uno (pendiente, ver §19)
  coalesce((select sum(d.saldo_pendiente) from debt d
            where d.titular_id = ti.id and d.estado = 'activa'), 0) as deuda_pendiente
from titular ti
left join account_balance ab on ab.titular_id = ti.id
group by ti.id;
```

## 19. Pendiente de definir (declarado explícitamente, no resuelto por inventar)

- **Fórmula exacta de "disponible" vs. "comprometido" vs. "patrimonio neto"** (caso 17 de
  `04-casos-de-uso.md`): requiere que el usuario confirme, por ejemplo, si "comprometido"
  incluye solo cuotas del mes actual o también deuda total pendiente. **No se inventa aquí** —
  se deja como pregunta abierta antes de implementar el dashboard final.
- **Confirmación de titular por hoja del Excel** donde no es obvio (Deudas Bancos, Deuda casa,
  Pagos Cuota Casa, Deuda) — ver nota en §16.
- **Row-level security**: las políticas SQL exactas (`CREATE POLICY`) se escriben en la fase de
  implementación, no en este documento de diseño — aquí se deja establecido el principio (cada
  tabla filtra por `titular_id` perteneciente a `auth.uid()`) y un ejemplo ilustrativo:

```sql
alter table transaction enable row level security;
create policy "titular_owns_transaction" on transaction
  for all
  using (titular_id in (select id from titular where user_id = auth.uid()))
  with check (titular_id in (select id from titular where user_id = auth.uid()));
```

## Cierre de esta fase (y de las Fases 0-8)

- **Decisiones tomadas**: 16 entidades especificadas con campos, tipos, relaciones, índices y
  estrategia de eliminación; esquema DDL inicial y vistas de saldo (fuente de verdad en
  backend); ejemplo de política RLS por titular; mapeo Excel→BD actualizado con `titular_id`.
- **Supuestos pendientes de confirmar**: que las categorías se compartan entre titulares (§0);
  a qué titular corresponden las hojas "Deudas Bancos", "Deuda casa", "Pagos Cuota Casa" y
  "Deuda" (§16) — no se asumió ninguno de los dos por defecto sin marcarlo.
- **Riesgos detectados**: (1) la fórmula de "disponible/comprometido/patrimonio neto" queda
  pendiente — no se puede terminar el dashboard sin ella; (2) las políticas RLS reales deben
  probarse exhaustivamente en `14-plan-pruebas.md` con intentos deliberados de cruzar titulares;
  (3) `numeric(14,2)` cubre montos hasta ~999 mil millones de COP — suficiente para el caso de
  uso real, pero debe revisarse si algún monto real del Excel lo excede al migrar.
- **Entregables generados**: este documento (con DDL, vistas y mapeo actualizado).
- **Próxima etapa recomendada**: `09-experiencia-usuario.md` (Fase 9) — ya puede construirse
  sobre este modelo de datos y la arquitectura de `07-arquitectura-tecnologica.md`. Con esto se
  cierra el bloque de Fases 0-8 que `CLAUDE.md` exige antes de escribir código de producto.
