#!/bin/sh

docker compose down

sleep 5
# Ejecuta contenedor DB
docker compose -p hydrotek up postgres --build -d

# Espera 20 segundos
sleep 20

# Ejecuta las migraciones de Prisma
npx prisma migrate dev
npx prisma generate

# Inicia tu aplicación
npm run start:dev
