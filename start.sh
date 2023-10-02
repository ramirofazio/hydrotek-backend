#!/bin/sh

# Ejecuta las migraciones de Prisma
npx prisma migrate deploy
npx prisma generate

# Inicia tu aplicación
npm run build
npm run start:prod