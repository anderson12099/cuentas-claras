# Fase 3 — Personas, casos de uso y flujos

> Depende de `00-plan-trabajo.md` (Fase 0, cerrada) y `03-propuesta-valor.md` (Fase 2, cerrada).
> Todos los casos de uso parten del MVP confirmado en `00-plan-trabajo.md` §7. Se marca cada
> caso con su fase de entrada: **MVP**, **Fase 2**, **Fase 3** o **Fase 4** (ver
> `13-plan-desarrollo-roadmap.md`).

## Perfiles de usuario

En esta v1 real, un único usuario (el dueño del proyecto, `00-plan-trabajo.md` §2 y §3.6-7)
cumple todos estos roles. Se documentan por separado para que el diseño no acople
funcionalidades que en el futuro podrían separarse (p. ej. si se agrega multiusuario en Fase 4):

- Usuario individual que controla sus finanzas del día a día.
- Usuario que administra deudas y préstamos (propios y a terceros).
- Usuario con pagos recurrentes fijos (arriendo, mercado, diezmo, etc. — ver Hoja2 del Excel).
- Usuario que controla un activo financiado (la moto).
- Usuario que ahorra para metas específicas.
- Usuario que organiza actividades/eventos compartidos con otras personas (Fase 2).

## Nota de prioridad

Los casos **1, 2, 3, 17 y 18** son los que definen si el MVP es usable a diario — se detallan
primero y con más profundidad. El resto se detalla igual de completo (para que sirvan de
referencia cuando entren en alcance) pero se marca su fase de entrada según
`13-plan-desarrollo-roadmap.md` y el MVP confirmado.

---

## 1. Registrar un gasto — **MVP** (caso crítico)

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada; al menos una cuenta y una categoría existentes (o
  valores por defecto ya creados al registrarse).
- **Flujo principal**:
  1. El usuario toca "Agregar movimiento" desde cualquier pantalla.
  2. Ingresa el **monto** (teclado numérico inmediato, primer campo — ver `09-experiencia-usuario.md`).
  3. La app sugiere categoría y cuenta más usadas (editable con un toque).
  4. Fecha actual por defecto (editable).
  5. Descripción opcional.
  6. El usuario guarda con un toque.
  7. La app muestra confirmación de "guardado exitosamente", el movimiento aparece en la lista,
     y el saldo/dashboard se actualiza de inmediato en el mismo dispositivo (requisito
     confirmado en `00-plan-trabajo.md` §3.4).
- **Flujos alternativos**: el usuario cambia la categoría o cuenta sugerida; el usuario marca
  el gasto como recurrente (ver caso 15); el usuario deshace el registro inmediatamente después
  de guardar (ver `09-experiencia-usuario.md` punto 9).
- **Validaciones**: monto obligatorio, numérico, mayor que cero; categoría y cuenta deben
  existir y pertenecer al usuario; fecha no puede ser nula.
- **Resultado esperado**: se crea un `Transaction` de tipo gasto; el saldo de la cuenta
  asociada se recalcula en backend; el dashboard refleja el nuevo saldo sin recargar.
- **Errores posibles**: monto vacío o no numérico (bloquea el guardado con mensaje claro); sin
  conexión (ver `11-tiempo-real-sincronizacion.md` — pendiente de definir tolerancia offline);
  cuenta o categoría eliminada entre que se abrió el formulario y se guardó.
- **Criterios de aceptación**: el usuario puede completar el registro en menos de 10 segundos
  con solo el monto como campo obligatorio; el saldo mostrado nunca se calcula en el frontend.

## 2. Registrar un ingreso — **MVP** (caso crítico)

- **Actor**: usuario.
- **Precondiciones**: igual que el caso 1.
- **Flujo principal**: idéntico al caso 1, pero el movimiento se marca como tipo ingreso y suma
  al saldo de la cuenta en vez de restar.
- **Flujos alternativos**: el usuario asocia el ingreso a un préstamo que le devuelven (ver caso
  10) en vez de a un ingreso genérico.
- **Validaciones**: iguales al caso 1.
- **Resultado esperado**: `Transaction` de tipo ingreso creada; saldo recalculado en backend.
- **Errores posibles**: iguales al caso 1.
- **Criterios de aceptación**: iguales al caso 1 en tiempo y simplicidad.

## 3. Editar un movimiento — **MVP** (caso crítico)

- **Actor**: usuario.
- **Precondiciones**: el movimiento existe y pertenece al usuario.
- **Flujo principal**:
  1. El usuario abre un movimiento existente desde la lista.
  2. Modifica monto, categoría, cuenta, fecha o descripción.
  3. Guarda el cambio.
  4. La app recalcula el saldo afectado y **registra el cambio en el historial de auditoría**
     (regla 17 de `CLAUDE.md` — nunca "editar y listo" sin dejar rastro).
- **Flujos alternativos**: el usuario cancela la edición sin guardar.
- **Validaciones**: mismas reglas que al crear (monto > 0, categoría/cuenta válidas).
- **Resultado esperado**: el movimiento se actualiza; se crea una entrada en `AuditLog` con el
  valor anterior y el nuevo; el saldo de la(s) cuenta(s) afectada(s) se recalcula.
- **Errores posibles**: el movimiento fue anulado por otra sesión/dispositivo justo antes de
  editarlo (conflicto — ver `11-tiempo-real-sincronizacion.md`).
- **Criterios de aceptación**: todo cambio queda auditado; el saldo nunca queda inconsistente
  con la suma real de movimientos.

## 4. Eliminar o anular un movimiento — **MVP**

- **Actor**: usuario.
- **Precondiciones**: el movimiento existe.
- **Flujo principal**: el usuario marca el movimiento como **anulado** (nunca borrado físico —
  regla 17 de `CLAUDE.md`). El saldo se recalcula excluyendo el movimiento anulado, pero el
  registro permanece visible en el historial con su estado.
- **Flujos alternativos**: ninguno — no existe "borrado físico" como opción de UI.
- **Validaciones**: el usuario debe confirmar la anulación (acción destructiva desde su
  perspectiva, aunque técnicamente no borre el dato).
- **Resultado esperado**: `Transaction.estado = anulado`; entrada en `AuditLog`; saldo
  recalculado.
- **Errores posibles**: intentar anular un movimiento que forma parte de una importación en
  curso (ver caso 20).
- **Criterios de aceptación**: el movimiento anulado sigue siendo consultable en el historial;
  el saldo no lo cuenta.

## 5. Crear una categoría — **MVP**

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada.
- **Flujo principal**: el usuario crea una categoría con nombre, ícono y color; opcionalmente
  la asocia a un tipo de movimiento (gasto/ingreso) y a una categoría padre (subcategoría).
- **Flujos alternativos**: el usuario archiva una categoría existente en vez de crear una
  nueva; el usuario importa categorías desde el Excel (Fase 2, ver caso 20).
- **Validaciones**: nombre obligatorio y único por usuario (evitar duplicados — problema real
  detectado en el Excel, ver `01-analisis-excel.md` §5).
- **Resultado esperado**: `Category` creada, disponible de inmediato en el formulario de
  registro rápido.
- **Errores posibles**: nombre duplicado (la app debe advertirlo, no crear un duplicado
  silencioso).
- **Criterios de aceptación**: no pueden existir dos categorías activas con el mismo nombre
  para el mismo usuario.

## 6. Crear una cuenta o bolsillo — **MVP**

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada.
- **Flujo principal**: el usuario crea una cuenta (nombre, tipo — efectivo/banco/otro —, saldo
  inicial). Esto corresponde al resumen de cuentas que hoy vive embebido en las primeras filas
  de "Cuentas Anderson 2026" (Confiar, FNA, Cesantías, Préstamo — ver `01-analisis-excel.md` §10).
- **Flujos alternativos**: el usuario archiva una cuenta que ya no usa (sin perder su historial
  de movimientos).
- **Validaciones**: nombre obligatorio; saldo inicial numérico (puede ser cero).
- **Resultado esperado**: `Account` creada; el saldo inicial se registra como su primer punto de
  partida (no como un `Transaction`, para no confundir el reporte de ingresos/gastos).
- **Errores posibles**: intentar archivar una cuenta con saldo distinto de cero sin confirmación
  explícita.
- **Criterios de aceptación**: el saldo de cada cuenta siempre coincide con saldo inicial + suma
  de sus movimientos no anulados.

## 7. Crear una deuda — **MVP**

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada.
- **Flujo principal**: el usuario registra una deuda (acreedor, monto inicial, fecha de inicio,
  cuota pactada si aplica, frecuencia). Corresponde a hojas como "Deudas Bancos", "Deuda casa" y
  la tabla de préstamos otorgados (ver `01-analisis-excel.md` §11).
- **Flujos alternativos**: el usuario marca la deuda como sin cuota fija (pago libre).
- **Validaciones**: acreedor y monto inicial obligatorios; monto > 0.
- **Resultado esperado**: `Debt` creada con saldo pendiente = monto inicial.
- **Errores posibles**: monto negativo o cero.
- **Criterios de aceptación**: el saldo pendiente se recalcula automáticamente con cada abono
  (caso 8), nunca se edita a mano.

## 8. Registrar un abono a una deuda — **MVP**

- **Actor**: usuario.
- **Precondiciones**: la deuda existe y tiene saldo pendiente > 0.
- **Flujo principal**: el usuario registra un abono (monto, fecha). La app resta el abono del
  saldo pendiente y lo asocia a un movimiento de tipo "abono" para que también impacte el saldo
  de la cuenta desde la que se pagó.
- **Flujos alternativos**: el abono es mayor al saldo pendiente (la app ajusta el sobrante o lo
  rechaza, a definir en `08-modelo-datos.md`); la deuda queda saldada y se marca como "pagada"
  sin perder su historial.
- **Validaciones**: monto > 0; monto no puede dejar el saldo en negativo sin una decisión
  explícita del usuario.
- **Resultado esperado**: `DebtPayment` creado; `Debt.saldo_pendiente` recalculado; si llega a
  cero, `Debt.estado = pagada`.
- **Errores posibles**: registrar dos veces el mismo abono por error de doble toque
  (idempotencia — ver `11-tiempo-real-sincronizacion.md`).
- **Criterios de aceptación**: el saldo pendiente siempre es monto inicial − suma de abonos no
  anulados.

## 9. Registrar un préstamo recibido — **Fase 2**

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada.
- **Flujo principal**: el usuario registra que recibió dinero prestado de alguien (persona/
  entidad, monto, fecha, si tiene intereses o cuotas, fecha de vencimiento si aplica).
- **Flujos alternativos**: el préstamo es informal, sin fecha de vencimiento ni intereses.
- **Validaciones**: monto > 0; persona/entidad obligatoria.
- **Resultado esperado**: `Loan` creado con dirección "recibido" (el usuario debe).
- **Errores posibles**: confundir la dirección (recibido vs. otorgado) — la UI debe dejarlo
  inequívoco (dos flujos distintos, no un solo formulario con un switch fácil de pasar por alto).
- **Criterios de aceptación**: se distingue siempre, en cualquier vista, si el usuario debe o le
  deben.

## 10. Registrar un préstamo otorgado — **Fase 2**

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada.
- **Flujo principal**: igual al caso 9, pero con dirección "otorgado" (le deben al usuario).
  Corresponde a Hoja1 del Excel ("DEUDAS ALEJANDRA" / "PAGA DIARIOS", ver `01-analisis-excel.md` §11).
- **Flujos alternativos**: el usuario registra abonos parciales recibidos de quien le debe (ver
  caso 8, aplicado en dirección inversa).
- **Validaciones**: iguales al caso 9.
- **Resultado esperado**: `Loan` creado con dirección "otorgado"; sus abonos se registran como
  `LoanPayment` y como ingreso en la cuenta que los recibe.
- **Errores posibles**: iguales al caso 9.
- **Criterios de aceptación**: iguales al caso 9.

## 11. Registrar una cuota de la moto — **MVP** (módulo diferenciador confirmado)

- **Actor**: usuario.
- **Precondiciones**: el crédito de la moto ya está cargado con los datos de "Deuda Moto" del
  Excel (saldo inicial, interés mensual, cuota — ver `01-analisis-excel.md` §2 y
  `00-plan-trabajo.md` §3.3).
- **Flujo principal**: el usuario registra el pago de la cuota del mes. La app calcula el
  interés del período sobre el saldo actual, aplica el resto a capital, y actualiza el saldo de
  financiación — replicando la lógica de la tabla de amortización que hoy se lleva a mano.
- **Flujos alternativos**: el usuario registra, en el mismo flujo o uno aparte, un **abono a
  capital** (ver caso 11b) en vez de (o además de) la cuota regular.
- **Validaciones**: no se puede registrar una cuota si el crédito ya está saldado.
- **Resultado esperado**: `MotorcyclePayment` creado; `Motorcycle.saldo_financiacion`
  recalculado en backend.
- **Errores posibles**: registrar la misma cuota dos veces en el mismo período.
- **Criterios de aceptación**: el saldo de financiación siempre coincide con lo que arrojaría
  recalcular toda la tabla de amortización desde el inicio del crédito.

### 11b. Registrar un abono a capital de la moto — **MVP** (requisito nuevo del usuario)

- **Actor**: usuario.
- **Precondiciones**: el crédito de la moto está activo.
- **Flujo principal**:
  1. El usuario registra un abono a capital (monto, fecha).
  2. La app recalcula automáticamente la tabla de amortización restante bajo la modalidad
     **reducción de plazo** (la cuota pactada no cambia; se reducen las cuotas restantes) —
     confirmado por el usuario, ver `05-requisitos-funcionales.md` → "Abonos a capital".
  3. Se muestra al usuario el nuevo número de cuotas restantes y la nueva fecha estimada de
     fin del crédito.
- **Flujos alternativos**: ninguno — solo se soporta reducción de plazo (ver decisión del
  usuario, 2026-09-13).
- **Validaciones**: el abono no puede ser mayor al saldo de financiación restante.
- **Resultado esperado**: nuevo registro de abono conservado en el historial; tabla de
  amortización restante recalculada; el histórico de cuotas ya pagadas no se modifica.
- **Errores posibles**: un abono que salda el crédito completo debe marcarlo como pagado, no
  dejar cuotas "fantasma" pendientes.
- **Criterios de aceptación**: después de un abono, el número de cuotas restantes y el saldo
  mostrado son consistentes con recalcular la amortización desde cero con ese abono aplicado.

## 12. Consultar cuotas pendientes — **MVP**

- **Actor**: usuario.
- **Precondiciones**: existen deudas, préstamos o la moto con cuotas programadas.
- **Flujo principal**: el usuario ve una lista/calendario de próximas cuotas (deuda, moto,
  préstamos) ordenadas por fecha, con el monto y a quién/qué corresponden.
- **Flujos alternativos**: filtrar por tipo (solo moto, solo deudas, etc.).
- **Validaciones**: ninguna de entrada — es una vista de consulta.
- **Resultado esperado**: vista consolidada y correcta de vencimientos futuros.
- **Errores posibles**: mostrar una cuota ya pagada como pendiente por un error de
  sincronización del estado.
- **Criterios de aceptación**: ninguna cuota pagada aparece como pendiente y viceversa.

## 13. Registrar un ahorro — **MVP**

- **Actor**: usuario.
- **Precondiciones**: existe al menos una meta de ahorro (caso 14) o se crea en el mismo flujo.
- **Flujo principal**: el usuario registra un aporte a una meta (monto, fecha); la app suma el
  aporte al total ahorrado y recalcula el porcentaje de avance.
- **Flujos alternativos**: el usuario registra un retiro de la meta (resta del total ahorrado).
- **Validaciones**: monto > 0; un retiro no puede dejar el total ahorrado en negativo.
- **Resultado esperado**: `SavingsContribution` creada; `SavingsGoal` con nuevo total y
  porcentaje de avance recalculados.
- **Errores posibles**: retiro mayor al total ahorrado.
- **Criterios de aceptación**: el porcentaje de avance siempre corresponde a total ahorrado /
  monto objetivo.

## 14. Crear una meta de ahorro — **MVP** (una sola meta simple en el MVP)

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada.
- **Flujo principal**: el usuario crea una meta (nombre, monto objetivo, fecha objetivo
  opcional). El MVP soporta **una meta simple**; varios "bolsillos"/metas simultáneas quedan
  para Fase 2 (ver `05-requisitos-funcionales.md` → Módulo de ahorros).
- **Flujos alternativos**: el usuario ve un "aporte sugerido" calculado (monto objetivo restante
  / períodos restantes hasta la fecha objetivo) — **cálculo informativo, no asesoría financiera**
  (regla 16 de `CLAUDE.md`).
- **Validaciones**: monto objetivo > 0.
- **Resultado esperado**: `SavingsGoal` creada.
- **Errores posibles**: fecha objetivo en el pasado.
- **Criterios de aceptación**: el aporte sugerido se etiqueta explícitamente como cálculo
  informativo en la UI, nunca como una recomendación financiera.

## 15. Programar un gasto recurrente — **Fase 2**

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada.
- **Flujo principal**: el usuario crea un gasto recurrente (concepto, monto fijo o variable,
  categoría, cuenta, frecuencia, fecha de inicio/fin). Corresponde a Hoja2 del Excel
  (obligaciones mensuales fijas: ARRIENDO, MERCADO, DIEZMO, etc.) y al patrón detectado de
  "Cooperativa" repetido 4 veces a mano (ver `01-analisis-excel.md` §5).
- **Flujos alternativos**: la app pide confirmación antes de generar el movimiento del período
  (en vez de crearlo automáticamente sin avisar), evitando duplicados si el usuario ya lo
  registró manualmente ese mes.
- **Validaciones**: monto obligatorio si es fijo; frecuencia obligatoria.
- **Resultado esperado**: `RecurringExpense` creado; genera `Transaction` en cada período según
  la confirmación del usuario.
- **Errores posibles**: generar un movimiento duplicado si el usuario ya lo registró a mano ese
  mes.
- **Criterios de aceptación**: nunca se genera un movimiento recurrente duplicado para el mismo
  período.

## 16. Consultar vencimientos — **Fase 2**

- **Actor**: usuario.
- **Precondiciones**: existen gastos recurrentes, deudas o cuotas con fecha próxima.
- **Flujo principal**: vista consolidada de todo lo que vence pronto (deudas, moto, préstamos,
  recurrentes), con alertas visuales según proximidad.
- **Flujos alternativos**: filtrar por tipo o rango de fechas.
- **Validaciones**: ninguna de entrada.
- **Resultado esperado**: vista correcta y consolidada de vencimientos.
- **Errores posibles**: igual al caso 12.
- **Criterios de aceptación**: igual al caso 12, extendido a recurrentes.

## 17. Ver el balance general — **MVP** (caso crítico)

- **Actor**: usuario.
- **Precondiciones**: sesión iniciada.
- **Flujo principal**: el usuario abre el dashboard y ve, calculados en backend: saldo total,
  dinero disponible, dinero comprometido, dinero ahorrado, deuda pendiente — con definición
  explícita y distinta de cada uno (ver `08-modelo-datos.md`, pendiente de definir la fórmula
  exacta de cada campo en esa fase).
- **Flujos alternativos**: el usuario filtra el balance por cuenta.
- **Validaciones**: ninguna de entrada — es una vista derivada.
- **Resultado esperado**: los cinco valores del dashboard son siempre consistentes entre sí y
  con la suma real de movimientos/deudas/ahorros.
- **Errores posibles**: mostrar un valor "cacheado" desactualizado tras registrar un movimiento
  (viola el requisito de actualización inmediata, `00-plan-trabajo.md` §3.4).
- **Criterios de aceptación**: después de cualquier registro/edición/anulación, el dashboard se
  actualiza sin necesidad de recargar la página.

## 18. Filtrar movimientos — **MVP** (caso crítico)

- **Actor**: usuario.
- **Precondiciones**: existen movimientos registrados.
- **Flujo principal**: el usuario filtra la lista de movimientos por fecha, categoría, cuenta,
  tipo (ingreso/gasto) o texto de búsqueda.
- **Flujos alternativos**: combinar varios filtros a la vez.
- **Validaciones**: ninguna de entrada.
- **Resultado esperado**: la lista filtrada refleja exactamente los movimientos que cumplen los
  criterios, incluyendo o excluyendo anulados según se indique.
- **Errores posibles**: un filtro mal aplicado que oculte movimientos relevantes sin que el
  usuario note que hay un filtro activo.
- **Criterios de aceptación**: siempre es visualmente claro qué filtros están activos.

## 19. Consultar reportes — **Fase 2**

- **Actor**: usuario.
- **Precondiciones**: existen movimientos suficientes para el período consultado.
- **Flujo principal**: el usuario ve reportes (gasto por categoría/período, ingresos vs.
  gastos, evolución del saldo, deudas por estado, pagos de moto, ahorros por meta, comparación
  entre períodos — ver `05-requisitos-funcionales.md` → Módulo de reportes).
- **Flujos alternativos**: exportar el reporte (ver caso 21).
- **Validaciones**: rango de fechas válido (fecha inicio ≤ fecha fin).
- **Resultado esperado**: reportes consistentes con los datos subyacentes, calculados en
  backend.
- **Errores posibles**: un reporte que no excluye movimientos anulados, inflando cifras.
- **Criterios de aceptación**: todo reporte excluye por defecto los movimientos anulados.

## 20. Importar datos desde Excel — **Fase 2** (depende de `10-migracion-excel.md`)

- **Actor**: usuario.
- **Precondiciones**: el usuario tiene un archivo Excel compatible con el mapeo definido en
  `01-analisis-excel.md` y `10-migracion-excel.md`.
- **Flujo principal**: carga del archivo → vista previa → mapeo de columnas → detección de
  duplicados y errores → confirmación → importación transaccional (todo o nada).
- **Flujos alternativos**: el usuario cancela antes de confirmar; la importación falla a mitad
  de camino y se revierte completa (nunca queda a medias).
- **Validaciones**: formato de archivo soportado; columnas mínimas requeridas presentes; montos
  normalizables a número (ver el caso real de texto con formato mixto en `01-analisis-excel.md`
  §3, hoja "Deuda").
- **Resultado esperado**: `ImportBatch` con sus `ImportRow`; movimientos creados solo si la
  importación se confirma completa.
- **Errores posibles**: fechas o montos inválidos que no se pueden normalizar automáticamente —
  se reportan al usuario para decisión manual, nunca se inventan.
- **Criterios de aceptación**: una importación fallida no deja datos parciales en el sistema.

## 21. Exportar información — **MVP** (CSV básico) / **Fase 2** (formatos avanzados)

- **Actor**: usuario.
- **Precondiciones**: existen datos para exportar.
- **Flujo principal**: el usuario exporta movimientos (MVP: CSV básico) o reportes completos
  (Fase 2: Excel/CSV con más detalle).
- **Flujos alternativos**: exportar un rango de fechas específico.
- **Validaciones**: ninguna de entrada.
- **Resultado esperado**: archivo descargable con los datos exactos mostrados en la app.
- **Errores posibles**: exportar datos anulados sin marcarlos como tal.
- **Criterios de aceptación**: el archivo exportado distingue movimientos activos de anulados.

## 22. Corregir errores — **MVP**

- Cubierto por los casos 3 (editar) y 4 (anular) — se referencia aquí para completar la lista
  de 25 casos pedida, sin duplicar contenido. Ver esos dos casos para el detalle completo.

## 23. Consultar el historial de cambios — **MVP** (auditoría básica) / **Fase 3** (auditoría avanzada)

- **Actor**: usuario.
- **Precondiciones**: existen movimientos editados o anulados.
- **Flujo principal**: el usuario abre el historial de un movimiento y ve cada cambio (qué
  campo, valor anterior, valor nuevo, fecha del cambio).
- **Flujos alternativos**: ver el historial completo de auditoría de toda la cuenta (Fase 3,
  vista más avanzada — ver `12-seguridad-privacidad.md`).
- **Validaciones**: ninguna de entrada.
- **Resultado esperado**: `AuditLog` correctamente asociado a cada movimiento, inmutable.
- **Errores posibles**: un cambio que no quede registrado (violaría la regla 17 de `CLAUDE.md`).
- **Criterios de aceptación**: el 100% de las ediciones/anulaciones queda en el historial.

## 24. Recibir recordatorios — **Fase 2**

- **Actor**: usuario.
- **Precondiciones**: existen cuotas o vencimientos próximos.
- **Flujo principal**: la app notifica al usuario (canal a definir en `07-arquitectura-tecnologica.md`
  — correo o push) antes de un vencimiento.
- **Flujos alternativos**: el usuario configura con cuánta anticipación quiere el recordatorio.
- **Validaciones**: no duplicar el mismo recordatorio varias veces.
- **Resultado esperado**: `Reminder`/`Notification` generado y entregado una sola vez por
  vencimiento.
- **Errores posibles**: recordatorio duplicado o no entregado — no prometer entrega garantizada
  sin definir la infraestructura real (regla 11 de `CLAUDE.md`).
- **Criterios de aceptación**: no se prometen recordatorios "en tiempo real" instantáneos sin
  que la arquitectura elegida lo soporte de verdad.

## 25. Consultar información desde otro dispositivo — **MVP** (consulta) / **Fase 3** (sync sin recargar)

- **Actor**: usuario.
- **Precondiciones**: el usuario inició sesión en más de un dispositivo (celular y computador).
- **Flujo principal (MVP)**: el usuario abre la app en otro dispositivo y, **al cargar la
  página**, ve la información actualizada — no se promete que un cambio hecho en un dispositivo
  aparezca solo, sin recargar, en otro que ya estaba abierto (ver `00-plan-trabajo.md` §3.4,
  resuelto explícitamente como fuera de alcance del MVP).
- **Flujos alternativos (Fase 3)**: sincronización entre dispositivos sin recargar, si el
  usuario confirma que la necesita — a detallar en `11-tiempo-real-sincronizacion.md`.
- **Validaciones**: autenticación válida en cada dispositivo.
- **Resultado esperado**: los datos mostrados en cualquier dispositivo, al abrir o refrescar la
  app, son siempre los mismos (fuente de verdad única en backend).
- **Errores posibles**: mostrar datos obsoletos sin indicar que podrían no estar actualizados.
- **Criterios de aceptación**: nunca se promete "tiempo real entre dispositivos" en el MVP — el
  texto de la UI es preciso sobre esto (regla 11 de `CLAUDE.md`).

## Cierre de esta fase

- **Decisiones tomadas**: se detallaron los 25 casos de uso pedidos, cada uno con su fase de
  entrada (MVP/Fase 2/Fase 3), priorizando en profundidad los 5 casos críticos para el uso
  diario (1, 2, 3, 17, 18) y el módulo de moto (11, 11b) por ser el diferenciador confirmado.
- **Supuestos pendientes de confirmar**: ninguno nuevo — todos los casos parten de decisiones
  ya cerradas en `00-plan-trabajo.md` y `03-propuesta-valor.md`. Un punto queda explícitamente
  abierto para la Fase 8 (`08-modelo-datos.md`): la fórmula exacta de "saldo disponible" vs.
  "comprometido" vs. "patrimonio neto" del caso 17, que aún no se ha definido campo por campo.
- **Riesgos detectados**: (1) el caso 25 debe comunicar con precisión que el MVP no sincroniza
  entre dispositivos sin recargar, para no generar una expectativa que la arquitectura del MVP
  no cumple (regla 11 de `CLAUDE.md`); (2) el caso 20 (importación) depende de
  `10-migracion-excel.md`, todavía sin desarrollar en detalle — no se puede construir ese caso
  de uso a nivel de UI final hasta cerrar esa fase.
- **Entregables generados**: este documento.
- **Próxima etapa recomendada**: `05-requisitos-funcionales.md` y `06-requisitos-no-funcionales.md`
  (Fases 4-5) — ya tienen contenido previo (el módulo de moto y actividades ya se detalló
  antes); revisarlos para asegurar que reflejan fielmente los 25 casos de uso de este documento,
  en particular el nuevo caso 11b (abonos a capital) y el ajuste del caso 14 (una sola meta de
  ahorro en el MVP).
