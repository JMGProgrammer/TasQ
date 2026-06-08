# TasQ — Especificaciones Técnicas

> **Versión:** 1.1  
> **Última actualización:** 08/06/2026  
> **Stack:** Node.js / TypeScript · React + Next.js (App Router) · Neon (PostgreSQL) · Prisma ORM

---

## 1. Estructura del proyecto

```
tasq/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── page.tsx                # Página principal
│   │   ├── globals.css             # Estilos globales
│   │   └── api/
│   │       ├── lists/
│   │       │   ├── route.ts        # GET, POST
│   │       │   └── [id]/
│   │       │       └── route.ts    # PATCH, DELETE
│   │       └── tasks/
│   │           ├── route.ts        # GET, POST
│   │           └── [id]/
│   │               └── route.ts    # PATCH, DELETE
│   ├── components/
│   │   ├── ui/                     # Primitivas reutilizables (Button, Input, Modal, Toast)
│   │   ├── lists/
│   │   │   ├── ListSidebar.tsx     # Barra lateral con listas
│   │   │   ├── ListNav.tsx         # Navegación entre listas
│   │   │   └── ListForm.tsx        # Formulario crear/editar lista
│   │   └── tasks/
│   │       ├── TaskList.tsx        # Lista de tareas
│   │       ├── TaskItem.tsx        # Tarea individual
│   │       ├── TaskForm.tsx        # Formulario crear/editar tarea
│   │       └── TaskFilters.tsx     # Barra de filtros
│   ├── generated/
│   │   └── prisma/                 # Generado por Prisma (no committear)
│   ├── lib/
│   │   ├── prisma.ts               # Cliente Prisma singleton
│   │   ├── validators.ts           # Validación de inputs
│   │   └── utils.ts                # Utilidades generales
│   └── hooks/
│       ├── useLists.ts             # Hook para operaciones con listas
│       └── useTasks.ts             # Hook para operaciones con tareas
├── prisma/
│   ├── schema.prisma               # Schema de datos
│   └── migrations/                 # Migraciones generadas por Prisma
├── prisma.config.ts                # Configuración de Prisma CLI
├── tests/
│   └── unit/
│       ├── validators.test.ts      # Tests de validación
│       └── utils.test.ts           # Tests de utilidades
├── .env                            # Variables de entorno (Prisma)
├── .env.local                      # Variables de entorno (Next.js)
├── .env.example                    # Plantilla de variables de entorno
├── next.config.ts
├── postcss.config.mjs              # Config PostCSS para Tailwind v4
├── tsconfig.json
├── package.json
└── README.md
```

---

## 2. Stack tecnológico detallado

| Tecnología          | Versión    | Propósito                                |
|---------------------|------------|------------------------------------------|
| Node.js             | 22 LTS     | Entorno de ejecución                     |
| TypeScript          | 6.0.x      | Tipado estático                          |
| Next.js             | 16.2.x     | Framework web (App Router)               |
| React               | 19.x       | UI components                            |
| Prisma ORM          | 7.8.x      | ORM para base de datos                   |
| @prisma/adapter-pg  | 7.8.x      | Adapter de Prisma para PostgreSQL        |
| pg                  | 7.x        | Driver PostgreSQL                         |
| Neon (PostgreSQL)   | Serverless | Base de datos PostgreSQL serverless       |
| Vitest              | 4.1.x      | Testing unitario                         |
| Tailwind CSS        | 4.3.x      | Estilos utilitarios (PostCSS plugin)     |
| Lucide React        | 1.17.x     | Iconos                                   |

> **Nota:** Las versiones fueron verificadas en junio 2026. Se recomienda usar `npm install <pkg>@latest` al iniciar el proyecto para obtener los últimos parches.

---

## 3. Base de datos — Esquema (Prisma ORM)

### 3.1 Modelos

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model List {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  color     String   @default("#3B82F6")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  tasks     Task[]

  @@map("lists")
}

model Task {
  id          String    @id @default(uuid()) @db.Uuid
  listId      String    @map("list_id") @db.Uuid
  title       String
  description String    @default("")
  dueDate     DateTime? @map("due_date") @db.Date
  priority    String    @default("media")
  categories  String[]  @default([])
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  list        List      @relation(fields: [listId], references: [id], onDelete: Cascade)

  @@index([listId])
  @@index([priority])
  @@index([completed])
  @@map("tasks")
}
```

### 3.2 Cliente Prisma (adapter)

Prisma 7.x usa un patrón de adapters para conectarse a la base de datos. Se debe instalar el adapter correspondiente al driver:

```
npm install @prisma/adapter-pg pg
```

**`src/lib/prisma.ts`**
```typescript
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

> El patrón global singleton evita crear múltiples instancias durante hot reload en desarrollo.

### 3.3 Neon

**Neon** es un servicio PostgreSQL serverless. Se conecta vía connection string estándar:

```
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

No requiere configuración adicional ni drivers especiales. Prisma se conecta vía adapter `@prisma/adapter-pg` + `pg`.

---

## 4. API REST — Especificación de rutas

### 4.1 Lists

#### `GET /api/lists`
Obtiene todas las listas ordenadas por fecha de creación.

```
Response 200:
[
  { "id": "uuid", "name": "string", "color": "string", "createdAt": "iso", "updatedAt": "iso" }
]
```

#### `POST /api/lists`
Crea una nueva lista.

```
Body:
{ "name": "string (req)", "color": "string (opc, def: #3B82F6)" }

Response 201:
{ "id": "uuid", "name": "string", "color": "string", "createdAt": "iso", "updatedAt": "iso" }

Errors:
  400 — name vacío o inválido
```

#### `PATCH /api/lists/[id]`
Actualiza nombre o color de una lista.

```
Body:
{ "name"?: "string", "color"?: "string" }

Response 200:
{ "id": "uuid", "name": "string", "color": "string", "updatedAt": "iso" }

Errors:
  400 — body vacío o name inválido
  404 — lista no encontrada
```

#### `DELETE /api/lists/[id]`
Elimina una lista y todas sus tareas (ON DELETE CASCADE).

```
Response 200:
{ "message": "Lista eliminada" }

Errors:
  404 — lista no encontrada
```

### 4.2 Tasks

#### `GET /api/tasks`
Obtiene tareas filtradas.

```
Query params (todos opcionales):
  listId    — UUID de la lista
  priority  — "alta" | "media" | "baja"
  completed — "true" | "false"

Response 200:
[
  {
    "id": "uuid",
    "listId": "uuid",
    "title": "string",
    "description": "string",
    "dueDate": "iso | null",
    "priority": "string",
    "categories": "string[]",
    "completed": boolean,
    "createdAt": "iso",
    "updatedAt": "iso"
  }
]
```

#### `POST /api/tasks`
Crea una nueva tarea.

```
Body:
{
  "listId": "uuid (req)",
  "title": "string (req)",
  "description"?: "string",
  "dueDate"?: "iso date",
  "priority"?: "alta | media | baja",
  "categories"?: "string[]"
}

Response 201: { task object }

Errors:
  400 — listId o title inválidos
```

#### `PATCH /api/tasks/[id]`
Actualiza cualquier campo de una tarea. Para hacer toggle de `completed` se envía el nuevo valor booleano.

```
Body:
{
  "title"?: "string",
  "description"?: "string",
  "dueDate"?: "iso date | null",
  "priority"?: "alta | media | baja",
  "categories"?: "string[]",
  "completed"?: boolean
}

Response 200: { task object }

Errors:
  400 — body vacío o campo inválido
  404 — tarea no encontrada
```

#### `DELETE /api/tasks/[id]`
Elimina una tarea.

```
Response 200:
{ "message": "Tarea eliminada" }

Errors:
  404 — tarea no encontrada
```

---

## 5. Tailwind CSS v4 — Configuración

Tailwind CSS v4 usa configuración CSS-first (sin `tailwind.config.js`). En Next.js se integra vía PostCSS:

**postcss.config.mjs**
```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

**src/app/globals.css**
```css
@import "tailwindcss";

@theme {
  --color-primary: #3B82F6;
  --color-secondary: #6B7280;
  --color-success: #10B981;
  --color-danger: #EF4444;
  --color-warning: #F59E0B;
}
```

No se requiere archivo `tailwind.config.js`. Los valores del tema se definen con `@theme` en CSS.

### 5.1 Dark mode

Se implementa vía clase `dark` en `<html>`. Tailwind v4 usa `@custom-variant` para definir la variante:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Los colores se redefinen con un selector `.dark` plano (Tailwind v4 no permite `@theme` anidado dentro de variants):

```css
.dark {
  --color-primary: #60A5FA;
  --color-secondary: #E5E7EB;
  --color-success: #34D399;
  --color-danger: #F87171;
  --color-warning: #FBBF24;
}
```

La preferencia se persiste en `localStorage` (key `tasq-theme`) con fallback a `prefers-color-scheme`. Un `ThemeProvider` con Context aplica la clase `dark` al `<html>` y expone `useTheme()`.

---

## 6. Componentes — Árbol y responsabilidades

### 6.1 Árbol de componentes

```
<AppLayout>
├── <Sidebar>
│   ├── <ListForm />        ← Input para crear nueva lista
│   └── <ListNav>
│       └── <ListNavItem />  ← Cada lista (name + color dot)
│
└── <MainContent>
    ├── <TaskFilters />      ← Selects para listId, priority, completed
    ├── <TaskForm />         ← Modal/form para crear/editar tarea
    └── <TaskList>
        └── <TaskItem />     ← Checkbox + info + botones acción
```

### 6.2 Responsabilidades

| Componente     | Responsabilidad                                              |
|----------------|--------------------------------------------------------------|
| `AppLayout`    | Layout de 2 columnas (sidebar + main), responsive a 1 columna en mobile |
| `ListSidebar`  | Renderiza ListForm + ListNav                                 |
| `ListForm`     | Input inline para crear lista, muestra input al hacer clic en "+" |
| `ListNav`      | Lista de listas, resalta la activa, permite editar/eliminar |
| `TaskFilters`  | Selects para filtrar por prioridad, estado; muestra lista activa |
| `TaskForm`     | Modal con campos para crear o editar tarea                  |
| `TaskList`     | Renderiza lista de TaskItem, maneja orden y vacío           |
| `TaskItem`     | Checkbox toggle, datos, chips de categorías/prioridad, botones editar/eliminar |

---

## 7. Hooks — Lógica compartida

### `useLists`
```typescript
function useLists() => {
  lists: List[]
  activeList: List | null
  setActiveList: (list: List) => void
  createList: (name: string, color?: string) => Promise<void>
  updateList: (id: string, data: Partial<List>) => Promise<void>
  deleteList: (id: string) => Promise<void>
  isLoading: boolean
}
```

### `useTasks`
```typescript
function useTasks(filters?: TaskFilters) => {
  tasks: Task[]
  createTask: (data: CreateTaskInput) => Promise<void>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleComplete: (id: string, current: boolean) => Promise<void>
  isLoading: boolean
}
```

---

## 8. Validaciones (servidor y cliente)

| Campo       | Regla                                                    |
|-------------|----------------------------------------------------------|
| title       | string, 1 ≤ length ≤ 200                                 |
| listId      | UUID válido                                              |
| description | string, opcional, ≤ 2000 caracteres                      |
| dueDate     | ISO 8601 date o null, no puede ser > 10 años en el futuro|
| priority    | uno de: `alta`, `media`, `baja`                          |
| categories  | array de strings, max 10 items, cada item ≤ 50 chars     |
| color       | hex color válido (#RRGGBB)                               |
| name (lista)| string, 1 ≤ length ≤ 100                                 |

---

## 9. Testing

| Tipo          | Herramienta | Objetivo                                              |
|---------------|-------------|-------------------------------------------------------|
| Unitario      | Vitest      | Validators, utils, lógica de hooks                    |

### 9.1 Tests planificados

- `validators.test.ts` — Validar cada campo con casos válidos e inválidos
- `utils.test.ts` — Formateo de fechas, ordenamiento, agrupación

---

## 10. Variables de entorno

```env
# .env / .env.local
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

> `.env` es usado por Prisma CLI (vía `prisma.config.ts`). `.env.local` es usado por Next.js en runtime.

---

## 11. Comandos del proyecto

| Comando                  | Descripción                                   |
|--------------------------|-----------------------------------------------|
| `npm run dev`            | Inicia servidor de desarrollo                 |
| `npm run build`           | Compila para producción                       |
| `npm run lint`           | Ejecuta linter                                |
| `npm test`               | Ejecuta tests unitarios                       |
| `npm run test:watch`     | Tests en modo watch                           |
| `npx prisma generate`    | Genera el cliente Prisma                      |
| `npx prisma db push`     | Sincroniza schema con la base de datos        |
| `npx prisma migrate dev` | Crea y aplica una migración                   |
| `npx prisma studio`      | Abre el explorador visual de datos            |

---

## 12. Principios de diseño y convenciones

1. **Componentes Server por defecto** — Solo usar `'use client'` cuando sea necesario (interactividad, hooks).
2. **API Routes como BFF** — Las rutas API validan inputs y traducen errores de DB a respuestas HTTP legibles.
3. **Estado local con hooks** — No se introduce estado global (Context/Zustand) a menos que se necesite.
4. **CSS con Tailwind** — Estilos inline utilitarios, sin módulos CSS separados.
5. **Nomenclatura** — Archivos en kebab-case, componentes en PascalCase, hooks con prefijo `use`.
6. **Tests junto al código fuente** — Tests en carpeta `tests/unit/` espejando la estructura de `src/`.
