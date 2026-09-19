# Fase 11 — Tiempo real y sincronización

## Qué significa "tiempo real" en este producto (a precisar aquí, sin sobreprometer)

Distinguir explícitamente entre: actualización inmediata en la interfaz (mismo dispositivo,
misma sesión), sincronización con el backend, actualización visible en otro dispositivo,
notificaciones push, procesos en segundo plano, actualización eventual ("eventual
consistency"), y funcionamiento offline. La arquitectura elegida en
`07-arquitectura-tecnologica.md` determina cuál de estos niveles es realista prometer — no al
revés.

## Estrategia a definir

Evitar conflictos, evitar movimientos duplicados, reintentar operaciones fallidas, mantener
idempotencia (especialmente en el registro de movimientos e importación), resolver cambios
simultáneos entre dispositivos, mostrar estado de sincronización al usuario, recuperarse de
una conexión interrumpida sin perder ni duplicar datos.
