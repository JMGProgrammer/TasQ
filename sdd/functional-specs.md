# TasQ — Especificaciones Funcionales

> **Versión:** 1.1  
> **Última actualización:** 08/06/2026  
> **Stack tecnológico:** Node.js / TypeScript · React + Next.js · Neon + Prisma

---

## 1. Resumen del producto

**TasQ** es una aplicación web sencilla para la gestión de tareas (todolist) orientada a un solo usuario, con posibilidad de evolución futura a multiusuario. Permite organizar tareas en múltiples listas o proyectos, asignarles prioridad, categorías, fechas de vencimiento y descripciones.

---

## 2. Arquitectura general

| Capa          | Tecnología                        | Notas                                    |
|---------------|-----------------------------------|------------------------------------------|
| Frontend      | React + Next.js                   | App Router, Server Components            |
| Backend       | Next.js API Routes (Node.js/TS)   | Rutas API dentro del mismo proyecto      |
| Base de datos | Neon (PostgreSQL)                 | Conexión remota vía Prisma               |
| ORM           | Prisma                            | Schema, migraciones, cliente tipado      |
| Despliegue    | Vercel (futuro)                   | Por ahora se ejecuta localmente          |

---

## 3. Roles de usuario

| Rol         | Descripción                                        | ¿Implementado? |
|-------------|----------------------------------------------------|----------------|
| Usuario único | Un solo usuario gestiona todas las tareas         | Sí (v1.0)     |
| Multiusuario  | Varios usuarios con autenticación y datos aislados | No (futuro)   |

---

## 4. Funcionalidades por módulo

### 4.1 Gestión de listas / proyectos

| ID     | Funcionalidad              | Descripción                                                       | Prioridad |
|--------|----------------------------|-------------------------------------------------------------------|-----------|
| F-001  | Crear lista                | El usuario puede crear una nueva lista con nombre y color opcional | Alta      |
| F-002  | Listar listas              | Ver todas las listas creadas                                      | Alta      |
| F-003  | Editar lista               | Modificar nombre o color de una lista existente                   | Media     |
| F-004  | Eliminar lista             | Eliminar una lista y todas sus tareas asociadas (con confirmación)| Alta      |
| F-005  | Seleccionar lista activa   | Navegar entre listas para ver solo sus tareas                     | Alta      |

### 4.2 Gestión de tareas

| ID     | Funcionalidad              | Descripción                                                       | Prioridad |
|--------|----------------------------|-------------------------------------------------------------------|-----------|
| F-006  | Crear tarea                | Crear tarea con título (req), descripción, fecha, prioridad, categorías | Alta |
| F-007  | Listar tareas              | Ver tareas de la lista activa, ordenadas por defecto por fecha de creación descendente | Alta |
| F-008  | Editar tarea               | Modificar cualquier campo de una tarea existente                  | Alta      |
| F-009  | Completar tarea            | Marcar/desmarcar tarea como completada (toggle)                   | Alta      |
| F-010  | Eliminar tarea             | Eliminar una tarea (con confirmación)                             | Alta      |

### 4.3 Campos de una tarea

| Campo         | Tipo     | Requerido | Descripción                                  |
|---------------|----------|-----------|----------------------------------------------|
| ID            | UUID     | Auto      | Identificador único                          |
| Título        | string   | Sí        | Nombre breve de la tarea                     |
| Descripción   | text     | No        | Detalle opcional                             |
| Fecha límite  | date     | No        | Fecha de vencimiento                         |
| Prioridad     | enum     | No        | Alta · Media · Baja (por defecto: Media)     |
| Categorías    | string[] | No        | Etiquetas para clasificar (ej: "frontend", "bug") |
| Completada    | boolean  | Auto      | false por defecto                            |
| Lista ID      | UUID     | Sí        | Relación con la lista padre                  |
| Creada        | timestamp| Auto      | Fecha de creación                            |
| Actualizada   | timestamp| Auto      | Fecha de última modificación                 |

### 4.4 Filtros y ordenamiento

| ID     | Funcionalidad                    | Descripción                                              | Prioridad |
|--------|----------------------------------|----------------------------------------------------------|-----------|
| F-011  | Filtrar por lista                | Mostrar solo tareas de la lista seleccionada             | Alta      |
| F-012  | Filtrar por prioridad            | Mostrar solo tareas de una prioridad específica          | Alta      |
| F-013  | Filtrar por estado               | Mostrar solo pendientes, solo completadas, o todas       | Alta      |
| F-014  | Búsqueda por texto (futuro)      | Filtrar tareas que contengan texto en título o descripción | Baja    |
| F-015  | Filtrar por categoría (futuro)   | Filtrar por una o más categorías                         | Baja      |
| F-016  | Filtrar por fecha (futuro)       | Filtrar por rango de fechas de vencimiento               | Baja      |

### 4.5 Experiencia de usuario (UX)

| ID     | Funcionalidad                    | Descripción                                              | Prioridad |
|--------|----------------------------------|----------------------------------------------------------|-----------|
| F-017  | Interfaz responsive              | Adaptable a móvil, tablet y desktop                      | Alta      |
| F-018  | Confirmación en eliminaciones    | Diálogo de confirmación antes de eliminar tareas/listas  | Alta      |
| F-019  | Feedback visual                  | Notificaciones toast o mensajes de éxito/error           | Media     |
| F-020  | Temas claro/oscuro               | Selector de tema con persistencia en localStorage        | Media     |
| F-021  | Atajos de teclado (futuro)       | Atajos para acciones comunes (crear tarea, navegar)      | Baja      |

---

## 5. Reglas de negocio

| ID  | Regla                                                            |
|-----|------------------------------------------------------------------|
| RN-01 | Una tarea pertenece exactamente a una lista.                    |
| RN-02 | Al eliminar una lista, se eliminan todas sus tareas.            |
| RN-03 | Una tarea puede tener cero o varias categorías.                 |
| RN-04 | El título de la tarea no puede estar vacío (mín. 1 carácter).   |
| RN-05 | El nombre de la lista no puede estar vacío.                     |
| RN-06 | Las tareas completadas se muestran visualmente diferenciadas (tachadas, opacidad reducida). |

---

## 6. Interfaces externas

| Sistema       | Tipo         | Propósito                          | Estado     |
|---------------|--------------|------------------------------------|------------|
| Neon          | Base de datos| Almacenamiento PostgreSQL serverless| v1.0       |
| Prisma        | ORM          | Cliente tipado, migraciones        | v1.0       |

---

## 7. Criterios de aceptación generales

- La aplicación debe ejecutarse localmente con `npm run dev`.
- Todas las operaciones CRUD deben reflejarse en la UI sin necesidad de recargar la página.
- Los datos deben persistir en Neon (PostgreSQL serverless).
- El código debe incluir tests unitarios para la lógica crítica (utilidades, hooks, API routes).
- El diseño debe ser limpio, minimalista y responsive.

---

## 8. Glosario

| Término     | Definición                                        |
|-------------|---------------------------------------------------|
| Lista       | Conjunto de tareas agrupadas bajo un nombre.      |
| Tarea       | Elemento atómico de trabajo a realizar.           |
| Prioridad   | Nivel de importancia: Alta, Media, Baja.          |
| Categoría   | Etiqueta textual para clasificar tareas.          |
| Completada  | Estado final de una tarea realizada.              |
