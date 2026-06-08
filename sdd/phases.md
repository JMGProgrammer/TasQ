# TasQ — Plan de Trabajo por Fases

> **Versión:** 1.1  
> **Última actualización:** 08/06/2026  
> **Objetivo:** Guía secuencial para la construcción completa de TasQ

---

## Fase 0 — Setup del proyecto

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 0.1 | Inicializar proyecto Next.js con `create-next-app` (TypeScript, App Router, Tailwind) | ✅ |
| 0.2 | Instalar dependencias: `lucide-react`, `vitest`, Prisma, `@prisma/client` | ✅ |
| 0.3 | Configurar `postcss.config.mjs` para Tailwind v4 (`@tailwindcss/postcss`) | ✅ |
| 0.4 | Configurar `globals.css` con `@import "tailwindcss"` y `@theme` con colores base | ✅ |
| 0.5 | Configurar `tsconfig.json` (paths, strict mode) | ✅ |
| 0.6 | Configurar variables de entorno (`.env`, `.env.local`, `.env.example`) con `DATABASE_URL` | ✅ |
| 0.7 | Crear `prisma/schema.prisma` con modelos `List` y `Task` + generar cliente | ✅ |
| 0.8 | Crear `src/lib/prisma.ts` (singleton client) | ✅ |
| 0.9 | Configurar `.gitignore` (`.env`, `src/generated/`) | ✅ |
| 0.10 | Crear estructura de directorios (`src/app/api`, `src/components`, `src/lib`, `src/hooks`, `tests`) | ✅ |

**Estado:** Completo ✅

---

## Fase 1 — Base de datos y tipos

| Tarea | Descripción | Estimación |
|-------|-------------|------------|
| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 1.1 | Instalar `@prisma/adapter-pg` y `pg` para el adapter de Prisma | ✅ |
| 1.2 | Crear `src/lib/prisma.ts` con singleton + adapter connection | ✅ |
| 1.3 | Crear migración inicial con `npx prisma migrate dev --name init` | ✅ |
| 1.4 | Generar tipos TypeScript (`src/lib/types.ts`) | ✅ |
| 1.5 | Conectar Neon (crear proyecto, obtener `DATABASE_URL`, ejecutar migrate) | ✅ |

**Estado:** Fase 1 casi completa — falta solo generar los tipos de TypeScript

---

## Fase 2 — API Routes (Backend)

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 2.1 | Implementar `GET /api/lists` + `POST /api/lists` | ✅ |
| 2.2 | Implementar `PATCH /api/lists/[id]` + `DELETE /api/lists/[id]` | ✅ |
| 2.3 | Implementar `GET /api/tasks` con filtros (query params) | ✅ |
| 2.4 | Implementar `POST /api/tasks` | ✅ |
| 2.5 | Implementar `PATCH /api/tasks/[id]` + `DELETE /api/tasks/[id]` | ✅ |
| 2.6 | Implementar validación de inputs en cada ruta (`src/lib/validators.ts`) | ✅ |
| 2.7 | Tests unitarios de validadores (`tests/unit/validators.test.ts`) | ✅ |

**Entregable:** API REST funcional

---

## Fase 3 — Hooks y lógica de cliente

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 3.1 | Implementar `useLists` hook (CRUD listas) | ✅ |
| 3.2 | Implementar `useTasks` hook (CRUD tareas + toggle + filtros) | ✅ |
| 3.3 | Implementar utilidades en `src/lib/utils.ts` (formateo fechas, ordenamiento) | ✅ |
| 3.4 | Tests unitarios de hooks y utils (`tests/unit/utils.test.ts`) | ✅ |

**Entregable:** Hooks listos para conectar UI

---

## Fase 4 — UI: Componentes base (primitivas)

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 4.1 | Crear `Button`, `Input`, `Select`, `Modal`, `Toast` en `src/components/ui/` | ✅ |
| 4.2 | Crear layout principal `AppLayout` (sidebar + main responsive) | ✅ |
| 4.3 | Implementar `ListSidebar` + `ListNav` + `ListNavItem` | ✅ |
| 4.4 | Implementar `ListForm` (crear lista inline) | ✅ |
| 4.5 | Integrar hooks + componentes en `page.tsx` | ✅ |

**Entregable:** Sidebar funcional con navegación de listas

---

## Fase 5 — UI: Gestión de tareas

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 5.1 | Implementar `TaskFilters` (selects para prioridad, estado) | ✅ |
| 5.2 | Implementar `TaskForm` (modal crear/editar tarea) | ✅ |
| 5.3 | Implementar `TaskList` (lista de tareas con estado vacío) | ✅ |
| 5.4 | Implementar `TaskItem` (checkbox, datos, acciones) | ✅ |
| 5.5 | Integrar todo en `page.tsx` | ✅ |
| 5.6 | Añadir confirmación en eliminaciones (`ConfirmModal`) | ✅ |

**Entregable:** CRUD completo de tareas funcional en UI

---

## Fase 6 — Testing y pulido

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 6.1 | Tests de integración para API routes (mocked Prisma) | ✅ |
| 6.2 | Probar flujo completo | ✅ |
| 6.3 | Verificar responsive (mobile, tablet, desktop) | Pendiente (visual) |
| 6.4 | Añadir estados de carga (skeleton loaders) | ✅ |
| 6.5 | Añadir feedback visual (toast de éxito/error) | ✅ |
| 6.6 | Revisar y corregir errores de linting y tipos | ✅ |
| 6.7 | Temas claro/oscuro con selector en Settings | ✅ |

**Entregable:** App estable y testeada

---

## Fase 7 — Despliegue (futuro)

| Tarea | Descripción | Prioridad |
|-------|-------------|-----------|
| 7.1 | Configurar proyecto en Vercel (conectar repo de GitHub) | Baja |
| 7.2 | Configurar variables de entorno (`DATABASE_URL`) en Vercel | Baja |
| 7.3 | Ejecutar `npx prisma migrate deploy` en build | Baja |
| 7.4 | Hacer deploy y verificar funcionalidad | Baja |

**Entregable:** App desplegada en producción

---

## Resumen de estado

| Fase | Estado |
|------|--------|
| Fase 0 — Setup | ✅ Completa |
| Fase 1 — Base de datos | ✅ Completa |
| Fase 2 — API | ✅ Completa |
| Fase 3 — Hooks | ✅ Completa |
| Fase 4 — UI base | ✅ Completa |
| Fase 5 — UI tareas | ✅ Completa |
| Fase 6 — Testing y pulido | Pendiente |
| Fase 7 — Despliegue | Pendiente (futuro) |
