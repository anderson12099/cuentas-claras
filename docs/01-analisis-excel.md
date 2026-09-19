# Fase 1a — Análisis del Excel

**Archivo analizado**: `docs/Deuda_Aleja.xlsx` (108 KB, exportado desde Google Sheets —
contiene metadatos `GoogleSheetsCustomDataVersion2`).

> Todo lo marcado como **[HECHO]** proviene de inspeccionar directamente el archivo (extracción
> del XML interno del `.xlsx`, sin librerías externas). Todo lo marcado como **[INTERPRETACIÓN]**
> es una lectura razonable de esos hechos, no un dato literal del archivo. Nada aquí fue
> inventado sin verificarlo contra el archivo real.

## 1. Hojas encontradas [HECHO]

El libro tiene **12 hojas**, todas visibles, sin fórmulas activas prácticamente en ninguna
(solo 2 fórmulas en todo el libro, una en "gasolina moto aleja" y otra en "FINCA FAUNER" —
el resto de valores están escritos a mano, lo cual confirma directamente el problema que
describiste de "totalizar valores manualmente").

| # | Nombre de la hoja | Filas con datos | Propósito aparente [INTERPRETACIÓN] |
|---|---|---:|---|
| 1 | Hoja1 | 94 | Deudas que terceros le deben pagar a Alejandra ("DEUDAS ALEJANDRA" / "PAGA DIARIOS") |
| 2 | Hoja2 | 19 | Presupuesto/obligaciones mensuales de Anderson, con una columna por mes (Julio–Diciembre) |
| 3 | Cuentas Anderson 2026 | 618 | **Libro diario principal**: registro cronológico de gastos de Anderson, fecha a fecha, más un mini-resumen de cuentas/saldos (Confiar, FNA, Cesantías, Préstamo) en las primeras filas |
| 4 | Deuda Moto | 63 | Tabla de amortización mes a mes del crédito de la moto (saldo, interés, capital, seguros) + una sub-tabla de préstamos asociados (SOAT, pase, GPS) |
| 5 | Cuentas Alejandra 2024 | 329 | Libro diario de gastos/pagos de Alejandra durante 2024, estructurado en bloques repetidos de 3 columnas (parecen ser 3 "cortes" o quincenas por mes) |
| 6 | gasolina moto aleja | 53 | Seguimiento de gasto de gasolina/servicios de la moto de Alejandra, con una tabla lateral de "VALOR / MES" |
| 7 | MARRANADA | 53 | Control de una recolecta/evento social ("marranada" en Sopetrán): quién pagó, compra de insumos, abonos y saldos de un cerdo (rifa/venta) |
| 8 | FINCA FAUNER | 46 | Control de pagos de un paseo/evento a una finca: quién pagó, compra de insumos, **y una lista de asistentes con nombre completo, tipo de documento y número de documento** |
| 9 | Deudas Bancos | 13 | Deudas con bancos (Bogotá, Falabella, Rapicrédito, Davivienda): saldo, saldo con intereses, pagos |
| 10 | Deuda casa | 46 | Seguimiento del préstamo bancario de una casa (valor de venta, efectivo, préstamo banco, cuota mensual proyectada hasta 2026) |
| 11 | Pagos Cuota Casa | 23 | Calendario de cuotas del préstamo de la casa (valor cuota, fecha, tasa, abonos a capital) — complementa la hoja anterior |
| 12 | Deuda | 28 | Dos tablas distintas en la misma hoja: (a) un préstamo entregado por el usuario con cuotas mensuales abril–octubre, y (b) un "CUADERNO DE PÉRDIDAS NITA" con seguimiento quincenal de pagos hasta 2026 |

## 2. Encabezados detectados por hoja [HECHO]

- **Hoja1**: `NOMBRE, TELEFONO, VALOR PRESTAMO, FECHA DE PAGO, CUOTA, NUMERO DE CUOTAS, Fecha de pago, pagar, Fecha de cancelación, pago_cuota, Fecha`.
- **Hoja2**: `FECHA DE PAGO, JULIO, AGOSTO, SEPTIEMBRE, OCTUBRE, NOVIEMBRE, DICIEMBRE` (una columna por mes, filas = conceptos fijos como ARRIENDO, MERCADO, DIEZMO, SUFI, LOTE, TARJETA BANCO POPULAR...).
- **Cuentas Anderson 2026**: `FECHA, MES, DESCRIPCIÓN, CANTIDAD` + columnas sueltas `Entidad / Ahorro` para el resumen de cuentas.
- **Deuda Moto**: `Mes, Saldo Inicial, Interés Mensual, Pago a Capital, Amortización, Saldo Final, seguro de vida, seguro de moto todo riesgo, PRESTAMOS, OBSERVACIONES` (columnas de préstamos duplicadas para dos préstamos distintos en paralelo).
- **Cuentas Alejandra 2024**: sin fila de encabezado única — se repite el patrón `concepto / valor / fecha` tres veces por fila (aparentan ser 3 registros del mismo período en columnas distintas).
- **gasolina moto aleja**: `FECHA DE PAGO, FECHA LIMITE DE PAGO, VALOR FACTURA` + columnas sueltas de comparación (`Igual`, `Aumentó`) y una tabla lateral `VALOR / MES`.
- **MARRANADA**: `NOMBRES, PAGO, CARRO, MOTO, TARIFA, GASTOS PEAJES-GASOLINA` + tabla de insumos (`NOMBRE, CANTIDAD, PRECIO` repetida dos veces) + columnas de cierre (`TOTAL, GASTO LEGUMBRE, PEAJES-GASOLINA, MARRANO, ABONO MARRANO`).
- **FINCA FAUNER**: similar a MARRANADA + columnas `Puesto, Nombre, Tipo Documento, Número` (identificación de asistentes).
- **Deudas Bancos**: `Banco Deuda, Saldo Inicial, Saldo con Intereses, Pagos realizados, Fecha, Tipo, Valor a pagar, Fecha Préstamo y pago deuda, Intereses`.
- **Deuda casa**: `MES, VALOR_VENTA_CASA, EFECTIVO, PRESTAMO BANCO, FECHA_PAGOS, AÑO`.
- **Pagos Cuota Casa**: `VALOR CUOTA, FECHA PAGO, TASA PRESTAMO, ABONOS A REDUCCIÓN DE PLAZO, FECHA ABONO A CAPITAL, OBSERVACIONES`.
- **Deuda**: `FECHA, VALOR PRESTADO, PAGO, MES` (tabla 1) y `N°, Fecha, Pago, Saldo restante, Deuda total, Pago quincenal, Fecha inicio` (tabla 2, "Cuaderno de pérdidas Nita").

## 3. Fechas, monedas y formatos numéricos [HECHO]

- **Fechas**: guardadas como número de serie de Excel/Sheets (época 1899-12-30), p. ej. `45349` = `2024-02-27`, `46102` = `2026-03-21`. Confirmado convirtiendo una muestra de +40 valores. Algunas hojas (Deuda casa, Pagos Cuota Casa, "Cuaderno de pérdidas Nita") tienen fechas **proyectadas a futuro** (hasta 2026), es decir, no son solo historial: también funcionan como calendario de pagos pendientes.
- **Montos**: casi todos como número plano (`380000.0`, `1260000.0`), sin símbolo de moneda embebido en el valor — el formato `$` que viste en pantalla vive en `styles.xml`, no en el dato. **Una excepción real**: la celda `D2` de "Cuentas Anderson 2026" contiene el texto literal `"$ 1.370.000,00"` como string, no como número — si se migra tal cual, rompe cualquier suma.
- **Inconsistencia de formato de miles/decimales**: en la hoja "Deuda" (tabla "Cuaderno de pérdidas Nita") los montos están como texto con formato mixto: `150.000.00`, `2,000,000.00`, `1,850,000.00` — mezclando el separador de miles europeo/colombiano (`.`) con el americano (`,`) en la misma columna. Esto **no son números utilizables directamente**, son texto.
- **Columnas numéricas con texto libre mezclado**: en Hoja2, fila "OTROS", varias columnas de mes contienen frases completas en vez de un monto (`"60.000 gasolina, 150.000 paseo"`, `"100.000 pollo, 250.000 pasajes buses 50.000 billetera y 90,000 bolso samuel"`). Es la evidencia más directa de que el Excel actual no separa "monto" de "descripción" cuando el usuario registra varios gastos pequeños de una vez.

## 4. Celdas vacías y estructura irregular [HECHO]

Ninguna hoja tiene una tabla estrictamente rectangular. El significado de una columna cambia
fila a fila según qué campos se llenaron ese día. Ejemplos:

- Hoja1, fila 10 usa las columnas A–I; la fila 14 (misma hoja) solo usa A, B y F — y en la fila
  14 la columna B (que en otras filas es "TELEFONO") contiene un monto (`60000`), no un teléfono.
- "Cuentas Alejandra 2024" repite el bloque `concepto/valor/fecha` en las columnas B–D, G–I y
  K–M dentro de la misma fila — es decir, tres periodos de pago se anotan lado a lado en vez de
  uno debajo del otro.

Esto confirma, con evidencia directa del archivo, la frustración que describiste ("insertar un
gasto requiere demasiados pasos" / errores manuales): la falta de una estructura fija obliga a
"acomodar" cada registro a mano.

## 5. Duplicados [HECHO]

En Hoja1, el concepto **"Cooperativa"** aparece 4 veces con el mismo monto (`250000`) y la
misma cuota, solo cambiando la fecha (filas 16–19) — es un pago recurrente registrado
manualmente cada vez en lugar de modelarse como una obligación recurrente con su calendario
de vencimientos (justo el problema que describe el módulo de "gastos recurrentes").

## 6. Información comunicada por color/formato [HECHO parcial]

`styles.xml` define **13 rellenos de color sólido** distintos, incluyendo rojo (`FFFF0000`),
verde (`FF00B050`), amarillo (`FFFF00`) y dos tonos de azul — consistente con lo que describiste
("los préstamos y pendientes se marcan manualmente, incluso con colores"). El archivo define
**466 estilos de celda** en total, lo cual hace inviable mapear a mano, celda por celda, qué
color corresponde a qué estado sin una herramienta dedicada; **queda como tarea pendiente**
antes de `10-migracion-excel.md` (no bloquea el resto del análisis).

Solo se encontró **1 comentario** en todo el libro (en la celda `F10` de alguna hoja), y su
texto quedó vacío tras la firma del autor — es decir, los comentarios prácticamente no se usan
como mecanismo real de anotación hoy.

## 7. Relaciones entre hojas [INTERPRETACIÓN]

- **Hoja2** (obligaciones mensuales fijas de Anderson) parece ser la plantilla/presupuesto
  cuyos pagos reales luego se registran, uno por uno, en **"Cuentas Anderson 2026"** (aparecen
  los mismos conceptos: ARRIENDO, MERCADO, DIEZMO, SUFI, TARJETA BANCO POPULAR). No hay ninguna
  clave o referencia explícita que las una — la relación es solo por coincidencia de nombres de
  concepto.
- **"Deuda casa"** y **"Pagos Cuota Casa"** son complementarias: la primera resume el préstamo
  y las fechas de pago por mes; la segunda detalla cada cuota con su tasa y sus abonos a
  capital. Tampoco hay una clave común, solo coincidencia de montos y fechas.
- **"Deuda Moto"** incluye, dentro de sus propias columnas, tres micro-préstamos aparte
  (SOAT, "pase"/trámite, GPS) que no son parte del crédito de la moto en sí, sino deudas
  adicionales que se pagan junto con la cuota — deberían modelarse como registros de `Loan`
  separados, no como columnas extra de `MotorcyclePayment`.
- **"gasolina moto aleja"** no tiene ninguna referencia cruzada hacia "Deuda Moto": es un
  tracker de combustible independiente para (aparentemente) una moto distinta, la de
  Alejandra, no la moto financiada del crédito.
- **Hoja1** y **"Cuentas Alejandra 2024"** parecen ser vistas del mismo universo (finanzas de
  Alejandra) pero en dos formatos distintos y sin relación explícita entre filas.

## 8. Errores de consistencia detectados [HECHO]

1. Columnas que cambian de significado según la fila (ver §4).
2. Mezcla de tipos de dato en la misma columna: números, texto con formato de miles
   inconsistente, y frases descriptivas completas (ver §3).
3. Un valor monetario guardado como texto formateado en vez de número (`D2` en "Cuentas
   Anderson 2026").
4. Fechas pasadas y fechas futuras (calendario de pagos) mezcladas en la misma columna sin un
   campo de "estado" que las distinga (pagado vs. programado).

## 9. Hallazgo importante: datos de identificación de terceros [HECHO — requiere decisión]

La hoja **"FINCA FAUNER"** contiene una lista de personas con **nombre completo, tipo de
documento (CC/TI/RC) y número de documento**. Esto es información personal de terceros (no
del usuario), sin relación directa con el control de gastos/deudas/ahorros personales que es
el objetivo de la aplicación. **Antes de migrar esta hoja** (o "MARRANADA", que es del mismo
tipo: control de costos de un evento social compartido) hace falta una decisión explícita de
alcance — ver pregunta agrupada en `00-plan-trabajo.md`.

## 10. Qué información debe conservarse en la aplicación nueva [INTERPRETACIÓN]

Con alta confianza, deben migrarse como datos financieros reales del usuario:

- Las deudas y préstamos entre el usuario y terceros (Hoja1, "Cuentas Alejandra 2024", hoja
  "Deuda", "Deudas Bancos").
- El crédito e historial de pagos de la moto, separando el crédito principal de los
  micro-préstamos asociados ("Deuda Moto").
- El crédito de la casa y su calendario de cuotas ("Deuda casa" + "Pagos Cuota Casa").
- El libro diario de gastos ("Cuentas Anderson 2026") y el presupuesto mensual fijo (Hoja2),
  fusionándolos como "gasto recurrente" vs. "movimiento real" en el nuevo modelo.
- El resumen de cuentas/saldos embebido en las primeras filas de "Cuentas Anderson 2026"
  (Confiar, FNA, Cesantías, Préstamo) — es el germen del módulo `Account`.

**Resuelto con el usuario (2026-09-13)**:

- "Cuentas Alejandra 2024" y "gasolina moto aleja" **sí entran** al alcance — se migran como
  `Transaction` normales (gasolina asociada opcionalmente a la moto).
- "MARRANADA" y "FINCA FAUNER" **no se migran tal cual**. En su lugar dan origen a un módulo
  nuevo y genérico ("actividades/finca familiar", ver `05-requisitos-funcionales.md`) que
  resuelve el mismo caso de uso (participantes, aportes, gastos, saldo) sin exigir documentos
  de identidad de terceros por defecto — evita el riesgo de privacidad detectado en §9.

## 11. Propuesta preliminar de migración a base de datos [RECOMENDACIÓN — se detalla en `08-modelo-datos.md` y `10-migracion-excel.md`]

| Hoja Excel | Entidad(es) destino propuestas |
|---|---|
| Hoja1 | `Loan` (préstamos otorgados por el usuario) + `LoanPayment` |
| Hoja2 | `RecurringExpense` (plantilla de obligaciones fijas) |
| Cuentas Anderson 2026 | `Transaction` (movimientos) + `Account` (resumen de cuentas embebido) |
| Deuda Moto | `Motorcycle` + `MotorcyclePayment` (crédito) + `Loan`/`LoanPayment` (SOAT, pase, GPS) |
| Cuentas Alejandra 2024 | `Transaction` (si Alejandra es co-titular/usuaria futura) o `Tag`/`Account` separado si es solo seguimiento que Anderson lleva por ella |
| gasolina moto aleja | `Transaction` con categoría "combustible", asociado opcionalmente a `Motorcycle` |
| MARRANADA / FINCA FAUNER | No se migran los datos históricos tal cual (harían falta anonimizar los documentos de identidad); sirven como **caso de uso de referencia** para diseñar `Activity`/`ActivityParticipant`/`ActivityContribution`/`ActivityExpense` (Fase 2 del roadmap) |
| Deudas Bancos | `Debt` + pagos asociados |
| Deuda casa | `Debt` (crédito hipotecario/de vivienda) |
| Pagos Cuota Casa | `DebtPayment` del crédito anterior |
| Deuda (tabla 1) | `Loan` + `LoanPayment` |
| Deuda (tabla 2, "Cuaderno Nita") | `Loan` + `LoanPayment` (persona "Nita"), normalizando los montos de texto a número antes de importar |

## Cierre de esta fase

- **Decisiones tomadas**: el análisis se hizo sobre el archivo real, sin inventar estructura;
  se identificaron 12 hojas y su propósito aparente; se confirmó con evidencia directa que el
  archivo no usa fórmulas (refuerza el dolor de "totalizar a mano").
- **Supuestos pendientes de confirmar**: si "Cuentas Alejandra 2024", "gasolina moto aleja",
  "MARRANADA" y "FINCA FAUNER" entran o no al alcance de la aplicación (ver pregunta agrupada
  en `00-plan-trabajo.md` §3, punto nuevo añadido).
- **Riesgos detectados**: (1) migrar montos que hoy son texto con formato inconsistente sin
  normalizarlos primero generaría datos corruptos; (2) migrar "FINCA FAUNER" tal cual expondría
  documentos de identidad de terceros dentro de una app de finanzas personales — riesgo de
  privacidad que debe resolverse por diseño (excluir o anonimizar), no en el código de
  importación.
- **Entregables generados**: este documento.
- **Próxima etapa recomendada**: confirmar alcance de las hojas dudosas (pregunta agrupada) y
  avanzar en paralelo con `02-investigacion-mercado.md`, que no depende de esta decisión.
