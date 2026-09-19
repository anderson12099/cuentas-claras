# Fase 5 — Requisitos no funcionales

> Depende de `05-requisitos-funcionales.md` (Fase 4, cerrada). Cada objetivo queda expresado de
> forma medible (número, umbral o condición verificable) — se evitan frases como "debe ser
> rápido" sin un valor concreto. Los objetivos numéricos son **[RECOMENDACIÓN]** técnica propia
> (referencia razonable para una app de un solo desarrollador con Supabase u equivalente), no
> un compromiso contractual — se ajustan una vez se mida contra la implementación real.

## Seguridad

- **Cifrado en tránsito**: HTTPS/TLS 1.2+ obligatorio en toda comunicación cliente-servidor;
  sin excepciones, ni en desarrollo expuesto a internet — **MVP**.
- **Cifrado en reposo**: datos sensibles (contraseñas, tokens) nunca en texto plano; delegado a
  las garantías del proveedor de base de datos (p. ej. Supabase/Postgres administrado) más hash
  de contraseñas con algoritmo moderno (bcrypt/argon2, nunca MD5/SHA1 planos) — **MVP**.
- **Gestión de sesiones**: tokens de sesión con expiración (recomendado: 7 días de sesión
  persistente en el navegador, renovable; revocable manualmente) — **MVP**. Cierre remoto de
  sesiones y lista de dispositivos activos — **Fase 2**.
- **Aislamiento entre titulares (requisito nuevo, 2026-09-13)**: ninguna consulta a la base de
  datos puede devolver, editar o eliminar datos de un titular distinto al que el usuario tiene
  activo/autorizado en ese momento — **medible como**: 0 incidentes de fuga cruzada entre
  titulares en pruebas de seguridad (`14-plan-pruebas.md`), aplicando row-level security (o
  equivalente) a nivel de base de datos, no solo filtrado en la aplicación — **MVP**. Este es el
  control más crítico de todo el documento: una app de finanzas que mezcla datos de dos
  titulares por error es, en la práctica, un producto no confiable.
- **Control de permisos**: un único login controla todos sus titulares; no hay roles/permisos
  diferenciados por titular en el MVP (eso implicaría multiusuario real, Fase 4) — **MVP**
  (modelo simple: dueño único, acceso total a todos sus titulares).
- **Validación de entradas / inyección SQL, XSS, CSRF**: validación server-side de todo input
  (tipos, rangos, longitud); uso de queries parametrizadas u ORM que las prevenga por diseño;
  cabeceras de seguridad estándar (CSP, X-Frame-Options) — **MVP**.
- **Rate limiting y fuerza bruta**: límite razonable en intentos de login (recomendado: 5
  intentos fallidos → bloqueo temporal de 15 minutos) — **Fase 2** (aceptable para MVP de un
  solo usuario real, pero no debe quedar más allá de esa fase si la app se expone en internet).
- **Registro de eventos de seguridad**: login fallido, cambio de contraseña, exportación de
  datos — registrados con fecha/hora — **Fase 2**.
- **Backups**: backup diario automático de la base de datos, retención mínima de 30 días —
  **MVP** si la plataforma elegida lo da de fábrica (Supabase lo ofrece en sus planes; se
  confirma en `07-arquitectura-tecnologica.md`), si no, **Fase 2**.
- **Minimización de datos**: no pedir datos que no se necesitan (ej. documento de identidad de
  participantes de actividades, ver `05-requisitos-funcionales.md`) — **MVP**, ya aplicado como
  principio de diseño.
- **Exportación/eliminación de datos del usuario**: el usuario puede exportar todos sus datos
  (CSV, ver módulo de reportes) — **MVP** (básico) / **Fase 2** (completo). Eliminación total de
  la cuenta y sus datos a solicitud — **Fase 2**.
- **Prevención de exposición de secretos**: variables de entorno para credenciales, nunca en
  código fuente ni en el repositorio; rotación de credenciales si se sospecha compromiso —
  **MVP** como práctica de desarrollo, no como feature de producto.
- **Auditoría de cambios financieros**: ya cubierta como requisito funcional (`AuditLog`, regla
  17 de `CLAUDE.md`) — **MVP**.

> **No se afirma cumplimiento legal específico sin analizar jurisdicción** (regla 12 de
> `CLAUDE.md`). Para Colombia como mercado principal, quedan como **pendientes de revisión**
> (no como hechos resueltos): la Ley de Protección de Datos Personales (Ley 1581 de 2012) y su
> aplicabilidad a una app que almacena datos financieros y, ahora, datos de una segunda persona
> (Alejandra) que no es la titular del login — esto último puede tener implicaciones adicionales
> de tratamiento de datos de terceros que conviene revisar con asesoría legal real antes de
> lanzar la app fuera de uso estrictamente personal. Esto no es asesoría legal, es una señal de
> qué revisar.

## Rendimiento

- **Tiempo de carga inicial** (primera carga, conexión 4G típica): objetivo ≤ 3 segundos —
  **MVP**.
- **Tiempo de apertura del formulario de "agregar movimiento"**: ≤ 500 ms desde que se toca el
  botón (es la interacción más importante del producto, regla del proyecto) — **MVP**.
- **Tiempo de guardado de un movimiento**: confirmación visible en ≤ 1 segundo en condiciones
  normales de red — **MVP**.
- **Tiempo de actualización del dashboard tras guardar** (mismo dispositivo, ver
  `00-plan-trabajo.md` §3.4): ≤ 1 segundo, sin recargar la página — **MVP**.
- **Paginación de consultas**: listas de movimientos paginadas (recomendado: 50 por página),
  nunca cargar el historial completo de una vez — **MVP**.
- **Índices de base de datos**: sobre `titular_id`, `fecha`, y claves foráneas de uso frecuente
  (categoría, cuenta) — **MVP**, crítico precisamente porque cada consulta ahora filtra también
  por titular.
- **Comportamiento en gama media**: la app debe ser usable (sin bloqueos ni esperas > 3s) en un
  celular Android gama media de los últimos 3 años — **MVP**.
- **Tolerancia a conexión inestable**: reintento automático de una operación fallida por corte
  de red, sin duplicar el movimiento (idempotencia) — **Fase 2**; en el MVP, como mínimo, un
  error de red debe mostrarse claramente en vez de fallar en silencio — **MVP**.
- **Estrategia de caché**: caché de solo lectura para catálogos poco cambiantes (categorías,
  cuentas) — **Fase 2**.
- **Procesamiento de reportes**: un reporte de un período de 1 año no debe tardar más de 3
  segundos en generarse para un solo titular — **Fase 2** (cuando el módulo de reportes entre en
  alcance).
- **Límites de archivos/consultas**: exportación CSV limitada a un máximo razonable por
  solicitud (recomendado: 50,000 filas), con mensaje claro si se excede — **Fase 2**.

## Mantenibilidad

- Arquitectura modular con separación clara de responsabilidades (capa de datos, lógica de
  negocio, presentación) — **MVP**.
- Tipado estático en el código (TypeScript recomendado si el frontend es Next.js/React, a
  confirmar en `07-arquitectura-tecnologica.md`) — **MVP**.
- Documentación técnica mínima (cómo levantar el proyecto, variables de entorno necesarias) —
  **MVP**.
- Pruebas automatizadas: al menos las funciones críticas de cálculo (saldo, amortización de la
  moto, recálculo de abonos a capital) cubiertas con pruebas unitarias — **MVP**, dado el riesgo
  real de error en cálculos financieros; cobertura más amplia (integración, E2E) — **Fase 2**
  (ver `14-plan-pruebas.md`).
- Migraciones de base de datos versionadas (nunca cambios manuales directos en producción) —
  **MVP**.
- Versionamiento de API — **Fase 2** (el MVP es de un solo cliente propio, no hay consumidores
  externos todavía que obliguen a versionar desde el día uno).
- Logs estructurados y manejo centralizado de errores — **MVP** en su forma básica (logs con
  nivel y contexto mínimo), más completo en **Fase 2**.
- CI/CD (build y despliegue automatizado al hacer push) — **MVP**, razonable con el tiempo
  urgente pedido por el usuario: automatizar el despliegue ahorra tiempo manual repetido.
- Linting/formateo automático — **MVP** (bajo costo, alto valor para mantenibilidad).
- ADRs (Architecture Decision Records) para decisiones arquitectónicas importantes (p. ej. la
  elección de Supabase) — **MVP**, ver `07-arquitectura-tecnologica.md`.

## Disponibilidad y recuperación

- **RPO (Recovery Point Objective)**: máxima pérdida de datos aceptable ante un fallo — objetivo
  ≤ 24 horas (un backup diario) — **MVP**, condicionado a que la plataforma elegida lo soporte
  de fábrica.
- **RTO (Recovery Time Objective)**: tiempo máximo para restaurar el servicio ante un fallo —
  objetivo ≤ 4 horas para un proyecto de un solo usuario operado por su dueño — **Fase 2**
  (razonable no invertir en esto de forma sofisticada mientras el usuario es el único afectado
  por una caída).
- **Monitoreo y alertas**: alerta básica (correo o similar) si la app cae o hay errores
  recurrentes — **Fase 2**.
- **Estado degradado**: si un módulo falla (p. ej. reportes), el resto de la app (registrar
  gasto, ver saldo) debe seguir funcionando — **MVP**, por diseño de módulos independientes.
- **Reintentos e idempotencia**: toda operación que pueda reintentarse (registrar movimiento,
  registrar abono) debe soportar un reintento sin crear un duplicado — **Fase 2** para
  reintentos automáticos; en el MVP, como mínimo, la UI debe evitar el doble-toque accidental
  (deshabilitar el botón de guardar mientras se procesa) — **MVP**.
- **Manejo de operaciones duplicadas**: detectar (no solo evitar) un movimiento duplicado por
  monto+fecha+cuenta idénticos y advertir al usuario antes de guardar — **Fase 2**.

## Cierre de esta fase

- **Decisiones tomadas**: se definieron objetivos medibles para seguridad, rendimiento,
  mantenibilidad y disponibilidad, cada uno tageado con su fase de entrada; se agregó el
  **aislamiento entre titulares** como el requisito de seguridad más crítico del documento, con
  una condición de aceptación verificable (0 incidentes de fuga cruzada en pruebas).
- **Supuestos pendientes de confirmar**: los objetivos numéricos (tiempos, RPO/RTO, retención de
  backups) son recomendaciones técnicas propias, no pedidos explícitos del usuario — se ajustan
  si el usuario tiene un objetivo distinto en mente.
- **Riesgos detectados**: (1) el tratamiento de datos financieros de una segunda persona
  (Alejandra) que no controla el login puede tener implicaciones de protección de datos de
  terceros no exploradas aún — señalado como pendiente de revisión, no resuelto; (2) construir
  el aislamiento entre titulares solo a nivel de aplicación (sin reforzarlo a nivel de base de
  datos) es un riesgo real de fuga de datos si se olvida un filtro en una sola consulta — se
  recomienda row-level security en la base de datos como control primario, no secundario.
- **Entregables generados**: este documento.
- **Próxima etapa recomendada**: `07-arquitectura-tecnologica.md` (Fase 6-7) — comparar Supabase
  contra 1-2 alternativas, ya con el requisito de aislamiento entre titulares (row-level
  security) y los objetivos de rendimiento de este documento como criterios explícitos de la
  comparación.
