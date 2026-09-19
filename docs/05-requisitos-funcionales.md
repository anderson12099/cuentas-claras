# Fase 4 — Requisitos funcionales

Especificación por módulo. Para cada módulo, marcar cada campo/función como **MVP**,
**Fase 2**, **Fase 3** o **Fase 4**, según `13-plan-desarrollo-roadmap.md`.

## Módulo de autenticación

Registro, inicio de sesión, cierre de sesión, recuperación de acceso, verificación de correo
(si aplica), sesiones activas, dispositivos autorizados, cierre remoto de sesiones,
autenticación multifactor (futuro).

## Módulo de dashboard

Mínimo a mostrar: saldo total, dinero disponible, ingresos del período, gastos del período,
ahorros, deudas pendientes, préstamos por cobrar, cuotas próximas, gastos recurrentes, balance
mensual, alertas importantes, progreso de metas de ahorro.

Distinguir explícitamente: saldo contable vs. saldo disponible vs. dinero comprometido vs.
dinero ahorrado vs. deuda pendiente vs. patrimonio neto — con definición precisa de cada uno
(ver también `08-modelo-datos.md`).

## Módulo de movimientos

Gastos, ingresos, transferencias, abonos, ajustes; descripción, fecha, monto, categoría,
cuenta, etiquetas, notas, comprobante (a decidir); marcar como recurrente; editar; anular
(nunca borrado físico — ver regla de auditoría); historial.

El flujo de registro rápido debe minimizar campos obligatorios (ver `09-experiencia-usuario.md`).

## Módulo de categorías

Crear, editar, archivar categorías; subcategorías; icono; color; asociación con tipo de
movimiento; evitar duplicados; importar desde Excel.

## Módulo de deudas

Acreedor, monto inicial, saldo pendiente, fecha de inicio/vencimiento, tasa de interés (si
aplica), cuota pactada, frecuencia, estado, abonos, intereses, cargos, historial, progreso de
pago, recordatorios, marcar como pagada sin perder historial.

## Módulo de préstamos

Distinguir: que debo / que me deben; con o sin intereses; con o sin cuotas; informales; con
fecha de vencimiento. Registrar persona/entidad, monto, fecha, acuerdo, cuotas, abonos, saldo,
estado, notas, evidencias opcionales.

## Módulo de moto (funcionalidad especializada)

Campos candidatos — **clasificar por prioridad, no asumir que todos van al MVP**: moto,
valor inicial, financiación, cuota, número total de cuotas, cuotas pagadas/pendientes, fecha
de pago, intereses, seguros, mantenimiento, combustible, impuestos, gastos asociados, costo
mensual, costo acumulado, saldo de financiación, alertas de vencimiento.

Propuesta preliminar de prioridad (a confirmar en `03-propuesta-valor.md` y con datos reales
del Excel): **MVP** = financiación básica (cuota, total de cuotas, cuotas pagadas, saldo,
abonos a capital y su recálculo — ver abajo). **Fase 2** = seguros, mantenimiento, combustible,
impuestos, costo mensual/acumulado.

### Abonos a capital (requisito expresado por el usuario, 2026-09-13)

> Contexto: el crédito de la moto está activo hoy y sus datos de partida son los de la hoja
> "Deuda Moto" del Excel (ver `01-analisis-excel.md` §2, §11 y `00-plan-trabajo.md` §3.3) — una
> tabla de amortización mes a mes (saldo inicial, interés mensual, pago a capital, amortización,
> saldo final). Este requisito extiende esa tabla con la capacidad de registrar pagos
> extraordinarios.

- El usuario debe poder registrar un **abono a capital**: un pago adicional a la cuota pactada
  que se aplica directamente a reducir el saldo del crédito.
- Al registrar un abono, la aplicación **recalcula automáticamente** la tabla de amortización
  restante: nuevo saldo, intereses futuros sobre el saldo reducido, y el efecto sobre plazo y/o
  cuota — nunca se actualiza el saldo "a mano" (mismo principio de fuente de verdad en backend
  que el resto de la app, ver `07-arquitectura-tecnologica.md`).
- **Resuelto con el usuario (2026-09-13)**: la única modalidad de recálculo que necesita el
  módulo de moto es **reducción de plazo** (la cuota pactada se mantiene igual; el abono a
  capital reduce el número de cuotas restantes). No hace falta modelar "reducción de cuota"
  como opción alternativa — se deja fuera de alcance salvo que el usuario lo pida más adelante
  para otro tipo de deuda.
- El historial de abonos a capital se conserva íntegro (nunca se sobrescribe la tabla de
  amortización original — ver regla 17 de `CLAUDE.md` sobre auditoría).
- Esta misma lógica de recálculo por abono a capital es candidata a reutilizarse en el módulo
  de **deudas** (`Debt`) en general, no solo en la moto — evaluar en `08-modelo-datos.md` si
  conviene modelarla como comportamiento compartido en vez de duplicarla.

## Módulo de ahorros

Meta, monto objetivo, fecha objetivo, aportes, retiros, porcentaje de avance, monto faltante,
aporte sugerido (cálculo informativo, no asesoría financiera — regla 16 de `CLAUDE.md`),
varios bolsillos, historial.

## Módulo de gastos recurrentes

Crear, frecuencia, fecha de inicio/fin, monto fijo o variable, categoría, cuenta, generación
de próximos movimientos, confirmación antes de registrar (si corresponde), evitar duplicados.

## Módulo de actividades/finca familiar (nuevo — Fase 2)

> Origen: reemplaza y generaliza lo que hoy son las hojas "MARRANADA" y "FINCA FAUNER" del
> Excel (control de costos de un evento/actividad compartida entre varias personas — una
> finca, un paseo, una recolecta). Ver `01-analisis-excel.md` §9-11. Decisión del usuario
> (2026-09-13): sí entra al alcance, pero como módulo genérico reutilizable, no como
> importación literal de esas dos hojas.

Permite:

- Crear una **actividad** (nombre, tipo libre — finca, paseo, recolecta, otro —, fecha,
  descripción).
- Registrar **participantes** de la actividad (nombre, teléfono opcional). **No pedir número
  de documento de identidad por defecto** — si en algún momento se necesita (p. ej. control de
  acceso a una finca), debe ser un campo explícitamente opcional y claramente marcado como
  dato sensible, nunca obligatorio (regla de minimización de datos, `06-requisitos-no-funcionales.md`).
- Registrar **aportes/pagos** de cada participante hacia la actividad (equivalente al "PAGO"
  de las hojas originales).
- Registrar **gastos/insumos** de la actividad (equivalente a las tablas de insumos con
  cantidad y precio).
- Calcular automáticamente, por participante: cuánto aportó, cuánto le corresponde según el
  costo total repartido, y su saldo (a favor / debe) — reemplaza las columnas manuales
  "ABONO" / "DEBE" que hoy se calculan a mano.
- Cerrar una actividad y conservar su historial (no se borra, igual que un movimiento
  financiero normal — regla 17 de `CLAUDE.md`).
- Opcionalmente, vincular el saldo de un participante que "debe" con el módulo de préstamos
  (`Loan`), si el usuario decide cobrarlo como una deuda formal.

**Prioridad**: Fase 2 del roadmap (`13-plan-desarrollo-roadmap.md`) — depende de que
`Transaction` y el modelo de saldo básico ya estén sólidos en el MVP. No es un diferenciador
confirmado hasta contrastarlo con la investigación de mercado (`02-investigacion-mercado.md`);
como hipótesis, la mayoría de apps de finanzas personales no cubren "gastos compartidos de un
evento familiar" dentro de la misma app (eso hoy lo resuelven apps tipo Splitwise, no apps de
finanzas personales) — sería un diferenciador real si se confirma que no hay solapamiento
bueno entre ambas categorías.

## Módulo de reportes

Gastos por categoría/período, ingresos vs. gastos, evolución del saldo, deudas por estado,
pagos de moto, ahorros por meta, gastos recurrentes, flujo de caja personal, movimientos
pendientes, comparación entre períodos, exportación a Excel/CSV.
