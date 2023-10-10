#!/bin/sh

# Ejecuta contenedor DB
docker compose -p hydrotek up postgres --build -d

# Espera 40 segundos
sleep 40

# Ejecuta las migraciones de Prisma
npx prisma migrate dev
npx prisma generate

# Inicia tu aplicación
npm run start:dev
