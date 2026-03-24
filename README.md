# Gaspre Challenge – Backend Developer

## Instrucciones de ejecución

### Requisitos

- Node.js >= 18
- npm

### Instalación

```bash
npm install
```

### Correr los tests

```bash
npm test
```

### Correr en modo desarrollo (servidor HTTP)

```bash
npm run dev
```

El servidor levanta en `http://localhost:3000` (configurable vía `.env`).

### Build para producción

```bash
npm run build
npm start
```

---

## Endpoints HTTP

| Método | Ruta               | Descripción                                      |
|--------|--------------------|--------------------------------------------------|
| GET    | `/categories`      | Devuelve todas las rutas de hojas activas        |
| GET    | `/categories/:id`  | Busca una categoría por ID en toda la jerarquía  |

**Ejemplo:**

```
GET /categories/5
→ { node, path, depth, parentId, isLeaf }
```

---

## Fases completadas

### Fase 1 – `getActiveLeafPaths`

Recorre el árbol y devuelve las rutas completas de todas las categorías hoja activas, ordenadas alfabéticamente.

Retorna `undefined` si la raíz está inactiva. Retorna `[]` si no hay hojas activas.

### Fase 2 – `findCategoryById`

Busca una categoría por ID en cualquier nivel de profundidad. Retorna:

- el nodo encontrado
- su path completo desde la raíz
- su profundidad (`depth`)
- el `parentId` (o `null` si es la raíz)
- si es hoja o no

Retorna `null` si el ID no existe.

---

## Supuestos tomados

- La estructura de entrada en Fase 1 y Fase 2 es válida (nodos bien formados, sin ciclos ni IDs duplicados), según lo indicado en la consigna.
- El `depth` de la raíz es `0`. La profundidad se incrementa al descender.
- Un nodo con `active: false` corta toda su rama: sus descendientes no se procesan ni se incluyen en resultados, aunque individualmente estén activos.
- `findCategoryById` no filtra por `active`: devuelve el nodo aunque esté inactivo, ya que la búsqueda por ID es una consulta de existencia, no de navegación activa.
- El dato de entrada (`DATA`) es un mock estático en `src/repositories/mock/data.ts`. En un contexto real se reemplazaría por una fuente externa.

---

## Decisiones principales

### Separación de responsabilidades

- `Category.ts` – tipos de dominio
- `category.service.ts` – lógica de negocio pura (sin dependencias HTTP)
- `category.controller.ts` – capa HTTP, delega en el service
- `category.routes.ts` – definición de rutas Express

### `getActiveLeafPaths`: función pública + método privado

La lógica recursiva se separó en un método privado `collectLeafPaths` para que la firma pública sea limpia y el `sort()` se ejecute una sola vez al finalizar el recorrido, no en cada frame recursivo.

### `findCategoryById`: closure interno

La función auxiliar de búsqueda se define como closure dentro del método público para encapsular los parámetros de estado (`depth`, `parentId`, `currentPath`) sin exponerlos en la API pública del service.
