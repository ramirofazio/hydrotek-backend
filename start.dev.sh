#!/bin/sh

# Ejecuta contenedor DB
docker compose up db --build -d

# Ejecuta las migraciones de Prisma
npx prisma migrate deploy
npx prisma generate

# Inicia tu aplicación
npm run start:dev