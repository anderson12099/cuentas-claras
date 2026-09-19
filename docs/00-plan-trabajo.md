# Fase 0 — Plan de trabajo inicial

> Ver `CLAUDE.md` para las reglas de trabajo. Este documento distingue explícitamente
> **requisitos del usuario**, **supuestos** y **recomendaciones técnicas**.

## 1. Entendimiento del proyecto

El usuario administra hoy sus finanzas personales en un Excel en la nube con pestañas para
gastos, deudas, préstamos, pagos de una moto financiada, ahorros, pendientes, categorías y
totales/balances. El sistema funciona pero tiene fricciones estructurales: registrar un gasto
desde el celular es lento, los totales se calculan a mano (riesgo de error), el estado de
deudas/pendientes se marca con colores en vez de datos, no hay dashboard en tiempo real ni
recordatorios, y la información está repartida en varias pestañas sin una vista consolidada.

El objetivo es construir una aplicación web responsive (con potencial de evolucionar a PWA
instalable) que centralice: movimientos (ingresos/gastos), cuentas, categorías, deudas,
préstamos, un módulo específico para la moto, ahorros/metas, gastos recurrentes, recordatorios,
presupuestos y reportes — con el saldo siempre calculado en backend, nunca "a mano".

## 2. Supuestos iniciales (declarados por falta de información — no bloquean el avance)

- **Usuario único** en la primera versión (no se asume multiusuario ni compartir finanzas
  hasta la Fase 4 del roadmap).
- ~~Moneda principal: COP~~ **Confirmado por el usuario (2026-09-13)**: la app maneja
  exclusivamente pesos colombianos (COP) — sin multi-moneda en el alcance actual.
- El Excel está en una nube tipo Google Sheets/Excel Online — el mecanismo exacto de acceso
  (API vs. exportación manual) se definirá en `01-analisis-excel.md` una vez se reciba el
  archivo.
- El usuario está dispuesto a usar una app nueva (no busca solo automatizar el Excel actual
  sin cambiar de herramienta).
- No hay, por ahora, necesidad de integraciones bancarias automáticas (open banking) — el
  registro es manual pero debe ser muy rápido.

## 3. Preguntas críticas agrupadas

Estas preguntas no bloquean el arranque del proyecto (ver supuestos arriba), pero sí son
necesarias para cerrar el alcance del MVP con precisión. Se agrupan en una sola tanda, como
indican las reglas de trabajo:

1. ~~**Excel**: ¿puedes compartir el archivo real...~~ **Resuelto**: se recibió
   `docs/Deuda_Aleja.xlsx` y ya se analizó en `01-analisis-excel.md`. Del análisis surgió una
   pregunta nueva de alcance (ver punto 1b).
1b. ~~**Alcance de hojas dudosas**~~ **Resuelto (2026-09-13)**: *Cuentas Alejandra 2024* y
    *gasolina moto aleja* **sí entran** al alcance — se tratan como movimientos/gastos más
    dentro del mismo modelo de datos (`Transaction`, ver `08-modelo-datos.md`). *MARRANADA* y
    *FINCA FAUNER* no se migran tal cual: en su lugar, el usuario pidió un **módulo nuevo y
    genérico de actividades/eventos familiares** (p. ej. control de una finca, una actividad
    grupal) que cubra el mismo caso de uso (participantes, aportes, gastos, saldos) sin
    depender de dos hojas ad-hoc ni exigir documentos de identidad de terceros. Ver
    `05-requisitos-funcionales.md` → "Módulo de actividades/finca familiar" y
    `08-modelo-datos.md` → entidades `Activity*`.
2. ~~**Moneda y ubicación**~~ **Resuelto (2026-09-13)**: todo el manejo es en pesos
   colombianos (COP). Sin necesidad de multi-moneda.
3. ~~**Moto**: ¿el crédito de la moto está activo hoy?...~~ **Resuelto (2026-09-13)**: el
   crédito **está activo**, y los datos de partida son **los mismos que ya están en la hoja
   "Deuda Moto" de `Deuda_Aleja.xlsx`** (saldo inicial, interés mensual, pago a capital,
   amortización, saldo final — ver `01-analisis-excel.md` §2 y §11), no hace falta
   reingresarlos a mano. Requisito nuevo del usuario: la app debe permitir registrar **abonos
   a capital** (pagos extra que reducen el saldo del crédito antes de tiempo) y **recalcular
   automáticamente** la tabla de amortización restante (saldo, cuotas/plazo, intereses) a
   partir de ese abono — ver `05-requisitos-funcionales.md` → "Módulo de moto → Abonos a
   capital".
4. ~~**Alcance de "tiempo real"**~~ **Resuelto (2026-09-13)**: al guardar un movimiento, la app
   debe mostrar una confirmación visible de "guardado exitosamente", mostrar el dato recién
   guardado, y **actualizar toda la información relacionada** (saldo, dashboard, totales) sin
   que el usuario tenga que recargar nada — todo esto en el **mismo dispositivo** donde se
   registró el movimiento. El usuario no pidió explícitamente que otro dispositivo abierto en
   paralelo se actualice solo sin refrescar; se declara como **supuesto** que ese nivel
   (sincronización entre dispositivos sin recargar) queda fuera del alcance inicial y se revisa
   en `11-tiempo-real-sincronizacion.md` si se necesita más adelante.
5. ~~**Dispositivos**~~ **Resuelto (2026-09-13)**: celular y computador (web) — no se requiere
   evaluar Android vs. iOS por separado ni una app nativa; una web responsive (con potencial de
   PWA) cubre ambos casos por navegador.
6. ~~**Preferencia de operación**~~ **Resuelto (2026-09-13)**: el usuario tiene pensado
   **Supabase** como plataforma, bajo su propio control/cuenta (no un tercero que administre
   todo por él). Esto se toma como **candidato fuerte** (no como decisión final cerrada) para
   `07-arquitectura-tecnologica.md`, donde de todas formas se compara contra 1-2 alternativas
   antes de recomendar formalmente — pero condiciona la comparación: Supabase ya resuelve de
   fábrica Postgres administrado, autenticación, y suscripciones en tiempo real (relevante para
   el punto 4 anterior), con un plan gratuito viable para un solo usuario.
7. ~~**Presupuesto y tiempo**~~ **Resuelto (2026-09-13)**: el usuario quiere el MVP **lo antes
   posible / con carácter urgente** — no es un proyecto sin presión de tiempo. Esto cambia la
   recomendación de alcance del MVP (ver §7 más abajo, actualizada) hacia un alcance todavía más
   acotado que el propuesto originalmente, para llegar más rápido a algo usable.

## 4. Plan de trabajo

El trabajo avanza por fases, cada una con su propio documento en `docs/` (ver tabla en
`CLAUDE.md` §5). Orden recomendado:

1. **Fase 0 — Descubrimiento** (este documento). Cierra cuando el usuario responda las
   preguntas críticas y comparta el Excel.
2. **Fase 1 — Análisis del Excel + Investigación de mercado** (en paralelo):
   `01-analisis-excel.md` y `02-investigacion-mercado.md`.
3. **Fase 2 — Valor y alcance**: `03-propuesta-valor.md` (depende de 1 y 2).
4. **Fase 3 — Casos de uso**: `04-casos-de-uso.md`.
5. **Fase 4-5 — Requisitos**: `05-requisitos-funcionales.md`, `06-requisitos-no-funcionales.md`.
6. **Fase 6-7 — Tecnología y arquitectura**: `07-arquitectura-tecnologica.md`.
7. **Fase 8 — Modelo de datos**: `08-modelo-datos.md`.
8. **Fase 9 — UX**: `09-experiencia-usuario.md`.
9. **Fase 10-11 — Migración y sincronización**: `10-migracion-excel.md`,
   `11-tiempo-real-sincronizacion.md`.
10. **Fase 12 — Seguridad**: `12-seguridad-privacidad.md`.
11. **Fase 13-15 — Plan de desarrollo, pruebas y backlog**: `13-plan-desarrollo-roadmap.md`,
    `14-plan-pruebas.md`, `15-backlog-riesgos-siguientes-pasos.md`.

Cada fase cierra con: decisiones tomadas, supuestos pendientes, riesgos detectados,
entregables generados y la próxima etapa recomendada — no se pasa a código de producto sin
haber cerrado al menos las Fases 0-8.

## 5. Primera hipótesis de valor agregado (a validar en Fase 2)

> Marcada explícitamente como **hipótesis**, no como diferenciador confirmado — se contrasta
> contra la competencia real en `02-investigacion-mercado.md` antes de darla por válida.

Frente al Excel actual, el valor central sería: **registrar un gasto en menos de 10 segundos
desde el celular, con el saldo y las obligaciones (deudas, moto, ahorros) siempre calculados
automáticamente y visibles en un solo dashboard**, eliminando el marcado manual por colores y
los totales a mano. El diferenciador más específico frente a apps genéricas de gastos sería el
**módulo dedicado a un activo financiado (la moto)** integrado con deudas y presupuesto, algo
que la mayoría de apps de gasto personal no modelan como caso de primera clase.

## 6. Información que se necesita del Excel (Fase 1)

Para poder ejecutar `01-analisis-excel.md` sin inventar nada, se necesita el archivo (o una
copia) con al menos:

- Todas las pestañas tal como existen hoy (nombres reales).
- Encabezados de cada tabla/columna.
- Al menos una muestra de filas reales (o representativas) por pestaña.
- Fórmulas usadas en columnas de totales/cálculos (no solo el resultado).
- Ejemplos de las convenciones de color/subrayado que hoy comunican estado (p. ej. "rojo =
  vencido").
- La pestaña de la moto completa, dado que es un módulo especializado del producto.

## 7. Recomendación sobre el alcance del MVP (actualizada 2026-09-13 — usuario pidió MVP urgente)

Con la investigación de mercado y el análisis del Excel ya cerrados, y sabiendo que el usuario
quiere el MVP **lo antes posible**, se acota el MVP original para que sea realista en poco
tiempo, sin perder lo que ya se confirmó como diferenciador real (`02-investigacion-mercado.md`):

**Incluir en el MVP**: autenticación básica, cuentas, categorías, registro de ingresos/gastos
con el formulario más corto posible (confirmación visible + actualización inmediata del
dashboard en el mismo dispositivo, ver §3.4), saldo calculado en backend, deudas básicas (sin
intereses compuestos todavía), **módulo de moto con financiación básica + abonos a capital con
recálculo de plazo** (es el diferenciador confirmado, no se puede dejar para después), ahorros
básicos (una meta simple), dashboard con saldo disponible/comprometido/ahorrado, y exportación
básica a CSV.

**Dejar fuera del MVP** (Fase 2+): préstamos a terceros, seguros/mantenimiento/combustible del
módulo de moto, gastos recurrentes automáticos, recordatorios, importación de Excel, reportes
avanzados, PWA/offline, notificaciones push, el **módulo de actividades/finca familiar**
(depende de que el modelo base de movimientos y participantes ya esté sólido) y cualquier
función de IA (clasificación automática, OCR, predicciones).

Cambio respecto a la versión anterior de este documento: el **módulo de moto (financiación +
abonos a capital)** se sube de "Fase 2" a **MVP**, porque (a) el usuario lo confirmó como
requisito activo y con datos reales ya disponibles del Excel, y (b) la investigación de mercado
lo confirmó como el diferenciador más fuerte frente a la competencia — dejarlo fuera del primer
lanzamiento desperdiciaría la ventaja frente a apps genéricas de gasto.

Razón para lo demás: con urgencia de tiempo, el riesgo de construir de más es todavía mayor que
antes — cada módulo fuera del MVP reduce directamente el tiempo para tener algo usable.

## Cierre de esta fase

**Fase 0 cerrada (2026-09-13)** — las 7 preguntas críticas de §3 ya tienen respuesta del
usuario y el Excel ya fue recibido y analizado.

- **Decisiones tomadas**: estructura de documentación definida; orden de fases acordado; MVP
  redefinido con carácter urgente, subiendo el módulo de moto (financiación + abonos a capital)
  a MVP; moneda COP única; celular + web como dispositivos objetivo (sin app nativa); Supabase
  bajo control propio como candidato fuerte de infraestructura; "tiempo real" acotado a
  actualización inmediata en el mismo dispositivo (no entre dispositivos, por ahora).
- **Supuestos pendientes de confirmar**: usuario único (no se ha preguntado explícitamente,
  pero nada en las respuestas del usuario lo contradice); ausencia de integraciones bancarias
  automáticas (tampoco contradicho, pero tampoco confirmado explícitamente).
- **Riesgos detectados**: (1) con tiempo urgente, cualquier alcance adicional que se cuele en
  el MVP retrasa la entrega — mantener disciplina de alcance es más crítico que antes; (2)
  Supabase se toma como candidato fuerte por preferencia del usuario, pero **no exime** de
  hacer la comparación mínima de alternativas en `07-arquitectura-tecnologica.md` (regla del
  proyecto: no elegir tecnología solo por popularidad/preferencia sin justificar el ajuste); (3)
  "tiempo real acotado a un solo dispositivo" simplifica la Fase 10-11, pero si el usuario
  esperaba ver el cambio también en otro dispositivo sin recargar, hay que revisarlo antes de
  cerrar `11-tiempo-real-sincronizacion.md`.
- **Entregables generados**: `CLAUDE.md`, todos los `docs/00` a `docs/15` (algunos aún como
  plantilla), `01-analisis-excel.md` y `02-investigacion-mercado.md` ya completos.
- **Próxima etapa recomendada**: `03-propuesta-valor.md` (Fase 2), que ya puede escribirse con
  el análisis del Excel, la investigación de mercado y todas las respuestas de esta fase.
