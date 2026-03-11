# Manual técnico

## 3. Descripción funcional de la aplicación
1. Gestión de contactos (Personas) y grupos.
2. Alta, edición, listado de ambos.
3. Relación persona-grupo: una persona tiene un grupo.
4. UUID obligatorio como identificador interno.
5. Campos de persona: `code`, `nombres`, `apellidos`, `correo`, `celular`, `direccion`, `observaciones`, `fotografia_url`, `esta_activo`, `group_id`.
6. Campos de grupo: `code`, `grupo`, `esta_activo`.

## 4. Requisitos de seguridad
- UUID como clave primaria.
- Comunicación backend-frontend preparada para HTTPS en despliegue.
- Validación de datos y cors en FastAPI.

## Despliegue en Cloud (propuesta)
- Servidores:
  - backend: `api.contactos.example.com` (FastAPI en contenedor Docker en AWS ECS / GCP Cloud Run)
  - frontend: `app.contactos.example.com` (React en Netlify/Vercel)
  - DB: PostgreSQL gestionado (AWS RDS / GCP Cloud SQL)
- Diagrama de red: ver sección siguiente.

## Diagrama de red
- Cliente -> Cloudflare -> Frontend (Vercel) -> API Gateway.
- API Gateway -> Backend FastAPI -> DB PostgreSQL (RDS)
- Dominios & IPs ficticios:
  - frontend: `app.contactos.example.com` (34.120.0.1)
  - backend: `api.contactos.example.com` (34.120.0.2)
  - db: `postgres-contactos.example.com` (10.0.1.10)

## Link GitHub
- https://github.com/usuario/contactos-app  (Reemplazar con el repositorio real)
