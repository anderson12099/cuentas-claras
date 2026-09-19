# Fase 2 — Propuesta de valor y alcance

> Depende de `01-analisis-excel.md` y `02-investigacion-mercado.md` (ambos cerrados) y de las
> respuestas del usuario en `00-plan-trabajo.md` §3 (Fase 0, cerrada el 2026-09-13). Todo lo
> marcado como **[CONFIRMADO]** viene de algo que el usuario dijo explícitamente o de la
> investigación de mercado con fuente citada; **[INTERPRETACIÓN]** es una lectura razonable de
> esos hechos; **[RECOMENDACIÓN]** es un juicio técnico propio, no un hecho.

## 1. Problema principal que resolverá la aplicación

**[CONFIRMADO + INTERPRETACIÓN]** El usuario controla hoy sus finanzas (gastos, deudas,
préstamos, el crédito de una moto, ahorros) en un Excel en la nube que funciona pero le exige
demasiado esfuerzo manual: totalizar a mano, marcar estados con colores en vez de datos,
registrar un gasto desde el celular es lento, y no tiene una vista consolidada en tiempo real.
El análisis directo del archivo (`01-analisis-excel.md`) lo confirma con evidencia concreta:
solo 2 fórmulas en las 12 hojas, montos guardados a veces como texto con formatos mixtos, y
conceptos recurrentes (como "Cooperativa", 4 veces con el mismo monto) registrados a mano cada
vez en lugar de modelarse como una obligación recurrente.

El problema no es "no tener una app de finanzas" en abstracto — es que **el Excel actual no
modela dos cosas que sí son centrales en la vida financiera real del usuario**: un activo
financiado (la moto, con cuota + seguros + mantenimiento + combustible) y eventos/actividades
compartidas con otras personas (finca, paseo, recolecta) — ambas hoy resueltas con hojas
ad-hoc que no calculan nada automáticamente.

## 2. Usuario inicial

**[CONFIRMADO]** Un único usuario (el dueño del proyecto), sin necesidad de multiusuario ni
finanzas compartidas en esta primera versión (`00-plan-trabajo.md` §2 y §3.6-7). Usa celular y
computador, no tiene preferencia de sistema operativo móvil, y quiere poder operar la
aplicación bajo su propio control de infraestructura (Supabase, cuenta propia).

## 3. Trabajos que el usuario necesita realizar ("jobs to be done")

**[INTERPRETACIÓN]**, a partir de lo confirmado en `00-plan-trabajo.md` y `01-analisis-excel.md`:

1. Registrar un gasto o ingreso en segundos, sin pensar en qué pestaña o columna usar.
2. Saber, en cualquier momento, cuánto dinero tiene disponible de verdad (no solo el saldo
   contable) después de descontar lo comprometido (deudas, cuotas, moto).
3. Ver el estado de sus deudas y préstamos (a favor y en contra) sin tener que sumar columnas
   ni interpretar colores.
4. Llevar el crédito de la moto con precisión: cuánto debe hoy, qué pasa si abona a capital, y
   cuánto le queda de plazo — sin recalcular una tabla de amortización a mano.
5. Llevar cuentas de un evento o actividad compartida (una finca, un paseo, una recolecta) sin
   depender de una hoja distinta cada vez ni pedir documentos de identidad a los participantes.
6. Ahorrar hacia una meta concreta y ver el avance real, no solo un número suelto.
7. Corregir un error de registro sin perder el rastro de qué cambió y cuándo.

## 4. Frustraciones actuales (cruce con `00-plan-trabajo.md` §1 y `01-analisis-excel.md`)

**[CONFIRMADO]**

- Registrar un gasto desde el celular es lento y requiere "acomodar" el dato a la estructura de
  la hoja (evidencia directa: en "Cuentas Alejandra 2024" un mismo tipo de registro se repite en
  tres bloques de columnas distintos según el período).
- Los totales se calculan a mano — riesgo real de error (el archivo casi no usa fórmulas: 2 de
  todo el libro).
- El estado de deudas y pendientes se comunica con color, no con datos consultables (13
  colores de relleno distintos, 466 estilos de celda en total — imposible de mapear a mano).
- No hay dashboard en tiempo real ni recordatorios.
- La información está repartida en 12 hojas sin relación explícita entre ellas (solo por
  coincidencia de nombres o montos, según `01-analisis-excel.md` §7).
- Los gastos recurrentes (arriendo, mercado, diezmo, etc.) se reingresan manualmente cada mes en
  lugar de generarse solos.
- Cuando se registran varios gastos pequeños de una vez, el Excel actual los mezcla como texto
  libre en una sola celda en vez de separarlos (evidencia directa en Hoja2, fila "OTROS").

## 5. Funcionalidades imprescindibles (MVP)

**[CONFIRMADO — ver `00-plan-trabajo.md` §7, ya actualizado con la urgencia del usuario]**

Autenticación básica, cuentas, categorías, registro de ingresos/gastos con el formulario más
corto posible (confirmación visible + actualización inmediata del dashboard en el mismo
dispositivo), saldo calculado en backend, deudas básicas (sin interés compuesto todavía),
**módulo de moto con financiación básica + abonos a capital con recálculo de plazo**, ahorros
básicos (una meta simple), dashboard con saldo disponible/comprometido/ahorrado, y exportación
básica a CSV.

## 6. Funcionalidades deseables (Fase 2 del roadmap)

**[CONFIRMADO/INTERPRETACIÓN, ver `13-plan-desarrollo-roadmap.md`]** Préstamos a terceros,
seguros/mantenimiento/combustible del módulo de moto, gastos recurrentes automáticos,
recordatorios, importación de Excel, reportes avanzados, y el **módulo de actividades/finca
familiar** (participantes, aportes, gastos, saldo por persona — ver `05-requisitos-funcionales.md`).

## 7. Funcionalidades para fases posteriores

**[CONFIRMADO, ver `13-plan-desarrollo-roadmap.md`]** PWA/offline, sincronización entre
dispositivos, notificaciones push, adjuntos, auditoría avanzada, automatizaciones (Fase 3);
integraciones bancarias, clasificación automática de gastos, OCR de comprobantes, predicciones
y alertas, multiusuario/finanzas compartidas, cualquier función de IA — cada una con
justificación explícita de por qué se necesita IA y no una solución determinista más simple
(regla 10 de `CLAUDE.md`) (Fase 4).

## 8. Diferenciadores confirmados (contrastados contra `02-investigacion-mercado.md`)

**[CONFIRMADO]**

1. **Módulo dedicado al crédito de la moto** (cuota, plazo, abonos a capital con recálculo de
   plazo, y en Fase 2: seguros, mantenimiento, combustible, costo acumulado). Ninguna de las 12
   apps/categorías revisadas en `02-investigacion-mercado.md` modela un activo financiado como
   entidad de primera clase — en el mejor caso (YNAB, Monarch) lo tratan como una "deuda"
   genérica con calculadora de préstamo, sin seguros/mantenimiento/combustible integrados.
2. **Módulo de actividades/finca familiar** (participantes, aportes, gastos, saldo calculado
   por persona), como diferenciador de segundo orden: ninguna app de finanzas personales
   revisada integra "gastos compartidos de un evento" — esa categoría la resuelven apps
   separadas tipo Splitwise. Es diferenciador solo si se ejecuta con calidad comparable a esas
   apps (riesgo ya anotado en el cierre de `02-investigacion-mercado.md`).

**Descartados como diferenciador** (`02-investigacion-mercado.md` — síntesis): registro rápido
de gasto en <10s y dashboard consolidado de saldo/obligaciones. Son **condición necesaria para
competir**, no diferenciadores — casi toda la competencia ya los resuelve.

## 9. Propuesta de valor (una frase)

**[RECOMENDACIÓN]** *"La única app de finanzas personales que lleva tu crédito de la moto y
tus actividades compartidas con la misma precisión con la que lleva tus gastos e ingresos —
sin totalizar nada a mano."*

## 10. Posicionamiento del producto

**[RECOMENDACIÓN]** Cuentas Claras no compite por ser "otra app de gastos genérica" (esa
categoría ya está resuelta por decenas de apps y por la propia app del banco del usuario,
gratis). Compite por resolver, dentro de una sola app, dos cosas que hoy el usuario lleva a
mano y que el mercado revisado no integra en un solo producto: **un activo financiado** y
**actividades/eventos compartidos**, sobre una base sólida de control de gastos, deudas y
ahorro.

## 11. Beneficio principal frente al Excel actual

**[CONFIRMADO/INTERPRETACIÓN]** Elimina el cálculo manual de totales y el marcado por color;
da una fuente única de verdad para el saldo (calculada en backend, nunca "a mano"); permite
registrar un gasto en segundos desde el celular con confirmación inmediata; y modela como datos
explícitos lo que hoy son 12 hojas dispersas sin relación formal entre sí.

## 12. Beneficio principal frente a apps financieras existentes

**[CONFIRMADO, ver `02-investigacion-mercado.md`]** Ninguna competidora revisada resuelve el
crédito de un vehículo financiado ni los gastos de un evento/actividad compartida dentro de la
misma app de finanzas personales — el usuario hoy necesitaría dos o tres apps distintas (una de
gasto general, una de deudas, y una tipo Splitwise) para cubrir lo que Cuentas Claras cubre en
una sola.

## 13. Riesgo de construir una aplicación demasiado amplia

**[CONFIRMADO — ver también `00-plan-trabajo.md` §7]** El usuario pidió el MVP con carácter
urgente. El riesgo principal sigue siendo el mismo que en la Fase 0, pero agravado por el
tiempo: construir más módulos de los necesarios antes de validar que el flujo básico (registrar
gasto → ver saldo real → llevar la moto) ya resuelve la frustración principal retrasaría
directamente la entrega. Por eso el módulo de actividades/finca familiar, aunque es un
diferenciador confirmado, se mantiene en Fase 2 y no en el MVP: depende de que el modelo base de
movimientos y participantes ya esté sólido, y no es indispensable para el primer uso diario.

## 14. MVP recomendado (versión final)

**[CONFIRMADO — idéntico a `00-plan-trabajo.md` §7, ya cerrado con el usuario]** Ver esa
sección para el detalle completo; no se repite aquí para evitar que los dos documentos queden
desincronizados si el alcance cambia — `00-plan-trabajo.md` §7 es la fuente única de verdad del
alcance del MVP.

## Cierre de esta fase

- **Decisiones tomadas**: propuesta de valor, posicionamiento y los dos diferenciadores
  confirmados (moto y actividades/finca) quedan documentados con su contraste explícito contra
  la competencia real; se descartan como diferenciador el registro rápido y el dashboard
  consolidado, por ser ya estándar de mercado.
- **Supuestos pendientes de confirmar**: ninguno nuevo en esta fase — todos los supuestos
  relevantes ya se resolvieron en `00-plan-trabajo.md` y `02-investigacion-mercado.md`.
- **Riesgos detectados**: (1) construir de más con tiempo urgente sigue siendo el riesgo
  principal; (2) el módulo de actividades/finca familiar es diferenciador solo si se ejecuta
  bien — un módulo genérico mal hecho sería peor que no tenerlo; (3) el competidor más cercano y
  gratuito (app del banco) obliga a que la propuesta de valor sea concreta y no genérica, o el
  usuario no percibirá el beneficio de usar una app aparte.
- **Entregables generados**: este documento.
- **Próxima etapa recomendada**: `04-casos-de-uso.md` (Fase 3) — ya puede detallarse con base en
  los trabajos ("jobs to be done") de la sección 3 de este documento y el MVP confirmado.
