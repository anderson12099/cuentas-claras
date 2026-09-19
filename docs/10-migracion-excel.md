# Fase 10 — Migración desde Excel

**Depende de**: `01-analisis-excel.md` (no se puede diseñar el mapeo real sin conocer las
hojas reales).

## Proceso a diseñar

Carga del archivo, validación, vista previa, mapeo de columnas, detección de duplicados,
detección de fechas/montos inválidos, normalización de categorías, revisión de relaciones
entre hojas, confirmación del usuario, importación transaccional (todo o nada), reporte de
errores, posibilidad de cancelar, registro de la importación (`ImportBatch`/`ImportRow`),
exportación de respaldo antes de importar.

## Conversión de convenciones visuales a datos explícitos

El Excel comunica estado con colores, subrayados y comentarios — la aplicación nueva debe
reemplazar cada una de esas convenciones por un campo/estado explícito y consultable, nunca
tratar el color como fuente de verdad. Definir aquí, una vez se conozca el Excel real, la
tabla de equivalencia: convención visual → campo/estado en el modelo de datos.

Pendiente de completar tras `01-analisis-excel.md`: colores rojos, subrayados, comentarios,
celdas con fórmulas, totales manuales, y el mapeo específico de las pestañas de préstamos,
deudas, moto y ahorros.
