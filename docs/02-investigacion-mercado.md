# Fase 1b — Investigación de mercado

> Todas las filas de este documento se completaron con búsqueda web real, realizada el
> **2026-09-13**. Cada fila cita su fuente y la fecha de consulta (misma fecha para todas, salvo
> que se indique otra). Donde una fuente no daba un dato (p. ej. precio no público), se marca
> explícitamente como **[SIN DATO]** en vez de inventarlo — ver regla 3 de `CLAUDE.md`.
>
> Nota de alcance: ninguna fuente consultada reporta pricing exacto verificado en tiempo real
> (las apps cambian precios con frecuencia); los valores aquí son los que las fuentes
> publicaron en la fecha de consulta y deben confirmarse en el sitio oficial antes de usarlos
> en cualquier decisión comercial.

## Aplicaciones cubiertas

Se cubrieron las 8 apps mínimas pedidas en la plantilla original (Wallet, Spendee, Money
Manager, YNAB, Monarch Money, PocketGuard, Goodbudget, Fintonic), más 3 apps que aparecen
repetidamente en rankings dirigidos a usuarios colombianos (Monefy, Bluecoins, Mobills), la
app del banco principal del usuario (Bancolombia — sección "Día a día"), y una app de
referencia para gastos compartidos (Splitwise), relevante para evaluar el módulo de
actividades/finca familiar. No se encontró ninguna app de finanzas personales **de origen
colombiano** con tracción relevante en las fuentes consultadas — el mercado colombiano se
sirve hoy con apps internacionales (Mint, YNAB, Fintonic, Wallet, Monefy, Bluecoins, Mobills)
más las funciones nativas de los bancos/neobancos (Bancolombia, Nequi). Esto en sí mismo es un
hallazgo relevante para `03-propuesta-valor.md`.

## Tabla comparativa

| Campo | **Wallet (BudgetBakers)** | **Spendee** | **Money Manager (Realbyte)** | **YNAB** |
|---|---|---|---|---|
| País / mercado principal | República Checa / global | República Checa / global | Corea del Sur / global | EE. UU. / global |
| Plataformas | iOS, Android, Web | iOS, Android, Web | iOS, Android | iOS, Android, Web |
| Funciones principales | Sync bancario (15K+ bancos), categorización automática que aprende, análisis de flujo de caja, división de gastos entre personas | Multi-cuenta (efectivo, banco, e-wallet, **cripto**), presupuestos inteligentes, vista consolidada | Totales semanales/mensuales, presupuesto por categoría, calendario de movimientos, fotos de recibos, gráficos de tendencia de activos | Presupuesto base cero ("dale un trabajo a cada peso"), metas de ahorro, calculadora de deudas, sync bancario |
| Control de gastos | Sí, automático vía sync bancario | Sí, manual o por cuenta conectada | Sí, manual, con calendario y filtros avanzados | Sí, manual/sync, ligado al presupuesto |
| Manejo de deudas | No es el foco; se menciona ahorro en intereses vía análisis de flujo de caja | [SIN DATO] — no detallado en la fuente consultada | Sí — libro de doble entrada para préstamos, junto con ahorros y seguros | Sí — "loan calculator" y seguimiento de pago de deudas |
| Gestión de ahorros | Parcial (vía análisis de flujo de caja) | Presupuestos orientados a metas de ahorro | Sí, junto con seguros y bienes raíces (doble entrada) | Sí, metas de ahorro con seguimiento de progreso |
| Presupuestos | Sí | Sí ("smart budgeting") | Sí, por categoría y mes | Sí, es el método central (base cero) |
| Recordatorios | [SIN DATO] | [SIN DATO] | [SIN DATO] | No destacado en la fuente |
| Reportes | Análisis de flujo de caja, insights financieros | Vista de actividad básica; poco detalle en la fuente | Calendario, gráficos de gasto, tendencia de activos | Reportes propios del método base cero |
| Sincronización | Bancaria automática (15K+ instituciones) | Multi-cuenta (banco, efectivo, cripto) | Manual (no se reporta sync bancario en la fuente) | Bancaria automática, en tiempo real entre dispositivos |
| Experiencia móvil | Nativa iOS/Android | Nativa iOS/Android | Nativa iOS/Android | Nativa iOS/Android |
| Experiencia web | Sí (web app) | Sí | No reportada | Sí |
| Modelo de negocio | Freemium + suscripción Premium (precio no detallado en la fuente) | Suscripción por niveles | Freemium (no se reporta precio) | Suscripción pura, sin nivel gratuito real (solo trial) |
| Precio | [SIN DATO exacto] — "Premium" sin cifra pública en la fuente | Basic **14 €/mes**, Plus **21 €/mes**, Premium sin precio publicado | [SIN DATO] | **US$14.99/mes** o **US$109/año** (~US$9.08/mes); hasta 6 personas por suscripción |
| Fortalezas | Sync bancario amplio, categorización automática, certificación ISO 27001 / GDPR | Multi-cuenta incl. cripto, buena presentación visual | Doble entrada para activos/pasivos, muy descargada (20M+, 4.7★) | Método disciplinado, sync en tiempo real multi-dispositivo, calculadora de deudas |
| Debilidades | Precio Premium no transparente en la fuente | Precio relativamente alto (14–21 €/mes), poca info de reseñas | Sin sync bancario reportado (carga más manual) | Precio alto sin plan gratuito real; problemas de conectividad bancaria reportados en ciertos países |
| Problemas sin resolver | No modela activos financiados individuales (tipo "moto") como caso de primera clase | Igual — enfoque generalista de gasto/cuenta, no de activos financiados | Igual — no hay módulo de vehículo/activo financiado dedicado | Igual — el "loan calculator" es genérico, no un módulo de activo financiado con seguros/mantenimiento |
| Público objetivo | Usuarios que quieren automatización vía bancos conectados | Usuarios con varias cuentas/monedas, incl. cripto | Usuarios que quieren registro manual detallado con reportes | Usuarios disciplinados dispuestos a pagar por un método estricto |
| Oportunidad de diferenciación para Cuentas Claras | Ninguna modela un crédito de vehículo con seguros/mantenimiento/combustible como módulo propio | Igual | Tiene doble entrada de préstamos pero no un módulo de "moto" específico | El "loan calculator" es genérico; no hay módulo de activo financiado con historial de cuotas + seguros + combustible |
| Fuente / fecha de consulta | [BudgetBakers](https://budgetbakers.com/en/), 2026-09-13 | [Comparasoftware — Spendee](https://www.comparasoftware.es/spendee), 2026-09-13 | [Realbyte Apps](https://www.realbyteapps.com/), 2026-09-13 | [CostBench — YNAB Pricing](https://costbench.com/software/personal-finance/ynab/), 2026-09-13 |

| Campo | **Monarch Money** | **PocketGuard** | **Goodbudget** | **Fintonic** |
|---|---|---|---|---|
| País / mercado principal | EE. UU. | EE. UU. | EE. UU. | España / algunos países de Latam (Colombia **no disponible**, según la fuente) |
| Plataformas | iOS, Android, escritorio (web) | No especificado en la fuente (app móvil + posible web) | [SIN DATO específico de plataformas] | App móvil (iOS/Android) |
| Funciones principales | Patrimonio neto (13,000+ instituciones), presupuesto por categoría, planeación de metas, reportes personalizables, integra Zillow y Coinbase | "In My Pocket" (dinero disponible tras cuentas fijas y ahorro), tracking automático, monitoreo de facturas/suscripciones | Presupuesto por sobres virtuales (envelope budgeting) | Organiza cuentas, alertas de comisiones/sobregiros/cobros duplicados, credit score gratuito (FinScore), gestión de seguros |
| Control de gastos | Sí, automático vía sync bancario | Sí, automático | Manual (sync bancario solo en plan Premium, solo bancos de EE. UU.) | Sí, vía conexión a múltiples cuentas |
| Manejo de deudas | Metas de pago de deuda dentro del dashboard | Plan de pago de deuda (solo Premium) | No reportado como función central (es presupuesto por sobres) | No detallado en la fuente |
| Gestión de ahorros | Sí, integrado a metas y patrimonio neto | Vía "In My Pocket" (dinero disponible tras ahorro) | Es el mecanismo central (sobres = metas de ahorro/gasto) | No detallado en la fuente |
| Presupuestos | Sí, por categoría con pronóstico de gasto | Sí, con enfoque en "cuánto puedo gastar hoy" | Sí — es el producto entero (sobres) | No es el foco central (más alertas/consolidación) |
| Recordatorios | [SIN DATO] | Monitoreo de facturas y suscripciones | [SIN DATO] | Sí — alertas de vencimientos y cobros |
| Reportes | Gráficos personalizables, seguimiento de patrimonio neto | "Insights de gasto detallados" | [SIN DATO detallado] | No es el foco central |
| Sincronización | Bancaria automática, 13,000+ instituciones | Bancaria automática | Solo Premium, solo bancos de EE. UU. | Multi-cuenta (bancos + productos financieros) |
| Experiencia móvil | Nativa | Nativa (no detallada) | Nativa | Nativa |
| Experiencia web | Sí (escritorio) | No confirmada en la fuente | [SIN DATO] | No confirmada |
| Modelo de negocio | Suscripción pura | Freemium (Free + Premium) | Freemium (Free + Premium) | Cotización personalizada, sin precio público |
| Precio | **US$14.99/mes** o **US$99.99/año** | Free (básico) + Premium (mensual/anual, precio no detallado en la fuente) | Free (20 sobres, 1 cuenta) + Premium **US$10/mes o US$80/año** | Sin precio público (modelo "cotiza con nosotros") |
| Fortalezas | Excelente para finanzas conjuntas de pareja/familia, integra propiedad y cripto | Muy simple de usar, foco en "dinero disponible hoy" | Método de sobres muy claro para presupuesto disciplinado, plan gratuito real | Alertas proactivas, credit score gratuito, agregador de 55+ entidades |
| Debilidades | Precio alto, sync a veces "glitchy" según reseñas, soporte lento | Funciones avanzadas solo de pago, poco enfoque en planeación a largo plazo | Sin patrimonio neto/inversiones, sync bancario solo EE. UU. | No disponible en Colombia; sin transparencia de precio |
| Problemas sin resolver | Ningún módulo dedicado a un activo financiado tipo moto | Igual | Sin módulo de activo financiado; sobres genéricos no capturan cuotas/seguros de un crédito | No disponible en el mercado objetivo (Colombia) |
| Público objetivo | Parejas/familias con finanzas combinadas, quieren ver patrimonio neto completo | Usuarios que solo quieren saber "cuánto puedo gastar hoy" | Usuarios disciplinados que prefieren el método de sobres | Usuarios españoles/latam que buscan consolidar productos financieros con un banco/asegurador |
| Oportunidad de diferenciación para Cuentas Claras | Sin módulo de vehículo financiado | Igual | Igual | Fintonic ni siquiera opera en Colombia — no es competencia directa real hoy |
| Fuente / fecha de consulta | [Forbes Advisor — Monarch Money Review](https://www.forbes.com/advisor/banking/monarch-budget-app-review/), 2026-09-13 | [SmartAsset — PocketGuard Review](https://smartasset.com/personal-finance/pocketguard-review-compare), 2026-09-13 | [CostBench — Goodbudget Pricing](https://costbench.com/software/personal-finance/goodbudget/), 2026-09-13 | [Comparasoftware — Fintonic](https://www.comparasoftware.co/fintonic), 2026-09-13 |

### Apps adicionales relevantes para el contexto colombiano

| Campo | **Monefy** | **Bluecoins** | **Mobills** | **App Bancolombia ("Día a día")** |
|---|---|---|---|---|
| Por qué se incluye | Aparece repetidamente en rankings dirigidos a usuarios colombianos como alternativa simple | Igual — recomendada por su detalle de reportes | Igual — recomendada por su enfoque en metas | Es la app del banco principal del usuario; ya la usa o puede usarla sin instalar nada nuevo |
| Funciones principales | Registro con un toque, categorización visual simple | Reportes financieros detallados, multi-moneda, recordatorios de pago | Metas de ahorro a corto plazo, enfoque educativo | Categorización automática de gastos con informe mensual/anual, presupuestos, cupo de crédito disponible según ingresos/gastos, agregación de otros bancos |
| Manejo de deudas / moto | No reportado como función dedicada | No reportado como módulo de activo financiado | No reportado | No reportado — es agregación de cuentas, no gestión de un crédito específico de vehículo |
| Precio | [SIN DATO] | [SIN DATO] | [SIN DATO] | Gratis (incluida en la app del banco) |
| Oportunidad de diferenciación | Ninguna resuelve el caso del activo financiado (moto) como módulo propio | Igual | Igual | Es gratis y ya conectado al banco real del usuario — la barrera a superar no es "otra app de gastos", es justificar por qué vale la pena una app aparte de la del banco |
| Fuente / fecha de consulta | [Minuto60 — Apps presupuesto Colombia](https://www.minuto60.com/economia/apps-hacer-presupuesto-ahorrar-colombia/7630), 2026-09-13 | [Vibra.co — 5 apps control de gastos Colombia](https://vibra.co/actualidad/no-te-alcanza-el-sueldo-5-apps-que-te-ayudan-a-controlar-tus-gastos-en-colombia-para-llegar-a-fin-de-mes/), 2026-09-13 | Igual que Bluecoins | [Bancolombia — Centro de ayuda](https://www.bancolombia.com/centro-de-ayuda/canales/app-bancolombia/administrar-finanzas), 2026-09-13 |

### App de referencia para el módulo de actividades/finca familiar

| Campo | **Splitwise** (y categoría "apps para compartir gastos") |
|---|---|
| Qué resuelve | Dividir gastos de un grupo (viaje, evento, convivencia) y calcular quién debe a quién |
| Relación con Cuentas Claras | Es la categoría de app que hoy resuelve lo que las hojas "MARRANADA" y "FINCA FAUNER" del Excel intentaban resolver a mano |
| Hallazgo clave | Las búsquedas confirman que **gastos compartidos de un evento** y **finanzas personales** son, en el mercado actual, dos categorías de producto separadas — ninguna de las apps de finanzas personales revisadas (Wallet, Spendee, YNAB, Monarch, PocketGuard, Goodbudget) integra un módulo de "evento/actividad grupal" comparable a Splitwise |
| Fuente / fecha de consulta | [Xataka Móvil — apps para compartir gastos](https://www.xatakamovil.com/aplicaciones/apps-compartir-gastos-dividir-cuenta), 2026-09-13; [Wikipedia — Splitwise](https://en.wikipedia.org/wiki/Splitwise), 2026-09-13 |

## Síntesis

### Funciones que la mayoría de apps ya resuelve bien (no vale la pena reinventar)

- Registro de gastos por categoría con gráficos de distribución (todas las apps revisadas lo
  tienen, incluyendo las gratuitas como Monefy).
- Presupuesto por categoría/mes (Wallet, Spendee, Money Manager, YNAB, Monarch, PocketGuard,
  Goodbudget, y la app de Bancolombia).
- Sincronización bancaria automática, donde el modelo de negocio lo justifica (YNAB, Monarch,
  PocketGuard, Wallet) — aunque varias fuentes reportan fallas de conectividad reales, no es un
  problema sin resolver conceptualmente, es un problema de ejecución/costo de mantenimiento de
  integraciones bancarias (relevante para la decisión de la Fase 6-7: no prometer sync bancario
  automático en el MVP sin evaluar su costo real).
- Metas de ahorro con seguimiento de progreso (YNAB, Monarch, Goodbudget, Money Manager).

### Funciones que ninguna resuelve bien para el caso de este usuario (oportunidad real)

- **Ningún competidor revisado modela un activo financiado (crédito de vehículo) como entidad
  de primera clase** con cuota, seguros, mantenimiento, combustible y saldo de financiación en
  un mismo lugar — todas lo tratarían, en el mejor caso, como una "deuda" genérica (YNAB,
  Monarch) o no lo modelan en absoluto (Wallet, Spendee, Money Manager, PocketGuard,
  Goodbudget). Esto **confirma** la primera hipótesis de valor de `00-plan-trabajo.md` §5: el
  módulo dedicado a la moto es un diferenciador real, no solo percibido.
- **Ninguna app de finanzas personales integra gastos compartidos de un evento/actividad
  grupal** dentro del mismo producto — esa categoría la resuelven apps separadas tipo
  Splitwise. Esto es evidencia a favor de que el **módulo de actividades/finca familiar**
  (Fase 2 del roadmap) sí sería un diferenciador si se ejecuta bien, porque hoy un usuario
  necesitaría dos apps distintas (una de finanzas personales y otra tipo Splitwise) para cubrir
  lo que el Excel actual intenta resolver en dos pestañas ad-hoc.
- **Ninguna app internacional revisada opera hoy en Colombia con foco local** (Fintonic
  explícitamente no está disponible en Colombia según la fuente consultada); el mercado
  colombiano se sirve con apps genéricas en inglés/español neutro o con las funciones nativas
  del banco. Esto reduce el riesgo de que "otra app de finanzas" ya esté resuelta localmente,
  pero también sube la barrera real: la competencia más directa y gratuita **es la propia app
  del banco del usuario** (Bancolombia "Día a día"), no otra app de terceros.

### Contraste explícito contra la primera hipótesis de valor de `00-plan-trabajo.md`

La hipótesis decía: *"registrar un gasto en menos de 10 segundos desde el celular, con el
saldo y las obligaciones siempre calculados automáticamente... el diferenciador más específico
sería el módulo dedicado a un activo financiado (la moto)."*

- **Registro rápido de gasto en <10s**: no es diferenciador — casi todas las apps revisadas
  (Monefy, Wallet, Spendee, Money Manager) ya venden justamente esto como su propuesta
  principal. Sigue siendo una **condición necesaria para competir**, no un diferenciador.
- **Dashboard con saldo/obligaciones consolidado**: tampoco es diferenciador por sí solo — es
  la función central de Monarch Money y YNAB. Necesario, no suficiente.
- **Módulo dedicado a un activo financiado (moto)**: **se confirma como diferenciador real** —
  ninguna app revisada lo resuelve como módulo propio con seguros, mantenimiento, combustible y
  cuotas en un solo lugar.
- **Módulo de actividades/finca familiar**: se **añade** como segundo diferenciador candidato
  (no estaba en la hipótesis original de `00-plan-trabajo.md`), respaldado por la ausencia de
  solapamiento entre "finanzas personales" y "gastos compartidos de evento" en el mercado
  revisado.
- **Frente a la app del banco (Bancolombia)**: aquí la investigación agrega un riesgo nuevo no
  contemplado en la hipótesis original — la competencia real más cercana y gratuita ya vive en
  el celular del usuario. La propuesta de valor de `03-propuesta-valor.md` debe responder
  explícitamente por qué vale la pena una app aparte de la del banco (probablemente: control de
  **varios** bancos/deudas/préstamos a la vez, más el módulo de moto y actividades, que el banco
  no ofrece).

## Cierre de esta fase

- **Decisiones tomadas**: se investigaron con búsqueda web real 12 productos (8 apps globales
  pedidas + 3 relevantes para Colombia + 1 app bancaria) más la categoría de apps de gastos
  compartidos, todos con fuente y fecha de consulta.
- **Supuestos pendientes de confirmar**: los precios reportados pueden cambiar; varias fuentes
  no publican precio exacto (marcado **[SIN DATO]**) y deben verificarse en el sitio oficial de
  cada app antes de usarse en un análisis de pricing propio.
- **Riesgos detectados**: (1) el competidor más directo y gratuito no es otra app de finanzas
  personales sino la app del banco del usuario — la propuesta de valor debe responderlo
  explícitamente; (2) el sync bancario automático que ofrecen varios competidores tiene fallas
  de conectividad reportadas — no prometer esa función en el MVP sin validar su costo/viabilidad
  real (ver `07-arquitectura-tecnologica.md`); (3) el módulo de actividades/finca familiar es un
  diferenciador solo si se ejecuta con calidad "tipo Splitwise" — un mal módulo genérico no
  sería mejor que usar Splitwise aparte.
- **Entregables generados**: este documento, con la tabla comparativa completa y la síntesis
  contrastada contra la hipótesis de valor original.
- **Próxima etapa recomendada**: avanzar `03-propuesta-valor.md`, que ahora sí puede escribirse
  con base en esta investigación y en `01-analisis-excel.md` (ambas dependencias ya están
  cerradas).
