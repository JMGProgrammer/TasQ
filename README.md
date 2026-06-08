# TasQ

> Gestor de tareas sencillo, moderno y minimalista.

**TasQ** es una aplicación web para la gestión de tareas personales con soporte de múltiples listas, prioridades, categorías y filtros. Construida con Next.js, Neon y Prisma.

---

## Stack

| Capa          | Tecnología                       |
|---------------|----------------------------------|
| Frontend      | React + Next.js (App Router)     |
| Backend       | Next.js API Routes               |
| Base de datos | Neon (PostgreSQL serverless)     |
| ORM           | Prisma                           |
| Estilos       | Tailwind CSS v4                  |
| Testing       | Vitest                           |
| Iconos        | Lucide React                     |

---

## Requisitos

- Node.js 22 LTS o superior
- npm 10+ o pnpm
- Una cuenta en [Neon](https://neon.tech) (gratuita, para la base de datos)

---

## Instalación y uso local

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd tasq

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la DATABASE_URL de Neon

# 4. Generar el cliente Prisma
npx prisma generate

# 5. Aplicar migraciones a la base de datos
npx prisma migrate dev

# 6. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Comandos disponibles

| Comando                  | Descripción                             |
|--------------------------|-----------------------------------------|
| `npm run dev`            | Inicia servidor de desarrollo           |
| `npm run build`          | Compila para producción                 |
| `npm run lint`           | Ejecuta linter                          |
| `npm test`               | Ejecuta tests unitarios                 |
| `npm run test:watch`     | Tests en modo watch                     |
| `npx prisma generate`    | Genera el cliente Prisma                |
| `npx prisma migrate dev` | Crea y aplica una migración             |
| `npx prisma db push`     | Sincroniza schema con la base de datos  |
| `npx prisma studio`      | Abre el explorador visual de datos      |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx            # Layout raíz
│   ├── page.tsx              # Página principal
│   ├── globals.css           # Estilos globales + tema Tailwind
│   └── api/
│       ├── lists/            # API de listas
│       └── tasks/            # API de tareas
├── components/
│   ├── ui/                   # Primitivas (Button, Input, Modal, etc.)
│   ├── lists/                # Componentes de listas
│   └── tasks/                # Componentes de tareas
├── generated/
│   └── prisma/               # Cliente Prisma generado (no se commitea)
├── lib/
│   ├── prisma.ts             # Cliente Prisma singleton
│   ├── validators.ts         # Validaciones
│   └── utils.ts              # Utilidades
├── hooks/
│   ├── useLists.ts           # Hook de listas
│   └── useTasks.ts           # Hook de tareas
prisma/
├── schema.prisma             # Schema de datos
└── migrations/               # Migraciones
```

---

## Documentación del proyecto

Los documentos de diseño y especificación se encuentran en la carpeta [`sdd/`](sdd/):

| Archivo | Contenido |
|---------|-----------|
| `sdd/functional-specs.md` | Especificaciones funcionales (requisitos, reglas de negocio, UX) |
| `sdd/technical-specs.md`  | Especificaciones técnicas (arquitectura, API, componentes, schema) |
| `sdd/phases.md`           | Plan de trabajo por fases con estimaciones |

> ⚠️ Este README debe mantenerse sincronizado con los cambios del proyecto. Si se modifican rutas, dependencias o funcionalidades, actualiza este documento.

---

## Licencia

MIT
