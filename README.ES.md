# Huella — Backend

API REST de **Huella**, una plataforma para reportar mascotas perdidas y avistadas, y conectar a las personas con organizaciones de rescate animal.

Construido con Express 5, Sequelize (PostgreSQL) y Supabase (Auth + Storage).

- Repositorio del frontend: [HuellaDev/frontend](https://github.com/HuellaDev/frontend)
- Documentación de la API (Postman): [Ver colección](https://documenter.getpostman.com/view/47022693/2sBYArUsef)
- API en producción: [huella-backend-k28p.onrender.com](https://huella-backend-k28p.onrender.com)

## Stack tecnológico

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **ORM / DB:** Sequelize + PostgreSQL
- **Auth y Storage:** Supabase
- **Subida de archivos:** Multer
- **Notificaciones push:** web-push
- **Seguridad / logging:** Helmet, Morgan, CORS

## Requisitos

- Node.js 18+
- pnpm
- Base de datos PostgreSQL (alojada en Supabase o propia)
- Proyecto de Supabase (Auth + Storage)

## Instalación

```bash
git clone https://github.com/HuellaDev/backend.git
cd backend
pnpm install
cp .env.example .env   # completa las variables de abajo
pnpm start
```

Para recarga automática en desarrollo:

```bash
npx nodemon app.js
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que escucha el servidor. |
| `NODE_ENV` | `development` habilita el logging de peticiones (Morgan). |
| `CORS_ORIGINS` | Orígenes permitidos para CORS, separados por comas. |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. |
| `SUPABASE_PROJECT_URL` | URL del proyecto de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role de Supabase. Solo servidor — verifica JWTs, administra Storage y usuarios de Auth. Nunca la expongas al cliente. |
| `VAPID_PUBLIC_KEY` | Clave pública VAPID para Web Push. |
| `VAPID_PRIVATE_KEY` | Clave privada VAPID para Web Push. |

## Estructura del proyecto

```
Backend-ia/
├── app.js              # Punto de entrada
├── server/Server.js    # Configuración de Express, middlewares, montaje de rutas
├── routers/             # Definición de rutas por recurso
├── controllers/         # Manejadores de peticiones / lógica de negocio
├── middlewares/          # Auth, admin, subida de archivos, manejo de errores
├── models/               # Modelos de Sequelize + asociaciones
├── db/                   # Configuración de clientes Sequelize y Supabase
└── helpers/              # AppError, catchAsync, validateEnv, etc.
```

## Resumen de la API

Todas las rutas están montadas bajo `/api/huella`.

| Recurso | Path base | Notas |
|---|---|---|
| Perfil | `/api/huella/profile` | Perfil del usuario actual, eliminación de cuenta |
| Reportes de pérdida | `/api/huella/lost-reports` | Reportar una mascota perdida |
| Reportes de avistamiento | `/api/huella/sighting-reports` | Reportar el avistamiento de una mascota |
| Fotos | `/api/huella/photos` | Subir/eliminar fotos ligadas a reportes |
| Comentarios | `/api/huella/comments` | Comentarios en los reportes |
| Notificaciones | `/api/huella/notifications` | Notificaciones dentro de la app |
| Organizaciones | `/api/huella/organizations` | Organizaciones de rescate/ayuda |
| Push | `/api/huella/push` | Manejo de suscripciones Web Push |
| Health | `/api/huella/health` | Verificación de salud del servicio |

Referencia completa de endpoints, cuerpos de petición/respuesta y ejemplos: [documentación en Postman](https://documenter.getpostman.com/view/47022693/2sBYArUsef).

## Autenticación

Manejada con Supabase Auth. Las rutas protegidas requieren:

```
Authorization: Bearer <supabase_access_token>
```

- `requireAuth` — valida el token contra Supabase.
- `attachProfile` — carga (o crea) la fila correspondiente en `profiles`.
- `requireAdmin` / `requireRole` — restringen rutas exclusivas de administradores.

## Base de datos

El esquema vive en Supabase/PostgreSQL y se refleja en los modelos de Sequelize dentro de `models/`.

Tablas principales: `profiles`, `organizations`, `animals`, `animal_profiles`, `lost_reports`, `sighting_reports`, `photos`, `comments`, `notifications`, `push_subscriptions`, `status_history`.

## Licencia

ISC. Ver [LICENSE](./LICENSE).
