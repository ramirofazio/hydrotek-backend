#!/bin/sh

# Ejecuta contenedor DB
docker compose up postgres --build -d

# Ejecuta las migraciones de Prisma
npx prisma migrate dev
npx prisma generate

# Inicia tu aplicación
npm run start:dev